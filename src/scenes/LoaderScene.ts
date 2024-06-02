import { GameConfig } from "../config/GameConfig";
import { gameModel } from "../managers/GameModel";
import { IGameScene } from "../types/types";
import { Assets, Container, Graphics, Text } from "pixi.js";

export type TAsset = { alias: string; src: string };
export type TAssetsArray = Array<TAsset>;

export class LoaderScene implements IGameScene {
  private aliasArray: Array<string> = [];
  private container: Container = new Container();
  private stage!: Container;
  private borderRect: Graphics = new Graphics()
    .roundRect(-2.5, -2.5, 205, 35, 10)
    .fill(0xbf7460);
  private loaderLine: Graphics = new Graphics()
    .roundRect(0, 0, 0, 30, 10)
    .fill(0xff00f);
  private loaderContainer: Graphics = new Graphics()
    .roundRect(0, 0, 200, 30, 10)
    .fill(0xe580ff);

  constructor() {
    this.createLoader();
    this.createTitle();
  }

  private createTitle() {
    const title = new Text({
      text: "SPACE SHIP GAME",
      style: { ...GameConfig.labelFontStyle, fontSize: 40 },
    });
    title.position.set(
      this.container.width / 2 - title.width / 2,
      -title.height * 1.2
    );
    this.container.addChild(title);
  }

  private createLoader() {
    this.container.addChild(this.borderRect);
    this.container.addChild(this.loaderContainer);
    this.container.addChild(this.loaderLine);
  }

  addAssets(assets: TAssetsArray, stage: Container) {
    this.aliasArray = assets.map((asset) => asset.alias);
    this.stage = stage;
    this.stage.addChild(this.container);
    this.setPositionToCenter();
    Assets.add(assets);
  }

  setPositionToCenter() {
    const screenSize = gameModel.getScreenSize();
    this.container.position.set(
      screenSize.width / 2 - this.container.width / 4,
      screenSize.height / 2 - this.container.height / 2
    );
  }

  load(): Promise<Record<string, any>> {
    return Assets.load(this.aliasArray, (prog) => this.onProgress(prog));
  }

  private onProgress(prog: number) {
    const containerWidth = this.loaderContainer.width;
    const newWidth = Math.round(
      (containerWidth * Math.round(prog * 100)) / 100
    );
    this.setLoaderLineWidth(newWidth);
  }

  private setLoaderLineWidth(width: number) {
    this.container.removeChild(this.loaderLine);
    this.loaderLine = new Graphics()
      .roundRect(0, 0, width, 30, 10)
      .fill(0xff00f);
    this.container.addChild(this.loaderLine);
  }

  delete() {
    this.stage.removeChild(this.container);
  }

  update() {}
}

export const loaderScene = new LoaderScene();
