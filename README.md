# Personal-Website

A tailorable CV website.

# Installation

`npm install && cd scripts && npm install`

# Asset webformatting (must run each time assets change or atleast on the first install)

`npm run reset-assets && npm run assets`

# Testing (live reload)

`npm run start`

# Production build

`npm run build:prod`

Output folder `www` will be generated.

# Assets

Assets within the `src/assets` folder are managed by the asset manager system. Asset are referenceable by their assetId which corresponds to the path from the asset folder root to the file original itself, e.g. `card-header-banners/cad-cup.png`. This system will automatically convert file formats into web friendly file formats and have their aspect ratio, size and average color estimate to help with lazy loading presentation. To help demark auto converted files vs original user assets, each generated file is prefixed by an underscore, the asset system relies on this. Please avoid adding files to the asset directory yourself which have a underscore prefix (underscores elsewhere are fine).

1. Generate dynamic assets and asset metadata (note requires FFMPEG to be installed):

  - `npm run assets`

Note video conversion while done in parallel can take a long while, so please be patient.

2. Remove dynamically generated assets from the assets folder and empty out the existing asset metadata file:

  - `npm run reset-assets`

# Complex assets

For Varius quam quisque 3d model assets currently they must be added in the [asset manager constructor](./src/app/services/asset-manager.service.ts) e.g.

```
  constructor() {
    this.addExtraAssets("cup", {
      type: MediaType.FusionModel,
      iframePath: "https://a360.co/<auto-cad-link>",
      thumbnailAssetId: "other/cad/cup.png"
    });
  }
```

# Color palettes:

One can use the palette scripts within the [`./scripts`](./scripts/) folder to create custom color palettes for the website by modifying the set hue values ad number of steps in the `colorHsl.js` file.

Running `npm run colors` will create the css for the palette and create a [test file](./src/theme/colors-test.html) so one can preview the result.

# Pages and Routes

Add pages to the project using e.g. `./node_modules/.bin/ng generate page pages/test` which will create a test page within the src/app/pages folder.

Make the TestPage class extend the `ColoredPageComponent` and set the required color and pagePath:
```
export class TestPage extends ColoredPageComponent {
  public color: string = "paletteschemecolor6";
  public pagePath: string = "/projects/3d";
}
```

Check the [app-routing module](./src/app/app-routing.module.ts) and make sure it has updated with the desired route. 

# Setup basic page elements (Page nav and page cover)

The following is the minimal page setup required for a page, it includes the nav bar, for managing intra-page navigation (within one page), the page cover (a title page) and the inter-page navigation for going to other pages.

```
<ion-header #header [translucent]="true" class="ion-no-border">
  <ion-toolbar #toolbar>
    <page-section-navigation-bar [basePath]="pagePath" category="Topics">
    </page-section-navigation-bar>
  </ion-toolbar>
</ion-header>

<ion-content slot="fixed" [fullscreen]="true" [appFadeHeaderOnScroll]="toolbar" [header]="header" scrollEvents="true">

  <ion-header collapse="condense">
    <ion-toolbar>
      <ion-title size="large">{{ pagePath }}</ion-title>
    </ion-toolbar>
  </ion-header>

  <page-cover id="Home" [cheveron]="true" [pagePath]="pagePath" overrideBackgroundColor="var(--ion-color-step-1000)"
    backgroundImageId="page-covers/0af860ef-a6ad-4ef5-980e-a43d3bd3f0b1-trim.png">
    <h1 currentColor>GFX</h1>
    <div>
      <h2>
        I create graphics <ion-icon name="cube-outline"></ion-icon> and games <ion-icon
          name="game-controller-outline"></ion-icon>
      </h2>
    </div>
  </page-cover>

  <div id="Navigation" [linkElementToNavigation]="pagePath">
    <div class="page-banner-text">
      <ion-list>
        <ion-row text-center>
        <ion-col *ngFor="let p of appPages; let i = index">
          <ion-button [disabled]="p.url === pagePath" [color]="p.url === pagePath ? 'dark' : 'light'" size="default" routerDirection="root" [routerLink]="[p.url]" lines="none" detail="false"
            routerLinkActive="selected">
            <ion-icon [color]="p.color" [ios]="p.icon + '-outline'" [md]="p.icon + '-sharp'"></ion-icon>
            <ion-row>
              {{p.title}} 
            </ion-row>
          </ion-button>
        </ion-col>
      </ion-row>
      </ion-list>
    </div>
  </div>

  .... other content

</ion-content>
```

