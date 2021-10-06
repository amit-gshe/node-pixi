import "node-pixi";
import "./middleware";
import fs from "fs";
import { Application } from "@pixi/app";
import { Spine } from "pixi-spine";
import { SpineDebug } from "./spine-debug";

let spineDebug: SpineDebug;
const oldUpadte = Spine.prototype.update;
Spine.prototype.update = function (dt) {
  oldUpadte.call(this, dt);
  if (spineDebug) {
    spineDebug.update();
  }
};

const takeScreenShot = (app: Application) => {
  app.render();
  return app.view.toBuffer("png");
};

const setupPixi = () => {
  return new Promise<Application>((resolve, reject) => {
    const app = new Application({
      backgroundAlpha: 0,
      // backgroundColor: 0xFFFFFF
    });

    app.loader.baseUrl =
      "https://storage.googleapis.com/assets.axieinfinity.com/";
    app.loader.onError.add(reject);
    app.loader
      .add(
        "spine",
        // "https://storage.googleapis.com/game-assets-test/dracoo/12/huolong.json"
        "axies/5985687/axie/axie.json"
      )
      .load(onAssetsLoaded);
    function onAssetsLoaded(_: any, res: any) {
      try {
        const spine = new Spine(res.spine.spineData);
        // spineDebug = new SpineDebug(spine);
        // set the position
        spine.scale.set(0.5);
        spine.x = app.screen.width / 2;
        spine.y = app.screen.height / 2 + spine.height / 2;
        app.stage.addChild(spine);
        resolve(app);
      } catch (error) {
        reject(error);
      }
    }
  });
};

const main = async () => {
  const app = await setupPixi();
  const buffer = await takeScreenShot(app);
  fs.writeFileSync("axie.png", buffer);
  app.destroy(true, true);
  return 0;
};

main().catch(console.log);
