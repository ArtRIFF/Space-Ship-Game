import { ColorMatrixFilter, Container, Sprite } from "pixi.js";
import gsap from "gsap";
import { GameConfig } from "../config/GameConfig";
import { getRandomArbitrary } from "../helpers/mathFunction";
import { gameModel } from "../managers/GameModel";
import { TCoordinate } from "../types/types";

export class Asteroid {
  public container: Container = new Container();
  private ticker: gsap.Ticker = gsap.ticker;
  private driftingDirection: TCoordinate = { x: 0, y: 0 };
  constructor(sprite: Sprite) {
    sprite.scale.set(0.5);
    this.container.addChild(sprite);
    this.setIndividualColor();
    this.setIndividualTrajectory();
    this.container.alpha = 0;
  }

  setIndividualColor() {
    const filter = new ColorMatrixFilter();
    this.container.filters = [filter];
    const colorVariation = GameConfig.asteroidParam.ASTEROIDS_COLOR_VARIATION;
    const randomIndex = Math.floor(
      getRandomArbitrary(0, colorVariation.length)
    );
    filter.tint(colorVariation[randomIndex], true);
  }

  setIndividualTrajectory() {
    const possibleSpeed = GameConfig.asteroidParam.ASTEROIDS_SPEED_VARIATION;
    const randomXIndex = Math.floor(
      getRandomArbitrary(0, possibleSpeed.length)
    );
    const randomYIndex = Math.floor(
      getRandomArbitrary(0, possibleSpeed.length)
    );
    const diractionArray = [-1, 1];
    const diractionXIndex = Math.floor(
      getRandomArbitrary(0, diractionArray.length)
    );
    const diractionYIndex = Math.floor(
      getRandomArbitrary(0, diractionArray.length)
    );

    this.driftingDirection = {
      x: possibleSpeed[randomXIndex] * diractionArray[diractionXIndex],
      y: possibleSpeed[randomYIndex] * diractionArray[diractionYIndex],
    };
  }

  setPosition(x: number, y: number) {
    this.container.position.set(x, y);
  }

  exploud() {
    gsap.to(this.container, {
      alpha: 0,
      duration: 0.5,
      onComplete: () => {
        this.ticker.remove(this.spaceDrifting);
        this.container.destroy();
      },
    });
  }

  appear() {
    gsap.to(this.container, {
      alpha: 1,
      duration: 0.5,
      onComplete: () => {
        this.fly();
      },
    });
  }

  private fly() {
    this.ticker.add(this.spaceDrifting);
  }

  spaceDrifting = () => {
    const screenSize = gameModel.getScreenSize();
    const isInHorizontalRange =
      this.container.x + this.container.width < screenSize.width &&
      this.container.x > 0;
    const isInVerticalRange =
      this.container.y + this.container.height < screenSize.height / 2 &&
      this.container.y > 0;

    if (isInHorizontalRange) {
      this.container.x += this.driftingDirection.x;
    } else {
      this.driftingDirection.x *= -1;
      this.container.x += this.driftingDirection.x;
    }

    if (isInVerticalRange) {
      this.container.y += this.driftingDirection.y;
    } else {
      this.driftingDirection.y *= -1;
      this.container.y += this.driftingDirection.y;
    }
  };
}
