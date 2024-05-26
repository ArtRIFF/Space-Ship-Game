import { Container, Graphics } from "pixi.js";
import { GameConfig } from "../config/GameConfig";
import gsap from "gsap";
import { gameModel } from "../managers/GameModel";
type TAttackDirection = "top" | "bottom";
type TCoordinate = { x: number; y: number };
export class Rocket {
  public container: Container = new Container();
  private readonly flyDuration: number = 1;
  private readonly attackDiraction;
  private flyAnimation: gsap.core.Tween | null = null;
  private graphic: Graphics;

  constructor(
    coordinate: TCoordinate,
    color: string,
    direction: TAttackDirection
  ) {
    const rocketSize = GameConfig.rocketParam.ROCKET_SIZE;
    this.attackDiraction = direction;
    this.graphic = new Graphics()
      .rect(coordinate.x, coordinate.y, rocketSize, rocketSize)
      .fill(color);
    this.container.addChild(this.graphic);
  }

  fly(startPosition: TCoordinate) {
    const distance = gameModel.getScreenSize().height;
    this.setPosition(startPosition);
    this.flyAnimation = gsap.to(this.container.position, {
      y: `${this.attackDiraction === "top" ? "-" : "+"}=${distance}`,
      duration: this.flyDuration,
      ease: "ease.out",
    });
  }

  public setPosition(position: TCoordinate) {
    this.container.position.set(position.x, position.y);
  }
}
