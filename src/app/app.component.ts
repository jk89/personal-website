import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { appPages } from './routes';
import { NavigationService } from './services/navigation.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = appPages;
  @ViewChild('routerOutlet') routerOutlet: ElementRef<HTMLElement>;

  menuClose() {
    this.routerOutlet.nativeElement.classList.add("remove-3d-transform");
  }

  menuOpen() {
    this.routerOutlet.nativeElement.classList.remove("remove-3d-transform");
  }

  safariFix(): void {
    // ios
    const iOSRemoveBackgroundAttachmentClass = document.createElement('style');
    iOSRemoveBackgroundAttachmentClass.innerHTML = `.ios-fixed-pos-fix { background-attachment: unset !important; }`;
    document.getElementsByTagName('head')[0].appendChild(iOSRemoveBackgroundAttachmentClass);
  }

  ngOnInit(): void {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iPad|iPhone|iPod|Mac/.test(window.navigator.userAgent)) {
      // check if a pc rather than a mobile because chrome firefox are fine on macos
      if (userAgent.includes("chrome")) return; // todo check firefox
      this.safariFix();
    }
  }

  constructor(private navigationService: NavigationService) {
    
  }
}
