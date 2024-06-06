import { GameConfig } from "../config/GameConfig";
import { EventEmitter } from "../helpers/EventEmitter";

type TScreenSize = { width: number; height: number };

class GameModel {
  private screenSize: TScreenSize = {
    width: 0,
    height: 0,
  };
  private _rocketsAmount: number = 0;
  private _asteroidsAmount: number = 0;
  private _enemyBossLifes: number = 0;
  public gameEmmiter: EventEmitter = new EventEmitter();
  private isGameEnd: boolean = false;

  setScreenSize(screenSize: TScreenSize) {
    this.screenSize = screenSize;
  }

  getScreenSize(): TScreenSize {
    return this.screenSize;
  }

  get rocketsAmount() {
    return this._rocketsAmount;
  }

  get enemyBossLifes() {
    return this._enemyBossLifes;
  }

  get asteroidsAmount() {
    return this._asteroidsAmount;
  }

  startGame() {
    this._asteroidsAmount = GameConfig.asteroidParam.ASTEROIDS_LIMIT;
    this._rocketsAmount = GameConfig.rocketParam.ROCKETS_LIMIT;
    this._enemyBossLifes = GameConfig.enemyBossParam.LIFE_POINTS;
    this.isGameEnd = false;
    this.gameEmmiter.emit("START_GAME");
  }

  reduceRocketsAmount() {
    if (!this.isGameEnd) {
      this._rocketsAmount--;
      if (this._rocketsAmount === 0 && this._asteroidsAmount > 0) {
        this.isGameEnd = true;
        this.gameEmmiter.emit("LOSE_GAME");
      }
    }
  }

  reduceAsteroidsAmount() {
    this._asteroidsAmount--;
    if (this._asteroidsAmount === 0) {
      this._rocketsAmount = GameConfig.rocketParam.ROCKETS_LIMIT;
      this.gameEmmiter.emit("FINAL_LEVEL");
    }
  }

  spaceshipHit() {
    this.gameEmmiter.emit("LOSE_GAME");
    this.isGameEnd = true;
  }

  enemyHit() {
    this._enemyBossLifes--;
    if (this._enemyBossLifes === 0) {
      this.gameEmmiter.emit("WIN_GAME");
      this.isGameEnd = true;
    }
  }

  noTimeLeft() {
    if (!this.isGameEnd) {
      this.gameEmmiter.emit("LOSE_GAME");
      this.isGameEnd = true;
    }
  }
}

export const gameModel = new GameModel();
