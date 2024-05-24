import { Injectable } from '@angular/core';
import * as staticAssetMetaData from "../assetDescriptors.json";
import { MediaType } from '../models/media';

const defaultAssetId = "ASSETNOTFOUND.png";

export interface AssetMetaData {
  type: MediaType;
  color?: string;
  height?: number;
  width?: number;
  aspectRatio?: number;
  webPPath?: string;
  webMPath?: string;
  movPath?: string;
  extension?: string;
  thumbnailAssetId?: string;
  iframePath?: string;
}
@Injectable({
  providedIn: 'root'
})
export class AssetManagerService {

  private assetMetaData: { [assetId: string]: AssetMetaData } = staticAssetMetaData as any;

  public getAssetData(assetId: string) {
    return this.assetMetaData[assetId] || this.assetMetaData[defaultAssetId];
  }

  public getAssetImagePath(assetId: string) {
    const assetData = this.getAssetData(assetId);
    if (assetData.type !== MediaType.Image) throw `${assetId} is not an image`;
    return assetData.webPPath || assetId;

  }

  public getAssetOriginalPath(assetId: string) {
    return assetId;
  }

  private addExtraAssets(assetId: string, assetMetaData: AssetMetaData) {
    if (Object.keys(this.assetMetaData).includes(assetId)) throw `AssetId: ${assetId} already exists`;
    this.assetMetaData[assetId] = assetMetaData;
  }

  constructor() {
    this.addExtraAssets("cup", {
      type: MediaType.FusionModel,
      iframePath: "https://a360.co/3MvYdiL",
      thumbnailAssetId: "other/cad/cup.png"
    });
    this.addExtraAssets("3balls", {
      type: MediaType.FusionModel,
      iframePath: "https://a360.co/3WMMCDy",
      thumbnailAssetId: "other/cad/website-asset.png"
    });
    this.addExtraAssets("sierpinski_gasket_1", {
      type: MediaType.EmbeddedDom,
      thumbnailAssetId: "other/webgpu/sierpinski-gasket.png"
    });
    this.addExtraAssets("sierpinski_gasket_2", {
      type: MediaType.EmbeddedDom,
      thumbnailAssetId: "other/webgpu/sierpinski-gasket-penta.png"
    });
  }
}
