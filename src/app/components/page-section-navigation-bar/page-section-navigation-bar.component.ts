import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delayWhen, filter, map, take } from 'rxjs/operators';
import { NavigationEventType } from 'src/app/models/navigation';
import { NavigationService } from 'src/app/services/navigation.service';
import { appPages } from "../../routes";

@Component({
  selector: 'page-section-navigation-bar',
  templateUrl: './page-section-navigation-bar.component.html',
  styleUrls: ['./page-section-navigation-bar.component.scss'],
})
export class PageSectionNavigationBarComponent implements OnInit, AfterViewChecked, OnDestroy {

  @Input("basePath") basePath: string;
  @ViewChild("toolbar") toolbar: ElementRef<HTMLElement>;
  private sectionName: string = null;
  private sectionNameOrPathSuffix: string = null;
  private navHeight: number = null;
  private links = [];
  private activeIndex = 0;
  private hoverTitle: string = null;
  private pageNavigationSubscription: Subscription;
  private intraPageNavigationSubscription: Subscription;
  private pathFragment: string = null;
  private icon: string = "accessibility";
  private inited = false;
  private links$ = this.navService.navigationTree$
    .pipe(
      filter((nt) => {
        if (!nt[this.basePath]) return false;
        return true;
      }),
      map((navTree) => {
        return Object.keys(navTree[this.basePath])
          .map((contentSection) => `${this.basePath}/${contentSection}`)
      })
    );
  private linksSubcription = this.links$.subscribe((links) => this.links = links);

  constructor(private router: Router, public navService: NavigationService, private ref: ChangeDetectorRef, private route: ActivatedRoute) {
    route.params.subscribe(val => {
      if (this.inited) {
        this.ngOnDestroy();
        this.ngOnInit();
      }
    });
  }

  ngOnDestroy(): void {
    this.linksSubcription.unsubscribe();
    this.pageNavigationSubscription.unsubscribe();
    this.intraPageNavigationSubscription.unsubscribe();
  }

  async seeIfPageHeaderIsLoaded() {
    if (this.navHeight === null) {
      const navHeight = window.getComputedStyle(this.toolbar.nativeElement).height;
      if (navHeight.includes("px")) {
        this.navHeight = parseInt(navHeight.split("px")[0]);
        this.navService.pageHeaderLoadedSubject.next(this.basePath);
      }
    }
  }

  private toPascalCase(input:string) {
    const [firstLetter, ...restOfString] = input;
    return `${firstLetter.toUpperCase()}${restOfString.join('')}`; 
  }

  mouseOver(index: number, link: string) {
    let section = link.split(`${this.basePath}/`)[1];
    if (section === this.sectionName) { // if on the same page hide hover behaviour
      this.mouseOut();
    }
    else {
      this.hoverTitle = section;
      this.hoverTitle = section === "Home" ? this.basePath.split("/").slice(-1)[0] : section || "UNKNOWN";
      this.hoverTitle = this.toPascalCase(this.hoverTitle);
    }
  }

  mouseOut() { this.hoverTitle = null; }

  changePageSection(link: string) {
    let section = link.split(`${this.basePath}/`)[1];
    if (section) {
      this.navService.changePageSection(this.basePath, section);
    }
  }

  ngAfterViewChecked(): void {
    this.seeIfPageHeaderIsLoaded();
  }

  iconName() {
    return `${this.icon}-outline`
  }

  ngOnInit() {
    this.intraPageNavigationSubscription = this.navService.navSubject
      .pipe(
        filter((e) => e.type === NavigationEventType.PageSection),
      )
      .subscribe((e) => {
        this.sectionName = e.section;
        this.sectionNameOrPathSuffix = e.section === "Home" ? e.pagePath.split("/").slice(-1)[0] : e.section || "UNKNOWN";
        this.sectionNameOrPathSuffix = this.toPascalCase(this.sectionNameOrPathSuffix);
        this.activeIndex = this.links.indexOf(e.fullRelativePath);
        if (this.activeIndex == -1) this.activeIndex = 0;
        this.ref.detectChanges();
        this.mouseOut();
      });
    this.pageNavigationSubscription = this.navService.navSubject
      .pipe(
        filter((e) => e.type === NavigationEventType.Page),
        delayWhen(() => this.navService.pageHeaderLoaded$)
      )
      .subscribe((e) => {
        this.sectionName = e.section;
        this.sectionNameOrPathSuffix = e.section === "Home" ? e.pagePath.split("/").slice(-1)[0] : e.section || "UNKNOWN";
        this.sectionNameOrPathSuffix = this.toPascalCase(this.sectionNameOrPathSuffix);
        this.pathFragment = e.pagePath;
        // find url routes
        const route = appPages.find((page) => page.url === this.pathFragment);
        this.icon = route.icon;
        this.activeIndex = this.links.indexOf(e.fullRelativePath);
        if (this.activeIndex == -1) this.activeIndex = 0;
        this.ref.detectChanges();
      });
    this.activeIndex = 0;
    this.navService.changePage(this.basePath, this.route.snapshot.paramMap.get("id") || "Home");
    this.inited = true;
  }

}
