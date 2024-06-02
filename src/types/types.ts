import { Container } from "pixi.js";

export type TCoordinate = { x: number; y: number };

export type TScene = new (stage: Container) => IGameScene;
export interface IGameScene {
  update(delta: number): void;
}
