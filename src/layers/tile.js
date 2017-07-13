import { Container, Sprite, loader } from 'pixi.js'

export default class TileLayer {
  constructor(viewport) {
    this.viewport = viewport
    this.initLoader()
  }

  initLoader() {
    this.source = new DziLoader(sourcePath)
    this.source.load(sourcePath, () => this.grid.loadRegion())
  }

  loadRegion(fromX = 0, fromY = 0, toX = 0, toY = 0, level = 'auto') {
    loader
      .on('load', (...args) => this.addTile(args[1]))
      .on('completed', () => loader.off('load'))

    if (!toX) toX = this.width * this.pixelRatio
    if (!toY) toY = this.height * this.pixelRatio

    const xTiles = Math.ceil((toX - fromX) / this.viewport.source.tileSize)
    const yTiles = Math.ceil((toY - fromY) / this.viewport.source.tileSize)

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

    sprite.position.x = x * (this.viewport.source.tileSize / this.pixelRatio)
    sprite.position.y = y * (this.viewport.source.tileSize / this.pixelRatio)
    sprite.scale.set(1 / this.pixelRatio)

    this.viewport.container.addChild(sprite)
  }
}
