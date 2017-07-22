export class DiraError extends Error {
  constructor(message = 'Unknown Error') {
    super()
    this.name = 'DiraError'
    this.message = `Dira: ${message}`
    this.stack = new Error().stack
  }
}

export class LoaderError extends DiraError {
  constructor(message = 'Unknown Error') {
    super()
    this.name = 'LoaderError'
    this.message = `Loader: ${message}`
  }
}
