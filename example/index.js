import fs from 'fs';
import { PIXI } from 'node-pixi';

console.log(`0`)

const app = new PIXI.Application({
  backgroundColor: 0x550088, 
  forceCanvas: true
});

const g = new PIXI.Graphics();
g.beginFill(0xc0f000);
g.drawRect(5,5,50,50);
g.endFill();
app.stage.addChild(g);

app.render();

app.view.toBuffer('jpg', 1).then(buffer => {
  fs.writeFileSync('che.jpg', buffer);
}).catch(err => {
  console.error(err);
});