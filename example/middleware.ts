import { Loader } from "pixi.js";

Loader.registerPlugin({
  use: (resource, next: any) => {
    if (
      resource.extension === "json" &&
      resource.data.bones &&
      !resource.data.skeleton
    ) {
      console.log('No spine version found in json, default to 3.7');
      resource.data.skeleton = { spine: "3.7" };
    }
    next();
  },
});
