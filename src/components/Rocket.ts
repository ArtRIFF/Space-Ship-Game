import { Container, Graphics } from "pixi.js";
import { GameConfig } from "../config/GameConfig";
import gsap from "gsap";
import { gameModel } from "../managers/GameModel";
import { TCoordinate } from "../types/types";
type TAttackDirection = "top" | "bottom";

export class Rocket {
  public container: Container = new Container();
  private readonly flyDuration: number = 1;
  private readonly attackDiraction;
  private flyAnimation: gsap.core.Tween | null = null;
  private graphic: Graphics;
  private _isCollision: boolean = false;

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
      onComplete: () => {
        if (!this.isCollision) {
          this.isCollision = true;
          this.container.destroy();
        }
      },
    });
  }

  public setPosition(position: TCoordinate) {
    this.container.position.set(position.x, position.y);
  }

  getRocketPosition(): TCoordinate {
    return {
      x: this.container.position.x,
      y: this.container.position.y,
    };
  }

  set isCollision(value: boolean) {
    this._isCollision = value;
  }

  get isCollision(): boolean {
    return this._isCollision;
  }
}
