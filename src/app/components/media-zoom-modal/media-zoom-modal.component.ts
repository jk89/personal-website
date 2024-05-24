import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { MediaType } from 'src/app/models/media';
import { AssetManagerService, AssetMetaData } from 'src/app/services/asset-manager.service';
import { CookieService } from 'src/app/services/cookie.service';

@Component({
  selector: 'app-media-zoom-modal',
  templateUrl: './media-zoom-modal.component.html',
  styleUrls: ['./media-zoom-modal.component.scss'],
})
export class MediaZoomModalComponent implements OnInit {

  @Input("id") id = null;
  @Input("ids") ids = null;
  @Input("idx") idx = null;
  @Input("relativePathToAssets") relativePathToAssets = "../../../assets/";
  private multiMedia: boolean = false;
  private currentAssetId: string = null;
  private assetData: AssetMetaData = null;
  private allMediaTypes = MediaType;
  private fullMediaPath: string = null;
  private alternativeMediaPath: string = null;
  private videoStyle: string = "";
  private acceptedCookie: Observable<boolean>;
  private cookiePlatform: string = null;
  private shortId: string = "";

  constructor(private modal: ModalController, private cookieService: CookieService, private assetManagerService: AssetManagerService) { }

  acceptCookie(){
    this.cookieService.acceptCookie(this.cookiePlatform);
  }

  forward() {
    const mod = this.ids.length;
    this.idx = (((this.idx + 1) % mod) + mod) % mod;
    this.loadMedia(this.ids[this.idx]);
  }
  backward() {
    const mod = this.ids.length;
    this.idx = (((this.idx - 1) % mod) + mod) % mod;
    this.loadMedia(this.ids[this.idx]);
  }

  loadMedia(id: string) {
    this.assetData = this.assetManagerService.getAssetData(id);
    this.currentAssetId = id;
    const idSplit =  id.split("/");
    this.shortId = idSplit[idSplit.length - 1];
    if (this.assetData.type === MediaType.Image ) { // 
      this.fullMediaPath = `${this.relativePathToAssets}${this.assetData.webPPath}`;
    }
    else if (this.assetData.type === MediaType.Video ) {
      this.fullMediaPath = `${this.relativePathToAssets}${this.id}`;
      this.alternativeMediaPath = `${this.relativePathToAssets}${this.assetData.webMPath}`;
    }
    else if (this.assetData.type === MediaType.FusionModel) {
      this.cookiePlatform = "fusion";
      this.acceptedCookie = this.cookieService.hasAccepted(this.cookiePlatform);
      this.fullMediaPath = this.assetData.iframePath;
    }
  }

  ngOnInit() {
    if (this.id != null) {
      this.multiMedia = false;
      this.loadMedia(this.id);
    }
    else if (this.id == null && this.ids != null && this.idx != null) {
      if (!Array.isArray(this.ids)) {
        return console.error("ids input is not an array of strings");
      }
      else {
        if (this.ids.some(it => typeof it !== "string")) {
          return console.error("ids input is not an array of strings");
        }
        if (!(Number.isInteger(this.idx) && Math.sign(this.idx) >= 0)) {
          return console.error("idx is not a positive integer");
        }
        if (this.idx >= this.ids.length) {
          return console.error("idx is not found in ids");
        }
      }
      this.multiMedia = true;
      this.loadMedia(this.ids[this.idx]);
    }
    else {
      return console.error("Failed to load relevant media id");
    }
  }

  dismiss() {
    this.modal.dismiss();
  }

}
