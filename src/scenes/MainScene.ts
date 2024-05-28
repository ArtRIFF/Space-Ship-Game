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
  private rocketsLabel: Label = new Label("Rockets:", 0);
  private timer: Timer;
  private popup: MainPopup;
  private asteroidSprite: Sprite;

  constructor(
    private stage: Container,
    textures: {
      spaceShipSprite: Sprite;
      spaceBackgroundSprite: Sprite;
      asteroidSprite: Sprite;
    }
  ) {
    const { spaceShipSprite, spaceBackgroundSprite, asteroidSprite } = textures;
    this.asteroidSprite = asteroidSprite;
    this.background = new GameBackground(spaceBackgroundSprite);
    this.addToScene(this.background.container);
    this.spaceShip = new SpaceShipUnit(spaceShipSprite, stage);
    this.addToScene(this.rocketsLabel.container);
    this.rocketsLabel.setPosition(50, 50);

    this.timer = new Timer(GameConfig.timerParam.GAME_TIME, () =>
      this.onTimerCountEnd()
    );
    this.timer.setPosition(
      gameModel.getScreenSize().width - this.timer.container.width - 50,
      50
    );
    this.popup = new MainPopup(() => this.onClickStartGame());
    this.popup.setPosition(
      gameModel.getScreenSize().width / 2 - this.popup.container.width / 2,
      gameModel.getScreenSize().height / 2 - this.popup.container.height / 2
    );

    this.addToScene(this.timer.container);
    this.addToScene(this.popup.container);

    document.addEventListener("keydown", this.onKeyDown.bind(this));
    gameModel.gameEmmiter.on("START_GAME", () => this.onStartGame());
    gameModel.gameEmmiter.on("WIN_GAME", () => this.onWinGame());
    gameModel.gameEmmiter.on("LOSE_GAME", () => this.onLoseGame());
  }

  async onKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case "ArrowRight":
        this.spaceShip.moveRight();
        break;
      case "ArrowLeft":
        this.spaceShip.moveLeft();
        break;
      case " ":
        const rocketsLeft = this.spaceShip.rocketsLeft;
        if (rocketsLeft > 0) {
          this.rocketsLabel.setNumbers(rocketsLeft - 1);
          await this.spaceShip.shot();
          gameModel.reduceRocketsAmount();
        }
      default:
        break;
    }
  }

  private onAsteroidHit() {
    gameModel.reduceAsteroidsAmount();
  }

  private addToScene(container: Sprite | Container) {
    this.stage.addChild(container);
  }

  addAsteroids() {
    this.asteroids = [];
    const sprite = this.asteroidSprite;
    const asteroidsLimit = GameConfig.asteroidParam.ASTEROIDS_LIMIT;
    for (let index = 0; index < asteroidsLimit; index++) {
      const spriteCopy = new Sprite(sprite.texture);
      const asteroid = new Asteroid(spriteCopy);
      const scaleVariationArray =
        GameConfig.asteroidParam.ASTEROIDS_SIZE_VARIATION;
      const randomIndex = Math.floor(
        getRandomArbitrary(0, scaleVariationArray.length)
      );
      asteroid.container.scale.set(scaleVariationArray[randomIndex]);
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
      asteroid.appear();
    }
  }

  onTimerCountEnd() {
    console.log("NO TIME LEFT");
    gameModel.noTimeLeft();
  }

  onClickStartGame() {
    gameModel.startGame();
  }

  onStartGame() {
    this.rocketsLabel.setNumbers(gameModel.rocketsAmount);
    this.spaceShip.addRockets();
    this.spaceShip.moveOnStartPosition();
    this.addAsteroids();
    this.asteroidsCollisionChecker.setChecker(
      this.asteroids,
      this.spaceShip,
      () => this.onAsteroidHit()
    );
    this.popup.close();
    this.timer.reset();
    this.timer.start();
  }

  onWinGame() {
    this.stopGame();
    this.popup.show(true);
  }

  onLoseGame() {
    this.stopGame();
    this.asteroids.forEach((asteroid) => asteroid.exploud());
    this.popup.show(false);
  }

  stopGame() {
    this.asteroidsCollisionChecker.deactivate();
    this.timer.pause();
  }

  upadate(delta: number): void {
    this.spaceShip.update();
    this.asteroidsCollisionChecker.update();
  }
}
