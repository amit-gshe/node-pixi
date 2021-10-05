import "node-pixi";
import fs from "fs";
import { Spine } from "pixi-spine";
import { Application } from "@pixi/app";

const app = new Application({
  backgroundAlpha: 0,
});

const takeScreenShot = () => {
  app.render();

  (app.view as any)
    .toBuffer("png")
    .then((buffer) => {
      fs.writeFileSync("che.png", buffer);
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(990);
    });
};
app.loader.baseUrl = "https://pixijs.io/examples/";
app.loader.onError.add((e) => {
  console.log(e.message, "reset loader");
  app.loader.reset();
});
app.loader
  .add("spineboypro", "examples/assets/pixi-spine/spineboy-pro.json")
  .load(onAssetsLoaded);
let dragon = null;
function onAssetsLoaded(loader: any, res: any) {
  console.log("assets loaded");
  // create a spine boy
  const spineBoyPro = new Spine(res.spineboypro.spineData);

  // set the position
  spineBoyPro.x = app.screen.width / 2;
  spineBoyPro.y = app.screen.height;

  spineBoyPro.scale.set(0.5);

  app.stage.addChild(spineBoyPro);

  const singleAnimations = ["aim", "death", "jump", "portal"];
  const loopAnimations = ["hoverboard", "idle", "run", "shoot", "walk"];
  spineBoyPro.state.setAnimation(0, "hoverboard", true);
  takeScreenShot();
}
