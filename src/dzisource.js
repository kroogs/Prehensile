import { loader } from 'pixi.js'

export default class DziSource {
  constructor(path) {
    this.path = path
  }

  load(path, callback) {
    loader.add('source', path, { xhrType: 'document' }).load(() => {
      const image = loader.resources.source.data.getElementsByTagName(
        'Image',
      )[0]
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

  calculateLevels() {
    let width = this.width
    let height = this.height

    this.levels = [[width, height]]

    while (width > 1 || height > 1) {
      width = Math.ceil(width / 2)
      height = Math.ceil(height / 2)

      this.levels.push([width, height])
    }

    this.levels.reverse()
  }

  validTile(level, x, y) {
    const [levelX, levelY] = this.levels[level]

    if (levelX < x * this.tileSize || levelY < y * this.tileSize) {
      return false
    }

    return true
  }

  queueTile(level, x, y) {
    if (!this.validTile(level, x, y)) return

    loader.add(
      `${level}/${x}_${y}`,
      `${this.path.split('.')[0]}_files/${level}/${x}_${y}.jpeg`,
    )
  }
}
