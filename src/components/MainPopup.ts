import { Container, Graphics, Text } from "pixi.js";
import { GameConfig } from "../config/GameConfig";
import { Button } from "./Button";
import gsap from "gsap";

export class MainPopup {
  public container = new Container();
  private title: Text = new Text({
    text: "Spaceship Game",
    style: { ...GameConfig.labelFontStyle },
  });
  private button: Button;

  constructor(onclickCallback: () => void) {
    this.addBackground();
    this.container.addChild(this.title);
    this.title.scale.set(1.2);
    this.alignToCenter(this.title, 30);
    this.button = new Button("Start Game", onclickCallback);
    this.container.addChild(this.button.container);
    this.alignToCenter(this.button.container, 120);
    this.container.sortableChildren = true;
    this.container.zIndex = 2;
  }

  setPosition(x: number, y: number) {
    this.container.position.set(x, y);
  }

  private addBackground() {
    const innerRect = new Graphics()
      .roundRect(3, 3, 494, 294)
      .fill(GameConfig.popupParam.BACKGROUND_COLOR);
    const rect = new Graphics().roundRect(0, 0, 500, 300).fill("0xFFF");
    this.container.addChild(rect);
    this.container.addChild(innerRect);
  }

  private alignToCenter(element: Container, coordinateY: number) {
    element.position.set(
      this.container.width / 2 - element.width / 2,
      coordinateY
    );
  }

  show(isWin: boolean) {
    this.container.visible = true;
    this.title.text = isWin ? "YOU WIN" : "YOU LOSE";
    this.button.changeTitle("Restart");
    this.alignToCenter(this.title, 30);
    gsap.to(this.container, {
      alpha: 1,
      duration: 0.5,
    });
  }

  close() {
    gsap.to(this.container, {
      alpha: 0,
      delay: 0.1,
      duration: 0.3,
      onComplete: () => {
        this.container.visible = false;
      },
    });
  }
}