# Page sections

Each element within the page with an `id` element like the page cover in the last example `id="Home"` represents a navigatable element within the page, once linked with the `[linkElementToNavigation]="pagePath"` directive. The page-section-navigation-bar added in the `ion-header` section of every page will allow for swapping between sections.

The primary styled page section is called a `<page-section>` for example:

```
  <page-section [linkElementToNavigation]="pagePath" id="CAD" sideHeaderTitle="Projects"
    sideHeaderSubtitle="Ipsum consequal tincidunt" iconName="cube-outline" blockTitle="Ipsum consequal tincidunt"
    blockSubtitle="El Rapo tincidunt" [rightHanded]="false" backgroundId="card-header-banners/cad-cup.png">

    <ion-item>
      <ul class="skills" currentBackgroundColor childSelector="li">
        <li>Varius quam quisque</li>
        <li>Adipiscing tristique</li>
      </ul>
    </ion-item>

    <ion-item>
      <div>
        <p>Other text</p>
      </div>
    </ion-item>
 </page-section>
```

But others custom sections are possible e.g.:


```

  <div id="Intro" [linkElementToNavigation]="pagePath">
    <div class="page-banner-text">
      <h1>Hi I'm <strong currentColor>Your Name</strong></h1>

      <p>I am an <strong>engineer</strong>, <strong>scientist</strong> and <strong>entrepreneur</strong> and have been
        engineering commercial products for industry for over <app-elapsed-time day="13" month="Sep" year="2005"
          [show_months_since]="false" [show_days_since]="false" [show_hours_since]="false" [show_minutes_since]="false"
          [show_seconds_since]="false"></app-elapsed-time>. </p>

      <p>Performing in a <strong>C-Suite</strong> role or as a <strong>director</strong> for the last <app-elapsed-time
          day="27" month="Feb" year="2014" [show_days_since]="false" [show_hours_since]="false"
          [show_minutes_since]="false" [show_seconds_since]="false"></app-elapsed-time> in SME
        businesses; I have a penchant for helping buisnesses apply the latest technologies, enabling <strong>digital
          transformation</strong> and competitive, sustainable <strong>innovation</strong>. </p>

      <ul>
        <li>Location: <strong currentColor>London</strong></li>
        <li>Interests: <strong currentColor>Hardware/Software Engineering</strong>, <strong currentColor>Music</strong>,
          <strong currentColor>Art</strong>, <strong currentColor>Science</strong>, <strong
            currentColor>Sed do eiusmod</strong>
        </li>
        <li>Age: <strong currentColor><app-elapsed-time day="19" month="Jan" year="1980"></app-elapsed-time>
            old</strong></li>
        <li>Study: <strong currentColor>Some university</strong></li>
        <li>Degree: <strong currentColor>Some dgree</strong></li>
      </ul>
    </div>
  </div>
```

and...

```
  <div id="Social" [linkElementToNavigation]="pagePath" class="social">
    <ul>
      <li><a href="https://github.com/jk89" target="_blank"><ion-icon name="logo-github"></ion-icon></a></li>
      <li><a href="https://www.linkedin.com/in/user-id/" target="_blank"><ion-icon
            name="logo-linkedin"></ion-icon></a></li>
      <li><a href="https://www.youtube.com/channel/UCFnqF1oGEuOlqHHKwPbcwKQ" target="_blank"><ion-icon
            name="logo-youtube"></ion-icon></a></li>
      <li><a href="https://stackoverflow.com/" target="_blank"><ion-icon
            name="logo-stackoverflow"></ion-icon></a></li>
    </ul>
  </div>
```

# License(s):

Assets and subdependancies belong to their respective owners and licenses remain unaffected [licenses file](./src/assets/LICENSE-DEPS.txt).

Fonts (found in assets/fonts) are licensed under [OFT-1.1](https://github.com/JetBrains/JetBrainsMono).

Free video assets (found in assets/mixkit) were obtained from [mixkit](https://mixkit.co/license/). 

Free image assets (found in assets/unsplash) were obtained from [unsplash](https://unsplash.com/license).

Icon images (found in assets/icon) belong to their respective owners (accessibility-blue.png is from the ionic icon pack, autodesk-grey.png and custom-autodesk.svg are the company logos for autodesk and belong to them).

The rest of the code and assets are released under GNU AGPL v3, see the [license file](./LICENSE).
