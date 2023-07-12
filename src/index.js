import "./dom";
import 'pixi-spine'
import * as PIXI from "pixi.js-legacy"
import { Loader } from "pixi.js-legacy";
import { EventEmitter } from "events";
export { Spine } from "pixi-spine";
export { Application } from "pixi.js-legacy";

/**
 * handle the spine version info lost
 */
Loader.registerPlugin({
  use: (resource, next) => {
    if (
      resource.extension === "json" &&
      resource.data &&
      resource.data.bones &&
      !resource.data.skeleton
    ) {
      console.log("No spine version found in json, default to 3.7");
      resource.data.skeleton = { spine: "3.7" };
    }
    next();
  },
});
global.PIXI = PIXI;
global.pixi_events = new EventEmitter();

export { PIXI };
