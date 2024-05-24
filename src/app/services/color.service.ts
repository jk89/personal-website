import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  private colorSubject: BehaviorSubject<string> = new BehaviorSubject("primary");
  public color$: Observable<string> = this.colorSubject.asObservable();

  public changeColor(color: string) {
    this.colorSubject.next(color);
  }

  constructor() { }
}
