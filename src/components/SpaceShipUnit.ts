import { Container, Point, Sprite } from "pixi.js";
import gsap from "gsap";
import { gameModel } from "../managers/GameModel";
import { Rocket } from "./Rocket";
import { GameConfig } from "../config/GameConfig";
import promiseHelper from "../helpers/ResolvablePromise";

type TMoveDiraction = "left" | "right";

export class SpaceShipUnit {
  private readonly moveStep = 100;
  protected rocketsLimit;
  protected _rockets: Array<Rocket> = new Array();
  public firedRockets: Array<Rocket> = new Array();
  protected rocketCounter = 0;
  public container: Container = new Container();

  constructor(private sprite: Sprite, private stage: Container) {
    this.rocketsLimit = GameConfig.rocketParam.ROCKETS_LIMIT;
    this.setSpriteParam(sprite);
    this.moveOnStartPosition();
    this.addRockets();
  }

  protected setSpriteParam(sprite: Sprite) {
    sprite.anchor.set(0.5);
    sprite.setSize(100);
    this.stage.addChild(this.container);
    this.container.addChild(sprite);
  }

  addRockets() {
    this._rockets = [];
    this.firedRockets = [];
    this.rocketCounter = 0;
    const screenSize = gameModel.getScreenSize();

    for (let index = 0; index < this.rocketsLimit; index++) {
      const rocket = new Rocket(
        { x: 0, y: screenSize.height - this.container.height },
        GameConfig.rocketParam.USER_ROCKET_COLOR,
        "top",
        screenSize.height - this.container.height * 1.5
      );

      this._rockets.push(rocket);
    }
  }

  async moveRight(distanceMultiplier?: number) {
    await this.move("right", distanceMultiplier);
  }

  async moveLeft(distanceMultiplier?: number) {
    await this.move("left", distanceMultiplier);
  }

  private async move(
    diraction: TMoveDiraction,
    distanceMultiplier: number = 1
  ): Promise<void> {
    let diractionIndex = 1;

    const screenWidth = gameModel.getScreenSize().width;

    if (diraction === "left") {
      diractionIndex = -1;
    }
    const endMovePromise = promiseHelper.getResolvablePromise<void>();

    gsap.to(this.container.position, {
      x:
        this.container.position.x +
        this.moveStep * diractionIndex * distanceMultiplier,
      duration: 0.6,
      ease: "back.out(4)",
      onUpdate: () => {
        if (
          this.container.position.x >
          screenWidth - this.container.width / 2
        ) {
          this.container.position.x = screenWidth - this.container.width / 2;
        }

        if (this.container.position.x < this.container.width / 2) {
          this.container.position.x = this.container.width / 2;
        }
      },
      onComplete: endMovePromise.resolve,
    });

    await endMovePromise;
  }

  moveOnStartPosition() {
    const screenSize = gameModel.getScreenSize();
    const x = screenSize.width / 2;
    const y = screenSize.height - this.container.height;
    this.container.position.set(x, y);
  }

  async shot() {
    if (this.rocketCounter < this.rocketsLimit) {
      const shootingPosition = this.getShootingPosition();
      const rocket = this._rockets.pop();
      this.firedRockets.push(rocket!);
      this.stage.addChild(rocket!.container);
      this.rocketCounter++;
      await rocket!.fly(shootingPosition);
    }
  }

  show() {
    this.moveOnStartPosition();
    gsap.to(this.container, {
      alpha: 1,
      duration: 0.5,
      onComplete: () => {
        this.container.visible = true;
      },
    });
  }

  get rocketsLeft(): number {
    return this._rockets.length;
  }

  getShootingPosition(): { x: number; y: number } {
    const rocketSize = GameConfig.rocketParam.ROCKET_SIZE;
    const globalPosition = this.container.toGlobal(
      new Point(
        -rocketSize / 2,
        -this.container.position.y - this.container.height / 2
      )
    );
    return {
      x: globalPosition.x,
      y: globalPosition.y,
    };
  }

  hide() {
    gsap.to(this.container, {
      alpha: 0.3,
      duration: 0.8,
      onComplete: () => {
        this.container.visible = false;
      },
    });
  }

  killed(){

  }

  update() {
    if (this.firedRockets.length !== 0) {
      this.firedRockets.forEach((rocket, ind) => {
        if (rocket.isCollision) {
          this.firedRockets.splice(ind, 1);
          rocket.container.destroy();
        }
      });
    }
  }
}
