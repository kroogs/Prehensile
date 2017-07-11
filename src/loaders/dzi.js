import { loader } from 'pixi.js'

export default class Dzi {
  constructor(dira) {
    dira.loader = this
    this.sourceUrl = dira.options.sourceUrl
  }

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

  calculateLevels(width, height) {
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
    if (levelX < x * this.tileSize || levelY < y * this.tileSize) return false
    return true
  }

  queueTile(level, x, y) {
    if (!this.isValidTile(level, x, y)) return
    loader.add(
      `${level}/${x}_${y}`,
      `${this.sourceUrl.split('.')[0]}_files/${level}/${x}_${y}.jpeg`,
    )
  }
}
