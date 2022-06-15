import { window, OverviewItemLoadEvent, IResource, utility } from 'civet'

class Segmentor {
  private _segment: any;
  #POSTAG: any;

  constructor() {
    const Segment = require('segment')
    this.#POSTAG = Segment.POSTAG
    this._segment = new Segment()
    this._segment.useDefault()
  }

  parse(text: string) {
    return this._segment.doSegment(text)
  }
}

let webContentView = window.createContentView('webContentView',
  ['html']);
webContentView.onViewInitialize(():string => {
  const fs = require('fs')
  const html = fs.readFileSync(utility.extensionPath + '/web/content.html', 'utf-8')
  return html
});

export function activate() {
  const jsDom = require('jsdom')
  const { JSDOM } = jsDom
  const segment = new Segmentor()
  return {
    read: async (filepath: string, resource: IResource) => {
      const fs = require('fs')
      const html = fs.readFileSync(filepath, 'utf-8')
      // console.debug('read html:', html)
      const dom = new JSDOM(html)
      let text = dom.window.document.body.textContent.replace(/\s+/g, '')
      console.debug('html view:', text)
      const words = segment.parse(text)
      if (words.length) {
        resource.keyword = words
      }
      return 
    }
  }
}
