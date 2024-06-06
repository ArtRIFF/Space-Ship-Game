import { Container, Sprite, toLocalGlobalMixin } from "pixi.js";
import { SpaceShipUnit } from "./SpaceShipUnit";
import { GameConfig } from "../config/GameConfig";
import { gameModel } from "../managers/GameModel";
import gsap from "gsap";
import { Rocket } from "./Rocket";

export class EnemyBossUnit extends SpaceShipUnit {
  private stateSprite: { attack: Sprite; killed: Sprite; idle: Sprite };
  private state: "idle" | "killed" | "attack" = "idle";
  constructor(
    sprite: Sprite,
    stage: Container,
    stateSprites: { attack: Sprite; killed: Sprite }
  ) {
    super(sprite, stage);
    this.stateSprite = Object.assign(stateSprites, { idle: sprite });

    Object.values(this.stateSprite).forEach((sprite) =>
      this.setSpriteParam(sprite)
    );

    this.moveOnStartPosition();

    this.changeSprite(this.state);
    this.container.visible = false;
  }

  protected setSpriteParam(sprite: Sprite) {
    super.setSpriteParam(sprite);
    sprite.setSize(250);
  }

  async show(): Promise<void> {
    let resolveMove: (value: void | PromiseLike<void>) => void;
    const finishMovePromise = new Promise<void>((resolve) => {
      resolveMove = resolve;
    });
    this.moveOnStartPosition();
    this.container.visible = true;
    this.container.alpha = 1;
    gsap.to(this.container, {
      y: this.container.height * 0.6,
      duration: 1.5,
      ease: "back.inOut",
      onComplete: () => {
        this.addRockets();
        resolveMove();
      },
    });

    await finishMovePromise;
  }

  private changeSprite(state: "idle" | "killed" | "attack") {
    this.container.sortableChildren = true;
    for (const [key, sprite] of Object.entries(this.stateSprite)) {
      sprite.sortableChildren = true;
      if (key === state) {
        sprite.visible = true;
        sprite.zIndex = 0;
      } else {
        sprite.visible = false;
        sprite.zIndex = -1;
      }
    }
    this.state = state;
  }

  moveOnStartPosition() {
    const screenSize = gameModel.getScreenSize();
    const x = screenSize.width / 2;
    const y = -this.container.height * 1.5;
    this.container.position.set(x, y);
  }

  addRockets() {
    this._rockets = [];
    this.firedRockets = [];
    this.rocketCounter = 0;
    const screenSize = gameModel.getScreenSize();
    for (let index = 0; index < this.rocketsLimit; index++) {
      const rocket = new Rocket(
        { x: 0, y: -this.container.y + this.container.height * 2 },
        GameConfig.rocketParam.ENEMY_ROCKET_COLOR,
        "bottom",
        screenSize.height - this.container.height
      );

      this._rockets.push(rocket);
    }
  }
}
