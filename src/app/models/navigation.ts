import { ElementRef } from "@angular/core";

export enum NavigationEventType {
    PageSection = "PageSection",
    Page = "Page"
}

export interface NavigationEvent {
    type: NavigationEventType;
    section: string;
    host: string;
    pagePath: string;
    fullRelativePath: string;
    url: string;
}

export interface NavigationSectionIntersectionUpdateEvent {
    viewableArea: number;
    navEvent: NavigationEvent;
    isIntersecting: boolean;
}

/**
 * Page structure like:
 * 
 * {"home": ElementRef, "CAD": ElementRef, ...} 
 * 
 */
export type NavigationPageStructure =  { [section: string]: ElementRef };

/**
 * Navigation structure like:
 * 
 * { "/folder/inbox": {"home": ElementRef, "CAD": ElementRef, ...} }
 * 
 */
export type NavigationTree = { [path: string]: NavigationPageStructure};
