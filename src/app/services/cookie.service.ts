import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  private acceptanceSubjects: { [platformName: string]: BehaviorSubject<boolean> } = {};
  private acceptance$: { [platformName: string]: Observable<boolean> } = {};
  
  constructor() { }

  hasAccepted(cookieName: string) {
    if (!this.acceptanceSubjects.hasOwnProperty(cookieName)) {
      this.acceptanceSubjects[cookieName] = new BehaviorSubject(false);
      this.acceptance$[cookieName] = this.acceptanceSubjects[cookieName].asObservable();
    }
    return this.acceptance$[cookieName];
  }

  acceptCookie(cookieName: string) {
    if (!this.acceptanceSubjects.hasOwnProperty(cookieName)) {
      this.acceptanceSubjects[cookieName] = new BehaviorSubject(true);
      this.acceptance$[cookieName] = this.acceptanceSubjects[cookieName].asObservable();
    }
    else {
      this.acceptanceSubjects[cookieName].next(true);
    }
  }
}
