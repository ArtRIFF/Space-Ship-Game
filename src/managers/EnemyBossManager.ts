import { SpaceShipUnit } from "../components/SpaceShipUnit";
import promiseHelper from "../helpers/ResolvablePromise";
import { getRandomArbitrary } from "../helpers/mathFunction";

export class EnemyBossManager {
  private enemyBoss!: SpaceShipUnit;
  private targetUnit!: SpaceShipUnit;
  private isFreeToMove: boolean = false;
  private isFreeToShot: boolean = false;
  private isActive: boolean = false;

  constructor() {}

  setManager(enemyBoss: SpaceShipUnit, targetUnit: SpaceShipUnit) {
    this.enemyBoss = enemyBoss;
    this.targetUnit = targetUnit;
  }

  activate() {
    this.isActive = true;
    this.isFreeToMove = true;
    this.isFreeToShot = true;
  }

  deactivate() {
    this.isActive = false;
    this.isFreeToMove = false;
    this.isFreeToShot = false;
  }

  async randomMove() {
    const randomIndex = Math.round(getRandomArbitrary(-1, 1));

    if (randomIndex === 1) {
      await this.enemyBoss.moveRight(Math.floor(getRandomArbitrary(1, 4)));
      await promiseHelper.getDelayPromise(0.5);
    } else if (randomIndex === -1) {
      await this.enemyBoss.moveLeft(Math.floor(getRandomArbitrary(1, 4)));
      await promiseHelper.getDelayPromise(0.5);
    } else {
      await promiseHelper.getDelayPromise(0.5);
    }
  }

  private async chaseTarget() {
    const enemyLeftBorder = this.enemyBoss.container.x;
    const enemyRightBorder = this.enemyBoss.container.x;
    const targetLeftBorder = this.targetUnit.container.x;
    const targetRightBorder =
      this.targetUnit.container.x + this.targetUnit.container.width;

    if (
      enemyLeftBorder <= targetLeftBorder &&
      enemyRightBorder >= targetRightBorder
    ) {
      await promiseHelper.getDelayPromise(0.5);
    } else if (targetRightBorder > enemyRightBorder) {
      await this.enemyBoss.moveRight();
      await promiseHelper.getDelayPromise(0.5);
    } else if (targetLeftBorder < enemyLeftBorder) {
      await this.enemyBoss.moveLeft();
      await promiseHelper.getDelayPromise(0.5);
    }
  }

  private async makeMove() {
    const randomIndex = Math.round(getRandomArbitrary(0, 4));
    this.isFreeToMove = false;
    if (randomIndex === 4) {
      await this.randomMove();
    } else {
      await this.chaseTarget();
    }
    this.isFreeToMove = true;
  }

  private async makeShot() {
    this.isFreeToShot = false;
    await this.enemyBoss.shot();
    if (!this.enemyBoss.firedRockets.length) {
      this.enemyBoss.addRockets();
    }
    this.isFreeToShot = true;
  }

  update() {
    if (this.isFreeToMove && this.isActive) {
      this.makeMove();
    }

    if (this.isFreeToShot && this.isActive) {
      this.makeShot();
    }
  }
}

export const enemyManager = new EnemyBossManager();
