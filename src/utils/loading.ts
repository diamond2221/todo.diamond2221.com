import Vue from 'vue'

export class Loading {
  constructor() {

  }

  public static show() {
    const loadingEl = document.querySelector<HTMLDivElement>('#loading')
    if (loadingEl) {
      loadingEl.style.display = 'block'
    }
  }

  public static hide() {
    const loadingEl = document.querySelector<HTMLDivElement>('#loading')
    if (loadingEl) {
      loadingEl.style.display = 'none'
    }
  }
}
