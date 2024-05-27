import { Asteroid } from "../components/Asteroid";
import { SpaceShipUnit } from "../components/SpaceShipUnit";

export class CollisionChecker {
  private targets: Array<Asteroid> = [];
  private spaceship!: SpaceShipUnit;
  private isActive: boolean = false;
  private callbackFunc!: () => void;

  setChecker(
    targets: Array<Asteroid>,
    spaceship: SpaceShipUnit,
    callbackFunc: () => void
  ) {
    this.isActive = true;
    this.targets = targets;
    this.spaceship = spaceship;
    this.callbackFunc = callbackFunc;
  }

  deactivate() {
    this.isActive = false;
  }

  private checkCollision() {
    if (this.spaceship.firedRockets.length) {
      this.spaceship.firedRockets.forEach((rocket) => {
        if (rocket !== null && !rocket.isCollision) {
          const rocketCoordinate = rocket.container.getBounds();
          this.targets.forEach((target, index) => {
            const targetPosition = target.container.position;
            const targetWidth = target.container.width;
            const targetHeigth = target.container.height;

            const bottomTargetBorderY = targetPosition.y + targetHeigth;
            const leftTargetBorderX = targetPosition.x;
            const rightTargetBorderX = targetPosition.x + targetWidth;

            const isCollisionY = rocketCoordinate.y <= bottomTargetBorderY;
            const isCollisionX =
              rocketCoordinate.x >= leftTargetBorderX &&
              rocketCoordinate.x <= rightTargetBorderX;

            if (isCollisionY && isCollisionX) {
              this.targets.splice(index, 1);
              target.container.destroy();
              rocket.isCollision = true;
              this.callbackFunc();
            }
          });
        }
      });
    }
  }

  update() {
    if (this.isActive) {
      this.checkCollision();
    }
  }
}
