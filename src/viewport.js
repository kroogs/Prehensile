import { Container, autoDetectRenderer } from 'pixi.js'

//   Viewport
//     TileLayer (Layer)
//       Tile

export default class Viewport {
  constructor(dira) {
    dira.viewport = this
    this.el = dira.options.rootElement
    this.initRenderer()
    this.initDom()
  }

  initRenderer() {
    this.stage = new Container()
    this.renderer = autoDetectRenderer(this.width, this.height, {
      resolution: this.pixelRatio,
      autoResize: true,
      antialias: true,
    })
  }

  initDom() {
    this.pixelRatio = window.devicePixelRatio

    if (this.pixelRatio > 1) {
      this.renderer.view.style.imageRendering = 'pixelated'
      this.resize(this.width, this.height)
    }

    this.el.style.fontSize = 0
    this.el.style.margin = 0
    this.el.style.padding = 0

    window.addEventListener('resize', this.resize.bind(this))
    this.el.appendChild(this.renderer.view)
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

  tick() {
    this.renderer.render(this.stage)
    requestAnimationFrame(this.tick.bind(this))
  }
}
