import { Text } from "pixi.js";
import { GameConfig } from "../config/GameConfig";
import gsap from "gsap";
import promiseHelper from "../helpers/ResolvablePromise";
import { gameModel } from "../managers/GameModel";

export class TransitionPopup {
  public readonly container: Text = new Text({
    text: "FINAL LEVEL!",
    style: GameConfig.transitonPopupFontStyle,
  });
  constructor() {
    this.container.zIndex = 5;
    this.hide();
  }

  async show(): Promise<void> {
    this.setPosition();
    const endAnimationPromise = promiseHelper.getResolvablePromise<void>();
    this.container.visible = true;
    gsap.to(this.container.scale, {
      x: 1,
      y: 1,
      duration: 3,
      ease: "bounce.out",
      onComplete: () => {
        this.hide();
        endAnimationPromise.resolve();
      },
    });
    await endAnimationPromise;
  }

  private setPosition() {
    this.container.anchor.set(0.5);
    this.container.position.set(
      gameModel.getScreenSize().width / 2 - this.container.width / 2,
      gameModel.getScreenSize().height / 2 - this.container.height / 2
    );
  }

  hide() {
    this.container.visible = false;
    this.container.scale.set(0);
  }
}
