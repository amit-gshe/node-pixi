import "./dom";
import * as PIXI from "pixi.js-legacy";
import { Loader } from "pixi.js";

/**
 * handle the spine version info lost
 */
Loader.registerPlugin({
  use: (resource, next) => {
    if (
      resource.extension === "json" &&
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

export { PIXI };
