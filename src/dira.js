import Dzi from './loaders/dzi'
import Viewport from './viewport'

export class Dira {
  constructor(sourceUrl, rootElement, options = {}) {
    if (typeof sourceUrl === 'string' && rootElement instanceof HTMLElement) {
      this.options = { ...options, rootElement, sourceUrl }
    } else {
      this.options = sourceUrl
    }
  }

  use(cls) {
    new cls(this)
    return this
  }

  run() {
    if (!this.loader) this.use(Dzi)
    if (!this.viewport) this.use(Viewport)
    this.viewport.tick()
  }
}
