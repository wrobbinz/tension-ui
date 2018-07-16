import Delta from 'quill-delta';
import normalizeUrl from 'normalize-url';

const defaults = {
  globalRegularExpression: /(https?:\/\/|www\.)[\S]+/g,
  urlRegularExpression: /(https?:\/\/[\S]+)|(www.[\S]+)/,
  normalizeRegularExpression: /(https?:\/\/[\S]+)|(www.[\S]+)/,
  normalizeUrlOptions: {
    stripFragment: false,
    stripWWW: false,
  },
};

class QuillUrl {
  constructor(quill, options) {
    this.quill = quill;
    this.options = { ...defaults, ...options };
    this.registerTypeListener();
    this.registerPasteListener();
  }

  registerPasteListener() {
    this.quill.clipboard.addMatcher(Node.TEXT_NODE, (node, delta) => {
      if (typeof node.data !== 'string') {
        return;
      }
      const matches = node.data.match(this.options.globalRegularExpression);
      if (matches && matches.length > 0) {
        const newDelta = new Delta();
        let str = node.data;
        matches.forEach((match) => {
          const split = str.split(match);
          const beforeLink = split.shift();
          newDelta.insert(beforeLink);
          newDelta.insert(match, { link: match });
          str = split.join(match);
        });
        newDelta.insert(str);
        delta.ops = newDelta.ops;
      }
      return delta;
    });
  }

  registerTypeListener() {
    this.quill.on('text-change', (delta) => {
      const { ops } = delta;
      // Only return true, if last operation includes whitespace inserts
      // Equivalent to listening for enter, tab or space
      if (!ops || ops.length < 1 || ops.length > 2) {
        return;
      }
      const lastOp = ops[ops.length - 1];
      if (!lastOp.insert || typeof lastOp.insert !== 'string' || !lastOp.insert.match(/\s/)) {
        return;
      }
      this.checkTextForUrl();
    });
  }

  checkTextForUrl() {
    const selection = this.quill.getSelection();
    if (!selection) {
      return;
    }
    const [leaf] = this.quill.getLeaf(selection.index);
    if (!leaf.text) {
      return;
    }
    const urlMatch = leaf.text.match(this.options.urlRegularExpression);
    if (!urlMatch) {
      return;
    }
    const stepsBack = leaf.text.length - urlMatch.index;
    const index = selection.index - stepsBack;
    this.textToUrl(index, urlMatch[0]);
  }

  textToUrl(index, url) {
    const ops = new Delta()
      .retain(index)
      .delete(url.length)
      .insert(url, { link: this.normalize(url) });
    this.quill.updateContents(ops);
  }

  normalize(url) {
    if (this.options.normalizeRegularExpression.test(url)) {
      return normalizeUrl(url, this.options.normalizeUrlOptions);
    }
    return url;
  }
}

export default QuillUrl;
