import Dzi from './loader/dzi'
import Viewport from './viewport'
import { DiraError } from './error'

export class Dira {
  constructor(options) {
    if (!options) throw new DiraError('requires options')

    this.options = options
    this.loader = new Dzi(this)
    this.viewport = new Viewport(this)

    if (options.plugins) {
      options.plugins.forEach(plugin => this.use(plugin))
    }
  }

  use(fn) {
    fn(this)
    return this
  }
}
