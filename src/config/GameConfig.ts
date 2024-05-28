export class GameConfig {
  static readonly rocketParam = {
    USER_ROCKET_COLOR: "0XFEFFFF",
    ENEMY_ROCKET_COLOR: "0XFF0000",
    ROCKET_SIZE: 10,
    ROCKETS_LIMIT: 10,
  };

  static readonly asteroidParam = {
    ASTEROIDS_LIMIT: 5,
  };

  static readonly labelFontStyle: any = {
    fill: "b5b738",
    fontSize: 35,
    fontWeight: "bold",
    fontVariant: "small-caps",
    stroke: "#df0707",
  };

  static readonly timerParam = {
    GAME_TIME: 60,
  };

  static readonly popupParam = {
    BACKGROUND_COLOR: "#2458c2",
    BUTTON_COLOR: "#8db83d",
  };
}
