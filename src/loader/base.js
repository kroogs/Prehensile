export default class Base {
  constructor(dira) {
    this.dira = dira
    this.dira.loader = this
    this.sourceUrl = dira.options.sourceUrl
    if (!this.sourceUrl) throw Error("Loader requires a 'sourceUrl' option.")
  }
}
