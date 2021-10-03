import fs from 'fs';
import { PIXI } from 'node-pixi';
import "pixi-spine";

console.log(`0`)

const app = new PIXI.Application({
  backgroundColor: 0x550088, 
  // forceCanvas: true,
});

const takeScreenShot = () => {
  app.render();

  app.view.toBuffer('png').then(buffer => {
    fs.writeFileSync('che.png', buffer);
    process.exit(0)
  }).catch(err => {
    console.error(err);
    process.exit(990);
  });
}
const assetPrefix = 'https://pixijs.io/examples/'
app.loader
    .add('spineboypro', assetPrefix+ 'examples/assets/pixi-spine/spineboy-pro.json')
    .load(onAssetsLoaded);
let dragon = null
function onAssetsLoaded(loader, res) {
    // create a spine boy
    const spineBoyPro = new PIXI.spine.Spine(res.spineboypro.spineData);

    // set the position
    spineBoyPro.x = app.screen.width / 2;
    spineBoyPro.y = app.screen.height;

    spineBoyPro.scale.set(0.5);

    app.stage.addChild(spineBoyPro);

    const singleAnimations = ['aim', 'death', 'jump', 'portal'];
    const loopAnimations = ['hoverboard', 'idle', 'run', 'shoot', 'walk'];
    spineBoyPro.state.setAnimation(0, 'hoverboard', true)
    takeScreenShot()

  }