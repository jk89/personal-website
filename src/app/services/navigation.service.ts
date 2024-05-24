import { ElementRef, Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { asyncScheduler, BehaviorSubject, Observable, Subject, Subscription, timer } from 'rxjs';
import { debounceTime, delay, delayWhen, filter, take, throttleTime } from 'rxjs/operators';
import { NavigationEvent, NavigationEventType, NavigationPageStructure, NavigationSectionIntersectionUpdateEvent, NavigationTree } from '../models/navigation';

@Injectable({
  providedIn: 'root'
})
export class NavigationService implements OnDestroy {

  public navSubject: Subject<NavigationEvent> = new Subject<NavigationEvent>();
  private navEvent$: Observable<NavigationEvent> = this.navSubject.asObservable();
  private currentPageSectionIntersection$s: { [sections: string]: IntersectionObserver } = null;
  private navigationTree: NavigationTree = {}; // e.g. { "/folder/inbox": ["home", "CAD", "Dignissim"] }
  private navigationTreeSubject = new BehaviorSubject<NavigationTree>({});
  private sectionsViewRatioSubject: BehaviorSubject<{ [sectionId: string]: NavigationSectionIntersectionUpdateEvent }>; // create behaviour subject to contain winning observable (highest view ratio)
  private sectionsViewRatio$: Observable<{ [sectionId: string]: NavigationSectionIntersectionUpdateEvent }>;
  private sectionsViewRatioSubscription: Subscription;
  private initedPages: { [pageName: string]: boolean } = {};
  private currentPageSectionNavTreeSubscription: Subscription;
  private currentPageNavTreeSubscription: Subscription;
  private snapDelay = 700;
  private homePauseDelay = 600;
  private intraPageChangeSubscription = this.navEvent$
    .pipe(filter((navEvent) => navEvent.type === NavigationEventType.PageSection))
    .subscribe((e) => {
      history.pushState(null, null, e.fullRelativePath);
    });
  private pageChangeSubscription = this.navEvent$
    .pipe(filter((navEvent) => navEvent.type === NavigationEventType.Page))
    .subscribe((e) => {
      this.performPageChange(e);
    });
  public pageFullyLoadedSubject: Subject<string> = new Subject();
  public pageFullyLoaded$ = this.pageFullyLoadedSubject.asObservable();
  public pageHeaderLoadedSubject: Subject<string> = new Subject();
  public pageHeaderLoaded$ = this.pageHeaderLoadedSubject.asObservable();
  public navigationTree$ = this.navigationTreeSubject
    .asObservable();
  public currentPageSubject: BehaviorSubject<string> = new BehaviorSubject("home");
  public currentPage$ = this.currentPageSubject.asObservable();

  unsubscribeAllIntersectionObservables() {
    // disconnect intersection observables
    if (this.currentPageSectionIntersection$s !== null) {
      Object.keys(this.currentPageSectionIntersection$s).forEach((sections) => {
        this.currentPageSectionIntersection$s[sections].disconnect();
      });
    }
    // empty the container
    this.currentPageSectionIntersection$s = {};
  }

  buildPageSectionIntersectionObservers(navTree: NavigationTree, pageChangeEvent: NavigationEvent) {
    this?.sectionsViewRatioSubscription?.unsubscribe();
    const sectionsViewRatioState: { [sectionId: string]: NavigationSectionIntersectionUpdateEvent } = {};
    this.sectionsViewRatioSubject = new BehaviorSubject<{ [sectionId: string]: NavigationSectionIntersectionUpdateEvent }>(sectionsViewRatioState);
    this.sectionsViewRatio$ = this.sectionsViewRatioSubject.asObservable();
    let lastWinner: string = null;
    let lastAreaStateObj: any = {};

    const mergeViewRationStates = (sectionId: string, entry: NavigationSectionIntersectionUpdateEvent) => {
      sectionsViewRatioState[sectionId] = entry;
    };

    const calculateAreaGlobalObj = (viewRatioUpdate) => {
      let areaState = {};
      Object.keys(viewRatioUpdate).forEach((sectionName: string) => {
        areaState[sectionName] = viewRatioUpdate[sectionName].viewableArea;
      });
      return areaState;
    };

    const calculateStateObjDiff = (newStateObj) => {
      const delta = {};
      Object.keys(newStateObj).forEach((newStateObjKey) => {
        const newValue = newStateObj[newStateObjKey];
        const oldValue = lastAreaStateObj[newStateObjKey];
        if (newValue != oldValue) {
          delta[newStateObjKey] = { old: oldValue, new: newValue };
        }
      });
      return delta;
    };

    this.sectionsViewRatioSubscription = this.sectionsViewRatio$.subscribe((viewRatioUpdate) => {
      // find the maximum view ration
      let maxViewRatio = 0;

      const currentAreaStateObj = calculateAreaGlobalObj(viewRatioUpdate);
      const stateDiffObj = calculateStateObjDiff(currentAreaStateObj);
      const stateHasChanged = Object.keys(stateDiffObj).length !== 0;

      const winnerName: string = Object.keys(viewRatioUpdate).reduce((acc: string, sectionName) => {
        const currentState = viewRatioUpdate[sectionName];
        const viewRatio = currentState.viewableArea || 0;
        if (viewRatio > maxViewRatio && stateHasChanged) {
          maxViewRatio = viewRatio;
          acc = sectionName;
        }
        else if (viewRatio === maxViewRatio) {
          if (sectionName != lastWinner && stateHasChanged && Object.keys(stateDiffObj).includes(sectionName)) { // the state changes which was the old winner or the new one
            maxViewRatio = viewRatio;
            acc = sectionName;
          }
        }
        return acc;
      }, null);
      // fire intra nav subject if we scroll past a content section
      if (winnerName && (Object.keys(stateDiffObj).includes(winnerName) || Object.keys(stateDiffObj).includes(lastWinner))) {
        this.navSubject.next(viewRatioUpdate[winnerName].navEvent);
        lastWinner = winnerName;
        lastAreaStateObj = currentAreaStateObj;
      }
    });

    // we can assume navTree is up to date now
    const pageName = pageChangeEvent.pagePath;
    // build intersection observers
    const pageContentElementsRef = navTree[pageName];
    const sectionses = Object.keys(pageContentElementsRef);
    sectionses.forEach((sections) => {
      // get content element
      const elementRef = pageContentElementsRef[sections];
      const nativeElement = elementRef.nativeElement;
      const options: IntersectionObserverInit = {
        rootMargin: '0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      };

      this.currentPageSectionIntersection$s[sections]
        = new IntersectionObserver(
          (data: IntersectionObserverEntry[]) => {
            const intersection = data[0];
            mergeViewRationStates(sections, {
              viewableArea: intersection.intersectionRatio,
              navEvent: {
                type: NavigationEventType.PageSection,
                section: sections,
                host: document.location.host,
                pagePath: pageName,
                url: document.location.href,
                fullRelativePath: `${pageName}/${sections}`
              },
              isIntersecting: intersection.isIntersecting
            });
            this.sectionsViewRatioSubject.next(sectionsViewRatioState);
          },
          options);

      // observe element or title preferably
      this.currentPageSectionIntersection$s[sections]
        .observe(nativeElement);
    });
  }


  changePageSection(pagePath: string, section: string) {
    /*

      fullRelativePath: "/teams/Dignissim#Home"
      section: "Home"
      host: "localhost:4200"
      pagePath: "/teams/Dignissim"
      type: "Page"
      url: "http://localhost:4200/teams/Dignissim"

    */
    const nextPage = {
      type: NavigationEventType.PageSection,
      section,
      host: document.location.host,
      pagePath,
      fullRelativePath: `${pagePath}/${section}`,
      url: document.location.href
    };
    this.navSubject.next(
      nextPage
    );
    this.performPageSectionChange(nextPage);
  }

  changePage(pagePath: string, section: string) {
    /*

      fullRelativePath: "/teams/Dignissim/Home"
      section: "Home"
      section: "localhost:4200"
      pagePath: "/teams/Dignissim"
      type: "Page"
      url: "http://localhost:4200/teams/Dignissim"

    */
    const nextPage = {
      type: NavigationEventType.Page,
      section,
      host: document.location.host,
      pagePath,
      fullRelativePath: `${pagePath}/${section}`,
      url: document.location.href
    };
    this.navSubject.next(
      nextPage
    );
  }

  performPageSectionChange(pageChangeEvent: NavigationEvent) {
    if (this.currentPageSectionNavTreeSubscription) this.currentPageSectionNavTreeSubscription.unsubscribe();
    this.currentPageSectionNavTreeSubscription = this.navigationTree$.subscribe(async (navTree) => {
      if (!navTree[pageChangeEvent.pagePath]) return;
      if (!navTree[pageChangeEvent.pagePath][pageChangeEvent.section]) return;
      const element = navTree[pageChangeEvent.pagePath][pageChangeEvent.section].nativeElement;
      element.scrollIntoView({ behavior: "smooth" });
      await new Promise((res) => setTimeout(res, this.snapDelay));
      element.scrollIntoView(true);
    });
  }

  performPageChange(pageChangeEvent: NavigationEvent) {
    const visited = this.initedPages[pageChangeEvent.pagePath];
    // remove intersection observers from last page
    this.unsubscribeAllIntersectionObservables();
    // wait for page content elements to register themselves with the nav tree
    if (this.currentPageNavTreeSubscription) this.currentPageNavTreeSubscription.unsubscribe();
    this.currentPageNavTreeSubscription = this.navigationTree$
      .pipe(
        // delayWhen(() => this.pageHeaderLoaded$), // wait for page to be loaded
        filter((nt) => {
          if (!nt[pageChangeEvent.pagePath]) return false;
          if (!nt[pageChangeEvent.pagePath][pageChangeEvent.section]) return false;
          return true;
        }),
        throttleTime(100, asyncScheduler, { trailing: true, leading: false })
      )
      .subscribe(async (navTree) => {
        if (visited) {
          navTree[pageChangeEvent.pagePath]["Home"].nativeElement.parentElement.scrollIntoView();
        }

        this.buildPageSectionIntersectionObservers(navTree, pageChangeEvent);

        // scroll to content section
        if (pageChangeEvent.section && pageChangeEvent.section != "Home") {
          await new Promise((res) => setTimeout(res, this.homePauseDelay)); // pause at home section
          if (!navTree[pageChangeEvent.pagePath]) return;
          if (!navTree[pageChangeEvent.pagePath][pageChangeEvent.section]) return;
          const element = navTree[pageChangeEvent.pagePath][pageChangeEvent.section].nativeElement;
          element.scrollIntoView({ behavior: "smooth" });
          await new Promise((res) => setTimeout(res, this.snapDelay));
          element.scrollIntoView(true); // snap to position as smooth is buggy sometimes during page load (depends on client)
        }

        this.pageFullyLoadedSubject.next(pageChangeEvent.fullRelativePath);
        this.initedPages[pageChangeEvent.pagePath] = true;
      }
      );
  }

  public addNavigationRoute(pagePath: string, pageSection: string, pageElementRef: ElementRef) {
    if (!this.navigationTree[pagePath]) {
      this.navigationTree[pagePath] = {};
    }
    this.navigationTree[pagePath][pageSection] = pageElementRef;
    this.navigationTreeSubject.next(this.navigationTree);
  }

  ngOnDestroy() {
    this.pageChangeSubscription.unsubscribe();
    this.currentPageNavTreeSubscription.unsubscribe();
    this.unsubscribeAllIntersectionObservables();
    this.intraPageChangeSubscription.unsubscribe();
    this?.sectionsViewRatioSubscription?.unsubscribe();
  }

  constructor(private router: Router) {

  }

}
