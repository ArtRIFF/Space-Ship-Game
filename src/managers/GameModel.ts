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

  get asteroidsAmount() {
    return this._asteroidsAmount;
  }

  startGame() {
    this._asteroidsAmount = GameConfig.asteroidParam.ASTEROIDS_LIMIT;
    this._rocketsAmount = GameConfig.rocketParam.ROCKETS_LIMIT;
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
      this.isGameEnd = true;
      this.gameEmmiter.emit("WIN_GAME");
    }
  }

  noTimeLeft() {
    if (!this.isGameEnd) {
      this.gameEmmiter.emit("LOSE_GAME");
    }
  }
}

export const gameModel = new GameModel();
