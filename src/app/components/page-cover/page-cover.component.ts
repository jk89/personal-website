import { Component, Input, OnInit } from '@angular/core';
import { AssetManagerService } from 'src/app/services/asset-manager.service';

@Component({
  selector: 'page-cover',
  templateUrl: './page-cover.component.html',
  styleUrls: ['./page-cover.component.scss'],
})
export class PageCoverComponent implements OnInit {

  @Input("cheveron") cheveron: boolean = false;
  @Input("id") id: string = null;
  @Input("backgroundImageId") backgroundImageId: string = null;
  @Input("pagePath") pagePath: string = null;
  @Input("overrideBackgroundColor") overrideBackgroundColor: string = null;
  @Input("useOriginalPath") useOriginalPath: boolean = false;
  @Input("overrideExternalSrc") overrideExternalSrc: string = null;
  @Input("backgroundSize") backgroundSize: string = null;
  private backgroundColor: string = null;
  private backgroundUrl: string = null;

  getBackgroundStyle() {
    const style = {};
    style["background-color"] = this.backgroundColor;
    if (this.overrideExternalSrc) {
      style["background-image"] = `url("${this.backgroundUrl}")`;
    }
    else {
      style["background-image"] = `url("../../../assets/${this.backgroundUrl}")`;
    }
    if (this.backgroundSize) {
      style["background-size"] = this.backgroundSize;
    }
    else {
      style["background-size"] = "cover";
    }
    return style;
  }

  constructor(private assetManagerService: AssetManagerService) { }

  ngOnInit() {
    if (!this.id) {
      throw "Need a background Id";
    }
    if (!this.overrideExternalSrc) {
      const backgroundAsset = this.assetManagerService.getAssetData(this.backgroundImageId);
      if (!backgroundAsset) {
        throw "No asset data found for this id";
      }
      this.backgroundColor =  backgroundAsset.color;
    }
    
    if (this.overrideBackgroundColor) {
      this.backgroundColor = this.overrideBackgroundColor;
    }

    if (this.overrideExternalSrc) {
      this.backgroundUrl = this.overrideExternalSrc;
    }
    else {
      this.backgroundUrl = (this.useOriginalPath == false) ? this.assetManagerService.getAssetImagePath(this.backgroundImageId) : this.assetManagerService.getAssetOriginalPath(this.backgroundImageId);
    }
  }

}
