import { SpaceShipUnit } from "../components/SpaceShipUnit";

export class SpaceshipHitChecker {
  private target!: SpaceShipUnit;
  private attackingShip!: SpaceShipUnit;
  private isActive: boolean = false;
  private callbackFunc!: () => void;
  private diraction!: "top" | "bottom";

  setChecker(
    target: SpaceShipUnit,
    spaceship: SpaceShipUnit,
    callbackFunc: () => void,
    diraction: "top" | "bottom" = "bottom"
  ) {
    this.diraction = diraction;
    this.isActive = true;
    this.target = target;
    this.attackingShip = spaceship;
    this.callbackFunc = callbackFunc;
  }

  deactivate() {
    this.isActive = false;
  }

  private checkCollision() {
    this.attackingShip.firedRockets.forEach((rocket) => {
      const rocketCoordinate = rocket.container.getBounds();

      let isCollisionY;
      if (this.diraction === "bottom") {
        isCollisionY =
          rocketCoordinate.y >=
          this.target.container.y - this.target.container.height / 3;
      } else {
        isCollisionY =
          rocketCoordinate.y <=
          this.target.container.y + this.target.container.height / 3;
      }
      const isCollisionX =
        rocketCoordinate.x >
          this.target.container.x - this.target.container.width / 2 &&
        rocketCoordinate.x <
          this.target.container.x + this.target.container.width / 2;

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
