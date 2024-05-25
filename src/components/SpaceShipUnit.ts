import { Sprite } from "pixi.js";

export class SpaceShipUnit {
  constructor(public container: Sprite) {
    container.anchor.set(0.5);
    container.setSize(100);
    container.position.set(640, 640);
  }
}
