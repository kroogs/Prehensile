import { Sprite, loader } from 'pixi.js'

export default class Manager {
  constructor(dira) {
    this.options = dira.options
    this.loader = dira.loader
    this.viewport = dira.viewport

    this.initLoader()
  }

  initLoader() {
    this.loader.load(this.options.sourceUrl, () => this.loadRegion())
  }

  loadRegion(fromX = 0, fromY = 0, toX = 0, toY = 0, level = 'auto') {
    loader
      .on('load', (...args) => this.addTile(args[1]))
      .on('completed', () => loader.off('load'))

    if (!toX) toX = this.viewport.width * this.options.pixelRatio
    if (!toY) toY = this.viewport.height * this.options.pixelRatio

    const xTiles = Math.ceil((toX - fromX) / this.loader.tileSize)
    const yTiles = Math.ceil((toY - fromY) / this.loader.tileSize)

    console.log(xTiles, yTiles)

    for (let y = 0; y < yTiles; y += 1) {
      for (let x = 0; x < xTiles; x += 1) {
        this.loader.queueTile(14, x, y)
      }
    }
  }

  addTile(resource) {
    const sprite = new Sprite(resource.texture)
    const [level, xy] = resource.name.split('/')
    const [x, y] = xy.split('_')

    sprite.position.x = x * (this.loader.tileSize / this.options.pixelRatio)
    sprite.position.y = y * (this.loader.tileSize / this.options.pixelRatio)
    sprite.scale.set(1 / this.options.pixelRatio)

    this.viewport.stage.addChild(sprite)
  }
}
