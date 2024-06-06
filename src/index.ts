import * as PIXI from "pixi.js";
import { MainScene } from "./scenes/MainScene";
import { gameModel } from "./managers/GameModel";
import promiseHelper from "./helpers/ResolvablePromise";
import { loaderScene } from "./scenes/LoaderScene";
import "@pixi/gif";

const app = new PIXI.Application();
(globalThis as any).__PIXI_APP__ = app;

app
  .init({
    width: 1280,
    height: 720,
    backgroundColor: 0x000,
    canvas: document.getElementById("game-canvas") as HTMLCanvasElement,
  })
  .then(async () => {
    document.querySelector(".preloader")?.remove();
    document.body.appendChild(app.canvas);

    gameModel.setScreenSize({
      width: app.screen.width,
      height: app.screen.height,
    });

    loaderScene.addAssets(
      [
        { alias: "space_ship", src: "space-ship.png" },
        { alias: "space_bg", src: "space_bg.jpg" },
        { alias: "asteroid", src: "asteroid.png" },
        { alias: "enemyBossIdle", src: "enemyBossIdle.gif" },
        { alias: "enemyBossKilled", src: "enemyBossKilled.gif" },
        { alias: "enemyBossAttack", src: "enemyBossAttack.gif" },
      ],
      app.stage
    );

    loaderScene.load().then(async (texture) => {
      await promiseHelper.getDelayPromise(0.5);
      loaderScene.delete();
      const mainScene = new MainScene(app.stage, texture);

      app.ticker.add((_delta) => {
        mainScene.update(_delta.deltaTime);
      });
    });
  });
