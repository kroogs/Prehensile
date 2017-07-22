import { loader } from 'pixi.js'
import Base from './base'

export default class Dzi extends Base {
  load(sourceUrl, callback) {
    loader
      .add('source', sourceUrl, { xhrType: 'document' })
      .load((_, { source }) => {
        const image = source.data.getElementsByTagName('Image')[0]
        const size = image.getElementsByTagName('Size')[0]

        this.format = image.getAttribute('Format')
        this.width = Number(size.getAttribute('Width'))
        this.height = Number(size.getAttribute('Height'))
        this.tileSize = Number(image.getAttribute('TileSize'))
        this.overlap = Number(image.getAttribute('Overlap'))
        this.calculateLevels()

        callback()
      })
  }

  calculateLevels(width = this.width, height = this.height) {
    this.levels = [[width, height]]
    while (width > 1 || height > 1) {
      this.levels.unshift([
        (width = Math.ceil(width / 2)),
        (height = Math.ceil(height / 2)),
      ])
    }
  }

  isValidTile(level, x, y) {
    const [levelX, levelY] = this.levels[level]
    return levelX > x * this.tileSize && levelY > y * this.tileSize
  }

  queueTile(level, x, y) {
    if (this.isValidTile(level, x, y)) {
      loader.add(
        `${level}/${x}_${y}`,
        `${this.sourceUrl.split('.')[0]}_files/${level}/${x}_${y}.jpeg`,
      )
    }
  }
}
