import * as canvas from "canvas";
import XMLHttpRequest from "xhr2";
import raf from "raf";

let NODE_PIXI_WEBGL = false;

class Element {
  constructor() {
    this.style = {};
    this.offsetWidth = 20;
    this.offsetHeight = 20;
    this._clientWidth = 20;
    this._clientHeight = 20;
  }

  addEventListener() {}

  removeEventListener() {}

  appendChild() {}

  removeChild() {}

  get clientHeight() {
    return this._clientHeight;
  }

  set clientHeight(value) {
    this._clientHeight = value;
  }

  get clientWidth() {
    return this._clientWidth;
  }

  set clientWidth(value) {
    this._clientWidth = value;
  }
}

class AnchorElement extends Element {
  constructor() {
    super();

    this._href = "";
  }

  get href() {
    return this._href;
  }
  set href(value) {
    this._href = value;
  }
}

export class Canvas extends Element {
  static imageToImageData(image, flip_y = true) {
    if (NODE_PIXI_WEBGL) {
      let c = canvas.createCanvas(image.width, image.height),
        ctx = c.getContext("2d");
      if (flip_y) {
        ctx.scale(1, -1);
        ctx.translate(0, -image.height);
      }
      ctx.drawImage(image, 0, 0);
      return ctx.getImageData(0, 0, image.width, image.height);
    } else {
      return image;
    }
  }

  constructor() {
    super();

    this._canvas = canvas.createCanvas(1, 1);

    //patching this stuff is necessary, see jsdom HTMLCanvasElement-impl
    this._ctx = this._canvas.getContext("2d");
    this._ctx.canvas = this._canvas;

    let patch = (ctx, name) => {
      const prev = ctx[name];
      ctx[name] = function (image) {
        arguments[0] = image instanceof Image ? image : image._canvas;
        return prev.apply(ctx, arguments);
      };
    };

    patch(this._ctx, "createPattern");
    patch(this._ctx, "drawImage");
  }

  getContext(value, contextOptions) {
    if (value.indexOf("webgl") != -1) {
      return;
    }
    return this._ctx;
  }

  get height() {
    return this._canvas.height;
  }
  set height(value) {
    if (this._webglResizeExt) {
      this._webglResizeExt.resize(this.width, value);
    }
    this._canvas.height = value;
  }

  get width() {
    return this._canvas.width;
  }
  set width(value) {
    if (this._webglResizeExt) {
      this._webglResizeExt.resize(value, this.height);
    }
    this._canvas.width = value;
  }

  toBuffer(format = "png", quality = 1) {
    let c = this._canvas;

    return new Promise((resolve, reject) => {
      if (format === "jpg") {
        c.toDataURL("image/jpeg", quality, (err, data) => {
          if (err) return reject(err);
          data = data.replace(/^[^,]+,/, "");
          resolve(new Buffer(data, "base64"));
        });
      } else if (format === "png") {
        resolve(c.toBuffer());
      } else if (format === "pdf" || format === "svg") {
        let cnv = canvas.createCanvas(this.width, this.height, format),
          ctx = cnv.getContext("2d"),
          img = new canvas.Image();

        img.onload = () => {
          ctx.drawImage(img, 0, 0, this.width, this.height);
          resolve(cnv.toBuffer());
        };
        img.onerror = (err) => {
          reject(err);
        };
        img.src = c.toBuffer();
      } else {
        reject(new Error(`invalid format: ${format}`));
      }
    });
  }
}

// monkey patch Canvas#Image
canvas.Image.prototype.addEventListener = function (name, cb) {
  if (name === "load") {
    this.onload = cb;
  } else if (name === "error") {
    this.onerror = cb;
  }
};

class Document {
  constructor() {
    this.body = new Element();
    this.documentElement = this.body;
  }

  addEventListener() {}
  removeEventListener() {}
  appendChild(child) {}
  removeChild(child) {}

  createElement(tag) {
    switch (tag) {
      case "canvas":
        return new Canvas();
      case "div":
        return new Element();
      case "a":
        return new AnchorElement();
      default:
        console.warn(`Document::createElement: unhandled "${tag}"`);
    }
  }
}

class Window {
  constructor(document) {
    this.document = document;
    this.navigator = {
      userAgent: "node-pixi",
      appVersion: "0.3.3",
    };
    this.location = "http://localhost/";
    this.Image = canvas.Image;
  }

  addEventListener() {}
  removeEventListener() {}
}

global.document = new Document();
global.window = new Window(global.document);
global.navigator = global.window.navigator;
global.Image = canvas.Image;
global.XMLHttpRequest = XMLHttpRequest;
global.Canvas = Canvas;
global.XMLDocument = Element;
global.HTMLVideoElement = Element;
global.HTMLImageElement = canvas.Image;
global.HTMLCanvasElement = Canvas;
global.CanvasRenderingContext2D = Element
raf.polyfill(global);
global.addEventListener = function () {};
global.removeEventListener = function () {};
global.self = global.window;

const ____nowOffset = Date.now();
global.performance = {
  now: function () {
    return Date.now() - ____nowOffset;
  },
};
