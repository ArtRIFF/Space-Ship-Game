import { Container, Sprite } from "pixi.js";

export class GameBackground {
  public container: Container = new Container();
  constructor(private sprite: Sprite) {
    this.container.addChild(this.sprite);
  }
}
