import { IGameScene } from "../types/types";
import { Container, Sprite } from "pixi.js";
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
import { EnemyBossUnit } from "../components/EnemyBossUnit";
import { EnemyBossManager, enemyManager } from "../managers/EnemyBossManager";
import { SpaceshipHitChecker } from "../managers/SpaceshipHitChecker";
import { TransitionPopup } from "../components/TransitionPopup";

export class MainScene implements IGameScene {
  private spaceShip: SpaceShipUnit;
  private enemyBoss: SpaceShipUnit;
  private background: GameBackground;
  private asteroids: Array<Asteroid> = [];
  private asteroidsCollisionChecker: CollisionChecker = new CollisionChecker();
  private spaceShipCollisionChecker: SpaceshipHitChecker =
    new SpaceshipHitChecker();
  private enemyCollisionChecker: SpaceshipHitChecker =
    new SpaceshipHitChecker();
  private rocketsLabel: Label = new Label("Rockets:", 0);
  private enemyBossLabel: Label = new Label("Boss Lives:", 0);
  private timer: Timer;
  private popup: MainPopup;
  private asteroidSprite: Sprite;
  private enemyBossManager: EnemyBossManager = enemyManager;
  private transitionPopup: TransitionPopup = new TransitionPopup();

  constructor(private stage: Container, textures: Record<string, any>) {
    const spaceShipSprite = Sprite.from(textures["space_ship"]);
    const spaceBackgroundSprite = Sprite.from(textures["space_bg"]);
    this.asteroidSprite = Sprite.from(textures["asteroid"]);
    this.background = new GameBackground(spaceBackgroundSprite);
    this.addToScene(this.background.container);
    this.spaceShip = new SpaceShipUnit(spaceShipSprite, stage);
    this.enemyBoss = new EnemyBossUnit(textures["enemyBossIdle"], stage, {
      attack: textures["enemyBossAttack"],
      killed: textures["enemyBossKilled"],
    });
    this.addToScene(this.rocketsLabel.container);
    this.rocketsLabel.setPosition(50, 50);

    this.addToScene(this.enemyBossLabel.container);
    this.enemyBossLabel.setPosition(300, 50);

    this.addToScene(this.transitionPopup.container);

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

    this.enemyBossManager.setManager(this.enemyBoss, this.spaceShip);
    this.enemyBossLabel.container.visible = false;

    this.addToScene(this.timer.container);
    this.addToScene(this.popup.container);

    document.addEventListener("keydown", this.onKeyDown.bind(this));
    gameModel.gameEmmiter.on("START_GAME", () => this.onStartGame());
    gameModel.gameEmmiter.on("FINAL_LEVEL", () => this.onFinalLevel());
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

  private onSpaceshipHit() {
    this.spaceShip.exploud();
    gameModel.spaceshipHit();
  }

  private onEnemyBossHit() {
    this.enemyCollisionChecker.activate();
    this.enemyBossLabel.setNumbers(gameModel.enemyBossLifes - 1);
    gameModel.enemyHit();
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
    gameModel.noTimeLeft();
  }

  onClickStartGame() {
    gameModel.startGame();
  }

  onStartGame() {
    this.rocketsLabel.setNumbers(gameModel.rocketsAmount);
    this.enemyBossLabel.container.visible = false;
    this.spaceShip.addRockets();
    this.spaceShip.show();
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

  async onFinalLevel() {
    this.asteroids.forEach((asteroid) => asteroid.exploud());
    this.asteroidsCollisionChecker.deactivate();
    this.timer.pause();
    await this.transitionPopup.show();
    this.enemyBossLabel.container.visible = true;
    this.enemyBossLabel.setNumbers(gameModel.rocketsAmount);
    await this.enemyBoss.show();
    this.spaceShip.addRockets();
    this.rocketsLabel.setNumbers(10);
    this.enemyBossManager.activate();
    this.spaceShipCollisionChecker.setChecker(
      this.spaceShip,
      this.enemyBoss,
      () => this.onSpaceshipHit(),
      "bottom"
    );
    this.enemyCollisionChecker.setChecker(
      this.enemyBoss,
      this.spaceShip,
      () => this.onEnemyBossHit(),
      "top"
    );
    this.timer.reset();
    this.timer.start();
  }

  onWinGame() {
    this.stopGame();
    this.popup.show(true);
  }

  onLoseGame() {
    this.stopGame();
    this.popup.show(false);
  }

  stopGame() {
    this.asteroids.forEach((asteroid) => asteroid.exploud());
    this.enemyBoss.exploud();
    this.asteroidsCollisionChecker.deactivate();
    this.enemyCollisionChecker.deactivate();
    this.spaceShipCollisionChecker.deactivate();
    this.enemyBossManager.deactivate();
    this.timer.pause();
  }

  update(delta: number): void {
    this.spaceShip.update();
    this.enemyBoss.update();
    this.enemyBossManager.update();
    this.asteroidsCollisionChecker.update();
    this.spaceShipCollisionChecker.update();
    this.enemyCollisionChecker.update();
  }
}
