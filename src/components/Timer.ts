import { Container } from "pixi.js";
import Label from "./Label";

export class Timer {
  public container: Container = new Container();
  private label: Label;
  private callbackFunc;
  private startTime: number;
  private counter: number;
  private indexInterval!: any;

  constructor(startTime: number, callbackFunc: () => void) {
    this.label = new Label("Time left:", startTime);
    this.callbackFunc = callbackFunc;
    this.startTime = startTime;
    this.counter = startTime;
    this.container.addChild(this.label.container);
  }

  setPosition(x: number, y: number) {
    this.container.position.set(x, y);
  }

  start() {
    this.indexInterval = setInterval(() => {
      this.counter--;
      this.label.setNumbers(this.counter);
      if (this.counter === 0) {
        clearInterval(this.indexInterval);
        this.callbackFunc();
      }
    }, 1000);
  }

  pause() {
    clearInterval(this.indexInterval);
  }

  reset() {
    this.counter = this.startTime;
    this.label.setNumbers(this.counter);
    clearInterval(this.indexInterval);
  }
}
