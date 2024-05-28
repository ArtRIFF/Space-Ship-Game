import { ColorMatrixFilter, Container, Graphics, Text } from "pixi.js";
import { GameConfig } from "../config/GameConfig";

export class Button {
  public container: Container = new Container();
  private title!: Text;
  private onClickCallBack: () => void;
  private hoverFilter!: ColorMatrixFilter;
  private rect!: Graphics;

  constructor(text: string, onClickCallback: () => void) {
    this.createBackground();
    this.createTitle(text);
    this.onClickCallBack = onClickCallback;
    this.setHoverFilter();
    this.container.interactive = true;
    this.container.cursor = "pointer";
    this.container.on("pointertap", this.clickHandler, this);
    this.container.on("pointerover", this.onHoverHandler, this);
    this.container.on("pointerout", this.onHoverOffHandler, this);
  }

  setHoverFilter() {
    this.hoverFilter = new ColorMatrixFilter();
    const colorVariation = GameConfig.popupParam.BUTTON_HOVER_COLOR;
    this.hoverFilter.tint(colorVariation, true);
  }

  private clickHandler() {
    this.onClickCallBack();
  }

  onHoverHandler() {
    this.rect.filters = [this.hoverFilter];
  }

  onHoverOffHandler() {
    this.rect.filters = [];
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
    this.rect = new Graphics().roundRect(0, 0, 210, 80).fill("0xFFF");
    this.rect.alpha = 0.7;
    this.container.addChild(this.rect);
    this.container.addChild(innerRect);
  }
}
