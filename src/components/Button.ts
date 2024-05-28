import { Container, Graphics, Text } from "pixi.js";
import { GameConfig } from "../config/GameConfig";

export class Button {
  public container: Container = new Container();
  private title!: Text;
  private onClickCallBack: () => void;

  constructor(text: string, onClickCallback: () => void) {
    this.createBackground();
    this.createTitle(text);
    this.onClickCallBack = onClickCallback;
    this.container.interactive = true;
    this.container.cursor = "pointer";
    this.container.on("pointertap", this.clickHandler, this);
  }

  private clickHandler() {
    this.onClickCallBack();
  }

  createTitle(text: string) {
    this.title = new Text({
      text: text,
      style: {
        fill: "0xFFF",
        fontSize: 30,
        fontWeight: "bold",
        fontVariant: "small-caps",
      },
    });
    this.container.addChild(this.title);
    this.title.position.set(
      this.container.width / 2 - this.title.width / 2,
      this.container.height / 2 - this.title.height / 2
    );
  }

  changeTitle(title: string) {
    this.title.text = title;
    this.title.position.set(
      this.container.width / 2 - this.title.width / 2,
      this.container.height / 2 - this.title.height / 2
    );
  }

  createBackground() {
    const innerRect = new Graphics()
      .roundRect(3, 3, 204, 74)
      .fill(GameConfig.popupParam.BUTTON_COLOR);
    const rect = new Graphics().roundRect(0, 0, 210, 80).fill("0xFFF");
    this.container.addChild(rect);
    this.container.addChild(innerRect);
  }
}
