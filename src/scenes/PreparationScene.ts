import { DatabaseCore } from "../databridge/DatabaseCore";
import { LevelInfoImpl } from "../databridge/LevelInfoImpl";
import { UserInfoImpl } from "../databridge/UserInfoImpl";
import { LogicController } from "../domain/LogicController";
import { BannerConf } from "../dto/BannerConf";
import { Level, LevelStatus, LevelType } from "../dto/LevelInfo";
import eventsCenter from "../plugins/EventsCenter";
import { BaseLogPanelScene } from "./BaseLogPanelScene";

export class PreparationScene extends BaseLogPanelScene {
    private firestoreUserinfo: UserInfoImpl;
    private levelInfoImpl : LevelInfoImpl;

    private entranceExamTxt: Phaser.GameObjects.Text;
    private preVKSTxt: Phaser.GameObjects.Text;
    private postVKSTxt: Phaser.GameObjects.Text;
    
    constructor() {
        super('PreparationScene');
        this.firestoreUserinfo = new UserInfoImpl();
        this.levelInfoImpl = new LevelInfoImpl();
    }

    override preload(): void {
        super.preload();
        this.load.image('welcome_bg', 'assets/station_bg.png');
    }

    override create(data?: any): void {
        super.create();

        this.scene.launch('SettingsScene');

        var user = DatabaseCore.getInstance().getAuthImpl().getUser();

        this.scene.launch('LoadingScene');
        this.firestoreUserinfo.get(user.uid)
            .then(userData => {
                console.log(JSON.stringify(userData));
                LogicController.getInstance().setUser(userData);
                return this.levelInfoImpl.getLevels(user.uid);
            })
            .then((levels: Level[]) => {
                LogicController.getInstance().setLevels(levels);
                let curLevel = LogicController.getInstance().getCurrentLevel();
                if (curLevel) {
                    this.showLog('Let\'s continue to Level: ' + curLevel.type);
                }
                
                this.showBanner();
                this.postDataFecth();

            })
            .catch((err: string) => {
                // TODO
                this.showLog(err);

                this.showBanner();
                this.postDataFecth();
            });
        
        this.entranceExamTxt = this.make.text({
            x: 150,
            y: 150,
            text: '1. Entrance exam',
            style: { font: 'bold 20px Arial', color: '#00ff00' }
        });
        this.entranceExamTxt.removeInteractive();
        this.entranceExamTxt.on('pointerdown', () => {
            LogicController.getInstance().setCurrentLevel(LevelType.PREXAM);
            this.scene.start('EntranceExamScene');
        });


        this.preVKSTxt = this.make.text({
            x: 150,
            y: 300,
            text: '2. Pre-VKS exam',
            style: { font: 'bold 20px Arial', color: '#00ff00' }
        });
        this.preVKSTxt.setVisible(false);
        this.preVKSTxt.removeInteractive();
        this.preVKSTxt.on('pointerdown', () => {
            
        });


        this.postVKSTxt = this.make.text({
            x: 150,
            y: 450,
            text: '3. Post-VKS exam',
            style: { font: 'bold 20px Arial', color: '#00ff00' }
        });
        this.postVKSTxt.setVisible(false);
        this.postVKSTxt.removeInteractive();
        this.postVKSTxt.on('pointerdown', () => {
            
        });
    }

    private postDataFecth(): void {
        if (LogicController.getInstance().getUser().entranceScore >= 0) {
            this.scene.start('WelcomeScene');
        }

        // if (LogicController.getInstance().getUser().entranceScore < 0) {
            this.entranceExamTxt.setInteractive();
        // }
        
        this.preVKSTxt.setInteractive();
        this.postVKSTxt.setInteractive();
        this.scene.stop('LoadingScene');
    }

    private showBanner(): void {
        var conf = new BannerConf();
        conf.isBadge = true;
        conf.isExit = true;
        eventsCenter.emit('onSettingUpdated', conf);
    }
}