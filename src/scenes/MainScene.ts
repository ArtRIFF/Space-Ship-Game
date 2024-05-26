import { Container, Sprite } from "pixi.js";
import { SpaceShipUnit } from "../components/SpaceShipUnit";
import { GameBackground } from "../components/GameBackground";

export class MainScene {
  private readonly spaceShip: SpaceShipUnit;
  private background: GameBackground;
  constructor(
    private stage: Container,
    textures: {
      spaceShipSprite: Sprite;
      spaceBackgroundSprite: Sprite;
    }
  ) {
    const { spaceShipSprite, spaceBackgroundSprite } = textures;
    this.background = new GameBackground(spaceBackgroundSprite);
    this.addToScene(this.background.container);
    this.spaceShip = new SpaceShipUnit(spaceShipSprite, stage);

    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowRight":
          this.spaceShip.moveRight();
          break;
        case "ArrowLeft":
          this.spaceShip.moveLeft();
          break;
        case " ":
          this.spaceShip.shot();
        default:
          break;
      }
    });
  }

  private addToScene(container: Sprite) {
    this.stage.addChild(container);
  }

  upadate(delta: number): void {}
}
