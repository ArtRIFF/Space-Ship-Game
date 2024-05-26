import * as PIXI from "pixi.js";
import { MainScene } from "./scenes/MainScene";
import { gameModel } from "./managers/GameModel";

const app = new PIXI.Application();
app
  .init({
    width: 1280,
    height: 720,
    backgroundColor: 0x000,
    canvas: document.getElementById("game-canvas") as HTMLCanvasElement,
  })
  .then(async () => {
    document.body.appendChild(app.canvas);
    const spaceShipTexture = await PIXI.Assets.load("space-ship.png");
    const spaceBackgroundTexture = await PIXI.Assets.load("space_bg.jpg");
    const spaceShipSprite = PIXI.Sprite.from(spaceShipTexture);
    const spaceBackgroundSprite = PIXI.Sprite.from(spaceBackgroundTexture);

    gameModel.setScreenSize({
      width: app.screen.width,
      height: app.screen.height,
    });

    const mainScene = new MainScene(app.stage, {
      spaceShipSprite: spaceShipSprite,
      spaceBackgroundSprite: spaceBackgroundSprite,
    });

    app.ticker.add((_delta) => {
      mainScene.upadate(_delta.deltaTime);
    });
  });
