import { LevelInfoImpl } from "../databridge/LevelInfoImpl";
import { LogicController } from "../domain/LogicController";
import { Level, LevelType } from "../dto/LevelInfo";
import { BaseLogPanelScene } from "./BaseLogPanelScene";

export class LeaderboardScene extends BaseLogPanelScene {
    private levelInfoApi: LevelInfoImpl;

    constructor() {
        super('LeaderboardScene');
        this.levelInfoApi = new LevelInfoImpl();
    }

    override create(data?: any): void {
        super.create();
        this.showLog('create ' + JSON.stringify(data));

        var backToMain = this.make.text({
            x: 10,
            y: 500,
            text: 'Back to Level',
            style: { font: 'bold 20px Arial', color: '#00ff00' }
        });
        backToMain.setInteractive();
        backToMain.on('pointerdown', () => {
            this.scene.start(data.from, {
                from: 'LeaderboardScene',
            });
        });

        this.levelInfoApi.getLevelTop10(LogicController.getInstance().getCurrentLevel().type)
        .then((levels: Level[]) => {
            this.showLog(JSON.stringify(levels));
        })
        .catch(error => {
            this.showLog(error);
        })
    }
}