import { Container, Graphics, Point, Sprite } from "pixi.js";
import gsap from "gsap";
import { gameModel } from "../managers/GameModel";
import { Rocket } from "./Rocket";
import { GameConfig } from "../config/GameConfig";

type TMoveDiraction = "left" | "right";

export class SpaceShipUnit {
  private readonly moveStep = 100;
  private readonly rocketsLimit;
  private rockets: Array<Rocket> = new Array();
  public firedRockets: Array<Rocket> = new Array();
  private rocketCounter = 0;
  public container: Container = new Container();

  constructor(private sprite: Sprite, private stage: Container) {
    sprite.anchor.set(0.5);
    sprite.setSize(100);
    this.rocketsLimit = GameConfig.rocketParam.ROCKETS_LIMIT;
    this.stage.addChild(this.container);
    this.container.addChild(this.sprite);
    this.moveOnStartPosition();
    this.addRockets();
  }

  addRockets() {
    this.rockets = [];
    this.firedRockets = [];
    this.rocketCounter = 0;
    const screenSize = gameModel.getScreenSize();

    for (let index = 0; index < this.rocketsLimit; index++) {
      const rocket = new Rocket(
        { x: 0, y: screenSize.height - this.container.height },
        GameConfig.rocketParam.USER_ROCKET_COLOR,
        "top"
      );

      this.rockets.push(rocket);
    }
  }

  moveRight() {
    this.move("right");
  }

  moveLeft() {
    this.move("left");
  }

  private move(diraction: TMoveDiraction) {
    let diractionIndex = 1;
    const screenWidth = gameModel.getScreenSize().width;

    if (diraction === "left") {
      diractionIndex = -1;
    }

    gsap.to(this.container.position, {
      x: this.container.position.x + this.moveStep * diractionIndex,
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
    });
  }

  private moveOnStartPosition() {
    const screenSize = gameModel.getScreenSize();
    const x = screenSize.width / 2;
    const y = screenSize.height - this.container.height;
    this.container.position.set(x, y);
  }

  shot() {
    if (this.rocketCounter < this.rocketsLimit) {
      const shootingPosition = this.getShootingPosition();
      const rocket = this.rockets.pop();
      rocket!.fly(shootingPosition);
      this.firedRockets.push(rocket!);
      this.stage.addChild(rocket!.container);
      this.rocketCounter++;
    }
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

  update() {
    if (this.firedRockets.length !== 0) {
      for (const rocket of this.firedRockets) {
        if (rocket.isCollision) {
          this.firedRockets = this.firedRockets.filter((r) => r !== rocket);
        }
      }
    }
  }
}
