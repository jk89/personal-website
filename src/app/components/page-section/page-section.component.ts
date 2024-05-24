import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';
import { AssetManagerService } from 'src/app/services/asset-manager.service';

@Component({
  selector: 'page-section',
  templateUrl: './page-section.component.html',
  styleUrls: ['./page-section.component.scss'],
})
export class PageSectionComponent implements OnInit {

  @Input() rightHanded: boolean = false;
  @Input() iconName: string = "cube-outline";
  @Input() sideHeaderTitle: string = "sideHeaderTitle";
  @Input() sideHeaderSubtitle: string = "sideHeaderSubtitle";
  @Input() blockTitle: string = "blockTitle";
  @Input() blockSubtitle: string = "blockSubTitle";
  @Input() backgroundId: string = null;
  @Input() backgroundURLOverride: string = null;
  @Input() fixedDisplacement: boolean = false;
  @Input() color: string = "secondary";
  @Input() cover: boolean = true;
  private backgroundAsset: any = null;

  @ContentChild('headerTemplate') headerTemplate!: TemplateRef<any>;

  background() {
    // todo improve this
    if (this.backgroundAsset || this.backgroundURLOverride) {

      let bg = null;
      if (this.backgroundURLOverride) {
        bg = this.backgroundURLOverride;
      }
      else if (this.backgroundAsset) {
        bg = `../../../assets/${this.backgroundAsset.webPPath}`;
      }

      let fragment = `background-image: url('${bg}'); background-attachment: fixed; background-position: center;`;
      if (this.cover === true) {
        fragment += "background-size: cover !important;"
      }
      if (this.fixedDisplacement == false) return fragment;
      return `${fragment} background-position: 0px calc(100% + 10px);`
    }
    else return `background: var(--ion-background-color)`;
  }

  constructor(private assetManagerService: AssetManagerService) { }

  ngOnInit() {
    this.backgroundAsset = this.assetManagerService.getAssetData(this.backgroundId);
  }

}
