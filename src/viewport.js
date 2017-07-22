import { Container, autoDetectRenderer } from 'pixi.js'
import TileManager from './tile/manager'

// Layers
// -1 (default to invisible) half/quarter view of current coords
// 0 Current, best viewing depth
// 1 Loading area for double/quadruple view of current coords
// 2 Duplicate of layer -1 as a backdrop

export default class Viewport {
  constructor(dira) {
    this.dira = dira
    this.dira.viewport = this

    this.applyOptions(dira.options)
    this.initRenderer()
    this.initTileManager()

    this._tick()
  }

  applyOptions(options) {
    this.options = options
    if (!options.pixelRatio) options.pixelRatio = window.devicePixelRatio
  }

  initRenderer() {
    this.el = this.options.rootElement

    this.el.style.fontSize = 0
    this.el.style.margin = 0
    this.el.style.padding = 0

    this.stage = new Container()
    this.renderer = autoDetectRenderer({
      width: this.width,
      height: this.height,
      resolution: this.options.pixelRatio,
      autoResize: true,
      antialias: true,
    })

    if (this.options.pixelRatio > 1) {
      this.renderer.view.style.imageRendering = 'pixelated'
      this.resize()
    }

    this.el.appendChild(this.renderer.view)
    window.addEventListener('resize', this.resize.bind(this))
  }

  initTileManager() {
    this.manager = new TileManager(this.dira)
  }

  get width() {
    return this.el.clientWidth
  }

  get height() {
    return this.el.clientHeight
  }

  resize(width, height) {
    if (!width || !height) {
      width = this.width
      height = this.height
    }

    this.renderer.view.style.width = `${width}px`
    this.renderer.view.style.height = `${height}px`
    this.renderer.resize(width, height)
  }

  _tick() {
    this.renderer.render(this.stage)
    requestAnimationFrame(this._tick.bind(this))
  }
}
