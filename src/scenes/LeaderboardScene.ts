import { GameObjects } from "phaser";
import { LevelInfoImpl } from "../databridge/LevelInfoImpl";
import { UserInfoImpl } from "../databridge/UserInfoImpl";
import { LogicController } from "../domain/LogicController";
import { Level, LevelType } from "../dto/LevelInfo";
import { UserData } from "../dto/UserData";
import { BaseLogPanelScene } from "./BaseLogPanelScene";

export class LeaderboardScene extends BaseLogPanelScene {

    // DB impl
    private userInfoApi: UserInfoImpl;

    // Data
    private currentPage: number;
    private sizePerPage: number = 10;

    // UI components
    private recordTxtArray: Phaser.GameObjects.Text[] = [];
    private nextBtn: GameObjects.Image;
    private preBtn: GameObjects.Image;
    private mainBtn: GameObjects.Image;

    constructor() {
        super('LeaderboardScene');

        this.userInfoApi = new UserInfoImpl();
    }

    override create(data?: any): void {
        super.create();
        this.showLog('create ' + JSON.stringify(data));

        this.add.rectangle(512, 384, 1024, 768, 0x000000);

        var backToMain = this.make.text({
            x: 100,
            y: 700,
            text: 'Back',
            style: { font: 'bold 20px Arial', color: '#00ff00' }
        });
        backToMain.setInteractive();
        backToMain.on('pointerdown', () => {
            this.scene.stop('LeaderboardScene');
        });

        this.scene.launch('LoadingScene');
        this.userInfoApi.getAllOrderByPoint()

        .then((users: UserData[]) => {
            this.updateRank(users);
            this.scene.stop('LoadingScene');
        })
        .catch(error => {
            this.showLog(error);
            this.scene.stop('LoadingScene');
        })
    }

    private updateRank(users: UserData[]): void {
        for(var index = 0; index < 10; index ++) {
            var recordTxt = this.make.text({
                x: 100,
                y: 100 + (index * 50),
                text: (index + 1) + '. -----',
                style: { font: 'bold 40px Arial', color: '#ffffff' }
            });
            recordTxt.setAlign('center');
            this.recordTxtArray[index] = recordTxt;
        }

        for (var index = 0; index < users.length; index ++) {
            var user = users[index];
            this.recordTxtArray[index].setText((index + 1) + '. ' + user.nickName);
            this.make.text({
                x: 300,
                y: 100 + (index * 50),
                text: user.totalPoints + '',
                style: { font: 'bold 40px Arial', color: '#ffffff' }
            });
        }
    }
}