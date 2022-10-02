import { TitleType, TitleTypePoint } from "../const/TitleType";
import { LogicController } from "../domain/LogicController";
import { LevelStatus } from "../dto/LevelInfo";
import { BaseLogPanelScene } from "./BaseLogPanelScene";

export class GratzScene extends BaseLogPanelScene {
    constructor() {
        super('GratzScene');
    }

    override create(data?: any): void {
        super.create();

        var userInfo = LogicController.getInstance().getUser();
        var curLevel = LogicController.getInstance().getCurrentLevel();


        var backToMain = this.make.text({
            x: 10,
            y: 500,
            text: 'Back to Main',
            style: { font: 'bold 20px Arial', color: '#00ff00' }
        });
        backToMain.setInteractive();
        backToMain.on('pointerdown', () => {
            this.scene.start('WelcomeScene');
        });

        
        curLevel.status = LevelStatus.FINISHED;
        userInfo.points += curLevel.points;
        
        var isLevelUp;
        do {
            isLevelUp = this.transformPointToTitile();
        } while (isLevelUp);


        // TODO: API to update UserData and LevelInfo
    }

    transformPointToTitile() : Boolean {
        var user = LogicController.getInstance().getUser();
        var amountOfTitleType = Object.keys(TitleType).length / 2;

        var nextTitle = user.title + 1;
        var remainPoint = user.points - TitleTypePoint[nextTitle];
        this.showLog("nextTitle: " + nextTitle + ", userPoint: " + user.points + ", remainPoint: " + remainPoint);

        if (remainPoint >= 0) {
            if (nextTitle <= amountOfTitleType - 1) {
                user.title = nextTitle;
            }
            user.points = remainPoint;
            this.showLog(JSON.stringify(user))
            return true;
        }
        return false;
    }
}