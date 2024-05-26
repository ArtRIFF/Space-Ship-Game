type TScreenSize = {width: number, height: number};

class GameModel {
    private screenSize: TScreenSize  = {
        width: 0,
        height: 0,
    }

    setScreenSize(screenSize: TScreenSize) {
       this.screenSize = screenSize;
    }

    getScreenSize(): TScreenSize {
        return this.screenSize;
     }
}

export const gameModel = new GameModel(); 