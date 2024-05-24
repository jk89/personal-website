import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  disableWebGPU = false;

  getWebGPUDisabledStatus() {
    return this.disableWebGPU;
  }

  setWebGPUDisabledStatus(disabled: boolean) {
    this.disableWebGPU = disabled;
  }

  constructor() { }
}
