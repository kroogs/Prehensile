(function main(window, PIXI) {
  const {
    Container,
    Sprite,
    autoDetectRenderer,
    loader,
    interaction,
  } = PIXI;

  // const {
  //   TextureCache
  // } = PIXI.utils;

  class DziSourceLoader {
    constructor(path, prehensile) {
      this.path = path;
      this.prehensile = prehensile;
    }

    load(path, callback) {
      loader.add('source', path, { xhrType: 'document' }).load(() => {
        const image = loader.resources.source.data.getElementsByTagName('Image')[0];
        const size = image.getElementsByTagName('Size')[0];

        this.format = image.getAttribute('Format');
        this.width = Number(size.getAttribute('Width'));
        this.height = Number(size.getAttribute('Height'));
        this.tileSize = Number(image.getAttribute('TileSize'));
        this.overlap = Number(image.getAttribute('Overlap'));

        this.calculateLevels();

        callback();
      });
    }

    calculateLevels() {
      let width = this.width;
      let height = this.height;

      this.levels = [[width, height]];

      while (width > 1 || height > 1) {
        width = Math.ceil(width / 2);
        height = Math.ceil(height / 2);

        this.levels.push([width, height]);
      }

      this.levels.reverse();
    }

    tileExists(level, x, y) {
      const [levelX, levelY] = this.levels[level];

      if (levelX < x * this.tileSize || levelY < y * this.tileSize) {
        return false;
      }

      return true;
    }

    queueTile(level, x, y) {
      if (!this.tileExists(level, x, y)) return;

      const file = `${this.path.split('.')[0]}_files/${level}/${x}_${y}.jpeg`;
      loader.add(`${level}/${x}_${y}`, file);
    }
  }

  class Prehensile {
    constructor(sourcePath, rootElement, options = {}) {
      this.initOptions(options);
      this.initRenderer(rootElement);
      this.initLoader(sourcePath);
    }

    initOptions(options) {
      this.options = options;
    }

    initRenderer(rootElement) {
      this.rootElement = rootElement;
      this.pixelRatio = window.devicePixelRatio;
      this.stage = new Container();
      this.renderer = autoDetectRenderer(this.width, this.height, {
        resolution: this.pixelRatio,
        autoResize: true,
        antialias: true,
      });

      if (this.pixelRatio > 1) {
        this.renderer.view.style.imageRendering = 'pixelated';
        this.resize(this.width, this.height);
      }

      window.addEventListener('resize', () => {
        this.resize(this.width, this.height);
      });

      //////
      const stage = this.stage;
      function dragHandler(event) {
        const newPosition = event.data.global;
        this.position.x = newPosition.x - (stage.width / 2);
        this.position.y = newPosition.y - (stage.height / 2);
      }
      function zoomHandler(event) {
        debugger
      }

      this.stage.interactive = true;
      this.stage.on('mousemove', dragHandler);
      this.stage.on('touchmove', dragHandler);
      this.stage.on('wheel', zoomHandler);
      //////

      rootElement.appendChild(this.renderer.view);
      this.drawFrame();
    }

    initLoader(sourcePath) {
      this.source = new DziSourceLoader(sourcePath, this);
      this.source.load(sourcePath, () => this.loadRegion());
    }

    drawFrame() {
      requestAnimationFrame(() => this.drawFrame());
      this.renderer.render((this.stage));
    }

    get width() {
      return this.rootElement.clientWidth;
    }

    get height() {
      return this.rootElement.clientHeight;
    }

    resize(width, height) {
      this.renderer.view.style.width = `${width}px`;
      this.renderer.view.style.height = `${height}px`;
      this.renderer.resize(width, height);
    }

    loadRegion(fromX = 0, fromY = 0, toX = 0, toY = 0, level = 'auto') {
      loader
        .on('load', (...args) => { this.addTile(args[1]); })
        .on('completed', () => { loader.off('load'); });

      if (!toX) toX = this.width * this.pixelRatio;
      if (!toY) toY = this.height * this.pixelRatio;

      const xTiles = Math.ceil((toX - fromX) / this.source.tileSize);
      const yTiles = Math.ceil((toY - fromY) / this.source.tileSize);

      for (let y = 0; y < yTiles; y += 1) {
        for (let x = 0; x < xTiles; x += 1) {
          this.source.queueTile(14, x, y);
        }
      }
    }

    addTile(resource) {
      const sprite = new Sprite(resource.texture);
      const [level, xy] = resource.name.split('/');
      const [x, y] = xy.split('_');

      sprite.position.x = x * (this.source.tileSize / this.pixelRatio);
      sprite.position.y = y * (this.source.tileSize / this.pixelRatio);
      sprite.scale.set(1 / this.pixelRatio);

      this.stage.addChild(sprite);
    }
  }

  window.prehensile = (...args) => new Prehensile(...args);
}(window, PIXI));
