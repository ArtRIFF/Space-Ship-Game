import { Container, Point, Sprite } from "pixi.js";
import { SpaceShipUnit } from "../components/SpaceShipUnit";
import { GameBackground } from "../components/GameBackground";
import { Asteroid } from "../components/Asteroid";
import { GameConfig } from "../config/GameConfig";
import { gameModel } from "../managers/GameModel";
import { getRandomArbitrary } from "../helpers/mathFunction";
import { CollisionChecker } from "../managers/CollisionChecker";

export class MainScene {
  private spaceShip: SpaceShipUnit;
  private background: GameBackground;
  private asteroids: Array<Asteroid> = [];
  private asteroidsCollisionChecker: CollisionChecker = new CollisionChecker();

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

    this.asteroidsCollisionChecker.setChecker(
      this.asteroids,
      this.spaceShip,
      () => this.onAsteroidHit()
    );

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

  upadate(delta: number): void {
    this.spaceShip.update();
    this.asteroidsCollisionChecker.update();
  }
}
