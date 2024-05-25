import * as PIXI from 'pixi.js';

const app = new PIXI.Application();
app.init(
    {
        width: 1280,
        height: 720,
        backgroundColor: 0x1099bb,
        canvas: document.getElementById('game-canvas') as HTMLCanvasElement,
      }
).then(async () => {
    document.body.appendChild(app.canvas);
    const texture = await PIXI.Assets.load("space-ship.png");
    const sprite = PIXI.Sprite.from(texture);
    sprite.anchor.set(0.5);
    sprite.position.set(
      app.renderer.screen.width / 2,
      app.renderer.screen.height / 2
    );
    app.stage.addChild(sprite);

    app.ticker.add((_delta) => {
        sprite.rotation += 0.05 * +_delta.deltaTime;
      })
  });
