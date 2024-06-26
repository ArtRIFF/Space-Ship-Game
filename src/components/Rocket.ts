import { Container, Graphics } from "pixi.js";
import { GameConfig } from "../config/GameConfig";
import gsap from "gsap";
import { gameModel } from "../managers/GameModel";
import { TCoordinate } from "../types/types";
import promiseHelper, { ResolvablePromise } from "../helpers/ResolvablePromise";
type TAttackDirection = "top" | "bottom";

export class Rocket {
  public container: Container = new Container();
  private readonly flyDuration: number = 1;
  private readonly attackDiraction;
  private graphic: Graphics;
  private _isCollision: boolean = false;
  distance: number;

  constructor(
    coordinate: TCoordinate,
    color: string,
    direction: TAttackDirection,
    distance: number
  ) {
    const rocketSize = GameConfig.rocketParam.ROCKET_SIZE;
    this.attackDiraction = direction;
    this.distance = distance;
    this.graphic = new Graphics()
      .rect(coordinate.x, coordinate.y, rocketSize, rocketSize)
      .fill(color);
    this.container.addChild(this.graphic);
  }

  async fly(startPosition: TCoordinate): Promise<void> {
    const promiseEndRocketDestination: ResolvablePromise<void> =
      promiseHelper.getResolvablePromise();
    this.setPosition(startPosition);
    gsap.to(this.container.position, {
      y: `${this.attackDiraction === "top" ? "-" : "+"}=${this.distance}`,
      duration: this.flyDuration,
      ease: "ease.out",
      onUpdate: () => {
        if (this.isCollision) {
          promiseEndRocketDestination.resolve();
        }
      },
      onComplete: () => {
        if (!this.isCollision) {
          this.isCollision = true;
          this.container.destroy();
          promiseEndRocketDestination.resolve();
        }
      },
    });
    await promiseEndRocketDestination;
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
