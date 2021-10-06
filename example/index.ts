import "node-pixi";
import "./spine-debug";
import fs from "fs";
import { Spine } from "pixi-spine";
import { Application } from "@pixi/app";
import { SpineDebug } from "./spine-debug";

let spineDebug;
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

    // app.loader.baseUrl =
    //   "https://storage.googleapis.com/assets.axieinfinity.com/";
    app.loader.onError.add(reject);
    app.loader.add("axie", "https://storage.googleapis.com/game-assets-test/dracoo/12/huolong.json").load(onAssetsLoaded);
    function onAssetsLoaded(loader: any, res: any) {
      try {
        console.log("assets loaded");
        // create a spine boy
        const axie = new Spine(res.axie.spineData);
        // spineDebug = new SpineDebug(axie);
        // set the position
        axie.scale.set(0.5);
        axie.x = app.screen.width / 2;
        axie.y = app.screen.height / 2 + axie.height / 2;
        app.stage.addChild(axie);
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
  return 0;
};

main().catch(console.log).finally(process.exit);
