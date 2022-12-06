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

        this.add.rectangle(512, 384, 1024, 768, 0x000000, 80);

        var backToMain = this.make.text({
            x: 10,
            y: 500,
            text: 'Back to Level',
            style: { font: 'bold 20px Arial', color: '#00ff00' }
        });
        backToMain.setInteractive();
        backToMain.on('pointerdown', () => {
            this.scene.stop('LeaderboardScene');
        });

        this.scene.launch('LoadingScene');
        this.levelInfoApi.getLevelTop10(LogicController.getInstance().getCurrentLevel().type)
        .then((levels: Level[]) => {
            this.showLog(JSON.stringify(levels));
            this.scene.stop('LoadingScene');
        })
        .catch(error => {
            this.showLog(error);
            this.scene.stop('LoadingScene');
        })
    }
}