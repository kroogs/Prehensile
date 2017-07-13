import Dzi from './loaders/dzi'
import Viewport from './viewport'

export class Dira {
  constructor(options) {
    this.options = options
  }

  use(cls) {
    new cls(this)
    return this
  }

  run() {
    if (!this.loader) this.use(Dzi)
    if (!this.viewport) this.use(Viewport)
  }
}
