import { Sprite } from "pixi.js";
import gsap from "gsap";
import { gameModel } from "../managers/GameModel";

type TMoveDiraction = "left" | "right";

export class SpaceShipUnit {
  private readonly moveStep = 100;

  constructor(public container: Sprite) {
    container.anchor.set(0.5);
    container.setSize(100);
    this.moveOnStartPosition();
  }

  moveRight() {
    this.move("right");
  }

  moveLeft() {
    this.move("left");
  }

  private move(diraction: TMoveDiraction) {
    let diractionIndex = 1;

    if (diraction === "left") {
      diractionIndex = -1;
    }

    gsap.to(this.container.position, {
      x: this.container.position.x + 100 * diractionIndex,
      duration: 0.6,
      ease: "back.out(4)",
      onUpdate: () => {
        if (this.container.position._x > 1270 - this.container.width / 2) {
          this.container.position.x = 1270 - this.container.width / 2;
        }

        if (this.container.position._x < this.container.width / 2) {
          this.container.position.x = this.container.width / 2;
        }
      },
    });
  }

  private moveOnStartPosition() {
    const screenSize = gameModel.getScreenSize();
    this.container.position.set(
      screenSize.width / 2,
      screenSize.height - this.container.height
    );
  }

  update(delta: number) {}
}
