import { DatabaseCore } from "../databridge/DatabaseCore";
import { LevelInfoImpl } from "../databridge/LevelInfoImpl";
import { UserInfoImpl } from "../databridge/UserInfoImpl";
import { LogicController } from "../domain/LogicController";
import { BannerConf } from "../dto/BannerConf";
import { Level, LevelStatus, LevelType } from "../dto/LevelInfo";
import { VKSType } from "../dto/VKSHistory";
import eventsCenter from "../plugins/EventsCenter";

export class PreparationScene extends Phaser.Scene {

    // DB impl
    private firestoreUserinfo: UserInfoImpl;
    private levelInfoImpl : LevelInfoImpl;

    // UI components
    private entranceExamTxt: Phaser.GameObjects.Text;
    private preVKSTxt: Phaser.GameObjects.Text;
    private postVKSTxt: Phaser.GameObjects.Text;
    
    constructor() {
        super('PreparationScene');
        this.firestoreUserinfo = new UserInfoImpl();
        this.levelInfoImpl = new LevelInfoImpl();
    }

    preload(): void {
        this.load.image('welcome_bg', 'assets/station_bg.png');
    }

    create(data?: any): void {

        this.add.image(512, 384, 'welcome_bg');
        // this.scene.launch('SettingsScene');

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
                    console.log('Let\'s continue to Level: ' + curLevel.type);
                }
                
                this.showBanner();
                this.postDataFecth();

            })
            .catch((err: string) => {
                // TODO
                console.log(err);

                this.showBanner();
                this.postDataFecth();
            });
        
        this.entranceExamTxt = this.make.text({
            x: 150,
            y: 150,
            text: '1. 先備知識測驗 (本測驗為四選一之選擇題, 共15題, 每題6分, 總分90分)',
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
        this.preVKSTxt.setVisible(true);
        this.preVKSTxt.removeInteractive();
        this.preVKSTxt.on('pointerdown', () => {
            this.scene.start('VKSScene', {
                type: VKSType.PRE
            });
        });


        this.postVKSTxt = this.make.text({
            x: 150,
            y: 450,
            text: '3. Post-VKS exam',
            style: { font: 'bold 20px Arial', color: '#00ff00' }
        });
        this.postVKSTxt.setVisible(true);
        this.postVKSTxt.removeInteractive();
        this.postVKSTxt.on('pointerdown', () => {
            this.scene.start('VKSScene', {
                type: VKSType.POST
            });
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