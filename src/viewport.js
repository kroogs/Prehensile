import { Container, Sprite, autoDetectRenderer, loader } from 'pixi.js'

export default class Viewport {
  constructor(sourcePath, rootElement, options = {}) {
    this.initOptions(options)
    this.initRenderer(rootElement)
    this.initLoader(sourcePath)
  }

  initOptions(options) {
    this.options = options
  }

  initRenderer(rootElement) {
    this.rootElement = rootElement
    this.pixelRatio = window.devicePixelRatio
    this.stage = new Container()
    this.renderer = autoDetectRenderer(this.width, this.height, {
      resolution: this.pixelRatio,
      autoResize: true,
      antialias: true,
    })

    if (this.pixelRatio > 1) {
      this.renderer.view.style.imageRendering = 'pixelated'
      this.resize(this.width, this.height)
    }

    window.addEventListener('resize', this.resize.bind(this))
    rootElement.appendChild(this.renderer.view)

    this.tick()
  }

  initLoader(sourcePath) {
    this.source = new DziSourceLoader(sourcePath, this)
    this.source.load(sourcePath, this.loadRegion.bind(this))
  }

  tick() {
    this.renderer.render(this.stage)
    requestAnimationFrame(this.tick.bind(this))
  }

  get width() {
    return this.rootElement.clientWidth
  }

  get height() {
    return this.rootElement.clientHeight
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

  loadRegion(fromX = 0, fromY = 0, toX = 0, toY = 0, level = 'auto') {
    loader
      .on('load', (...args) => this.addTile(args[1]))
      .on('completed', () => loader.off('load'))

    if (!toX) toX = this.width * this.pixelRatio
    if (!toY) toY = this.height * this.pixelRatio

    const xTiles = Math.ceil((toX - fromX) / this.source.tileSize)
    const yTiles = Math.ceil((toY - fromY) / this.source.tileSize)

    for (let y = 0; y < yTiles; y += 1) {
      for (let x = 0; x < xTiles; x += 1) {
        this.source.queueTile(14, x, y)
      }
    }
  }

  addTile(resource) {
    const sprite = new Sprite(resource.texture)
    const [level, xy] = resource.name.split('/')
    const [x, y] = xy.split('_')

    sprite.position.x = x * (this.source.tileSize / this.pixelRatio)
    sprite.position.y = y * (this.source.tileSize / this.pixelRatio)
    sprite.scale.set(1 / this.pixelRatio)

    this.stage.addChild(sprite)
  }
}
