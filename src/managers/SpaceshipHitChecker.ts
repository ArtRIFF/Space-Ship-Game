import { SpaceShipUnit } from "../components/SpaceShipUnit";

export class SpaceshipHitChecker {
  private target!: SpaceShipUnit;
  private attackingShip!: SpaceShipUnit;
  private isActive: boolean = false;
  private callbackFunc!: () => void;

  setChecker(
    target: SpaceShipUnit,
    spaceship: SpaceShipUnit,
    callbackFunc: () => void
  ) {
    this.isActive = true;
    this.target = target;
    this.attackingShip = spaceship;
    this.callbackFunc = callbackFunc;
  }

  deactivate() {
    this.isActive = false;
  }

  private checkCollision() {
    this.attackingShip.firedRockets.forEach((rocket, index) => {
      const rocketCoordinate = rocket.container.getBounds();
      const isCollisionY =
        rocketCoordinate.y >=
        this.target.container.y - this.target.container.height / 3;
      const isCollisionX =
        rocketCoordinate.x >
          this.target.container.x - this.target.container.width / 2 &&
        rocketCoordinate.x < this.target.container.x;

      if (isCollisionX && isCollisionY) {
        this.target.exploud();
        rocket.isCollision = true;
        this.isActive = false;
        this.callbackFunc();
      }
    });
  }

  update() {
    if (this.isActive) {
      this.checkCollision();
    }
  }
}
