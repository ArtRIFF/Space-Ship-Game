import { Container, Point, Sprite } from "pixi.js";
import { SpaceShipUnit } from "../components/SpaceShipUnit";
import { GameBackground } from "../components/GameBackground";
import { Asteroid } from "../components/Asteroid";
import { GameConfig } from "../config/GameConfig";
import { gameModel } from "../managers/GameModel";
import { getRandomArbitrary } from "../helpers/mathFunction";
import { CollisionChecker } from "../managers/CollisionChecker";
import Label from "../components/Label";
import { Timer } from "../components/Timer";
import { MainPopup } from "../components/MainPopup";

export class MainScene {
  private spaceShip: SpaceShipUnit;
  private background: GameBackground;
  private asteroids: Array<Asteroid> = [];
  private asteroidsCollisionChecker: CollisionChecker = new CollisionChecker();
  private rocketsLabel: Label = new Label("Rockets:", 10);
  private timer: Timer;
  private popup: MainPopup;

  constructor(
    private stage: Container,
    textures: {
      spaceShipSprite: Sprite;
      spaceBackgroundSprite: Sprite;
      asteroidSprite: Sprite;
    }
  ) {
    const { spaceShipSprite, spaceBackgroundSprite, asteroidSprite } = textures;
    this.background = new GameBackground(spaceBackgroundSprite);
    this.addToScene(this.background.container);
    this.spaceShip = new SpaceShipUnit(spaceShipSprite, stage);
    this.addAsteroids(asteroidSprite);

    this.addToScene(this.rocketsLabel.container);
    this.rocketsLabel.setPosition(50, 50);

    this.asteroidsCollisionChecker.setChecker(
      this.asteroids,
      this.spaceShip,
      () => this.onAsteroidHit()
    );

    this.timer = new Timer(GameConfig.timerParam.GAME_TIME, () =>
      this.onTimerCountEnd()
    );
    this.timer.setPosition(
      gameModel.getScreenSize().width - this.timer.container.width - 50,
      50
    );
    this.popup = new MainPopup(() => this.startNewGame());
    this.popup.setPosition(
      gameModel.getScreenSize().width / 2 - this.popup.container.width / 2,
      gameModel.getScreenSize().height / 2 - this.popup.container.height / 2
    );
    this.popup.close();

    this.addToScene(this.timer.container);
    this.addToScene(this.popup.container);

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

  private onAsteroidHit() {
    console.log(`Asteroid destroyed, left ${this.asteroids.length}`);
  }

  private addToScene(container: Sprite | Container) {
    this.stage.addChild(container);
  }

  addAsteroids(sprite: Sprite) {
    this.asteroids = [];

    const asteroidsLimit = GameConfig.asteroidParam.ASTEROIDS_LIMIT;
    for (let index = 0; index < asteroidsLimit; index++) {
      const spriteCopy = new Sprite(sprite.texture);
      const asteroid = new Asteroid(spriteCopy);
      const screenSize = gameModel.getScreenSize();
      const randomX = getRandomArbitrary(
        0,
        screenSize.width - asteroid.container.width
      );
      const randomY = getRandomArbitrary(
        0,
        screenSize.height / 2 - asteroid.container.height
      );
      asteroid.setPosition(randomX, randomY);

      this.asteroids.push(asteroid);
      this.addToScene(asteroid.container);
    }
  }

  onTimerCountEnd() {
    console.log("NO TIME LEFT");
  }

  startNewGame() {
    console.log("Start new game");
    this.popup.close();
  }

  upadate(delta: number): void {
    this.spaceShip.update();
    this.asteroidsCollisionChecker.update();
  }
}
