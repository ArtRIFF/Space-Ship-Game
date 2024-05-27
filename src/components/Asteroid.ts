import { Container, Sprite } from "pixi.js";

export class Asteroid {
  public container: Container = new Container();
  constructor(sprite: Sprite) {
    sprite.scale.set(0.5);
    this.container.addChild(sprite);
  }

  setPosition(x: number, y: number) {
    this.container.position.set(x, y);
  }
}
