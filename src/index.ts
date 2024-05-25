import * as PIXI from "pixi.js";
import { MainScene } from "./scenes/MainScene";

const app = new PIXI.Application();
app
  .init({
    width: 1280,
    height: 720,
    backgroundColor: 0x1099bb,
    canvas: document.getElementById("game-canvas") as HTMLCanvasElement,
  })
  .then(async () => {
    document.body.appendChild(app.canvas);
    const spaceShipTexture = await PIXI.Assets.load("space-ship.png");
    const spaceBackgroundTexture = await PIXI.Assets.load("space_bg.jpg");
    const spaceShipSprite = PIXI.Sprite.from(spaceShipTexture);
    const spaceBackgroundSprite = PIXI.Sprite.from(spaceBackgroundTexture);

    const mainScene = new MainScene(app.stage, {
      spaceShipSprite: spaceShipSprite,
      spaceBackgroundSprite: spaceBackgroundSprite,
    });

    app.ticker.add((_delta) => {
      mainScene.upadate(_delta.deltaTime);
    });
  });
