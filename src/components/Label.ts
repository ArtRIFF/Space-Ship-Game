import { Container, Text } from "pixi.js";
import { GameConfig } from "../config/GameConfig";

export default class Label {
  private readonly title: Text;
  private readonly numbers: Text;
  container: Container = new Container();

  constructor(titleText: string, numbers: number) {
    this.title = new Text({
      text: titleText,
      style: {
        ...GameConfig.labelFontStyle,
      },
    });
    this.numbers = new Text({
      text: numbers,
      style: {
        ...GameConfig.labelFontStyle,
      },
    });
    this.container.addChild(this.title);
    this.container.addChild(this.numbers);
    this.setNumbersPosition();
    this.container.sortableChildren = true;
    this.container.zIndex = 2;
  }

  private setNumbersPosition() {
    this.numbers.position.set(this.title.width + 10, 0);
  }

  setPosition(x: number, y: number) {
    this.container.position.set(x, y);
  }

  setNumbers(value: number) {
    this.numbers.text = `${value}`;
  }
}
