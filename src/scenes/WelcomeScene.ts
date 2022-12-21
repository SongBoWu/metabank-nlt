import { Timestamp } from "firebase/firestore";
import { GameObjects } from "phaser";
import { DatabaseCore } from "../databridge/DatabaseCore";
import { LevelInfoImpl } from "../databridge/LevelInfoImpl";
import { UserInfoImpl } from "../databridge/UserInfoImpl";
import { LogicController } from "../domain/LogicController";
import { BannerConf } from "../dto/BannerConf";
import { Level, LevelBuilder, LevelStatus, LevelType } from "../dto/LevelInfo";
import eventsCenter from "../plugins/EventsCenter";
import { BaseLogPanelScene } from "./BaseLogPanelScene";

// 1. Refer to "Scenes\Tutorial\Scene Controller" for scene control
export class WelcomeScene extends BaseLogPanelScene {
    // private firestoreUserinfo: UserInfoImpl;
    // private levelInfo : LevelInfoImpl;
    private levelMap : Map<LevelType, Level>;

    private levelTypes: LevelType[] = [LevelType.DEPOSIT, LevelType.FOREX, LevelType.LOAN];
    private levelIcons: GameObjects.Image[] = [];
    private questionIcons: GameObjects.Image[] = [];
    
    constructor() {
        super('WelcomeScene');
        // this.firestoreUserinfo = new UserInfoImpl();
        // this.levelInfo = new LevelInfoImpl();
    }

    override preload(): void {
        super.preload();
        this.load.image('welcome_bg', 'assets/station_bg.png');
        this.load.image('monkey', 'assets/monkey_1.png');
        this.load.image('level_icon1', 'assets/piggy-bank.png');
        this.load.image('level_icon2', 'assets/exchange.png');
        this.load.image('level_icon3', 'assets/calculator.png');
        this.load.image('question_icon', 'assets/faq.png')

        this.load.bitmapFont('desyrel', 'assets/fonts/desyrel.png', 'assets/fonts/desyrel.xml');
    }

    override create(): void {
        super.create();
        this.showBanner();

        this.add.image(512, 384, 'welcome_bg');
        this.add.image(512, 650, 'monkey');

        var user = DatabaseCore.getInstance().getAuthImpl().getUser();
        this.levelMap = LogicController.getInstance().getLevels();
        for(var index = 0; index < this.levelTypes.length; index++) {
            var x_coord = 200 + (index * 300);
            var y_coord = index % 2 == 0 ? 300 : 250;
            this.levelIcons[index] = this.add.image(x_coord, y_coord, 'level_icon' + (index + 1));
            this.questionIcons[index] = this.add.image(x_coord, y_coord, 'question_icon');
            this.add.bitmapText(x_coord - 50, y_coord + 130, 'desyrel', 'LEVEL' + (index + 1), 32);

            var type = this.levelTypes[index];
            var level = this.levelMap.get(type);
            var icon = this.levelIcons[index];
            var questionIcon = this.questionIcons[index];

            switch(level.status) {
                case LevelStatus.LOCKED:
                    icon.setVisible(false);
                    icon.disableInteractive();
                    questionIcon.setVisible(true);
                    break;
                case LevelStatus.STARTED:
                    icon.setVisible(true);
                    icon.setInteractive();
                    icon.on('pointerdown', this.runLevelScene.bind(this, type));
                    questionIcon.setVisible(false);
                    break;
                case LevelStatus.FINISHED:
                    icon.setVisible(true);
                    icon.setAlpha(0.5);
                    icon.disableInteractive();
                    questionIcon.setVisible(false);
                    break;
            }
        }


        this.events.addListener('resume', this.resume.bind(this));

        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            console.log('[WelcomeScene][SHUTDOWN]');
            this.events.removeListener('resume');
        });

        // var goGratzBtn = this.make.text({
        //     x: 120,
        //     y: 700,
        //     text: 'goGratzScene',
        //     style: { font: 'bold 20px Arial', color: '#00ff00' }
        // });
        // goGratzBtn.on('pointerdown', () => {
        //     this.scene.run('GratzScene');
        // });
        // goGratzBtn.setInteractive();

    }

    private runLevelScene(type: LevelType): void {
        LogicController.getInstance().setCurrentLevel(type);
        this.scene.pause();
        this.scene.run('LevelScene',
        {
            from: 'WelcomeScene',
            levelType: type,
        });
    }

    resume(): void {
        console.log('[WelcomeScene][resume]');
        this.showBanner();
    } 

    protected override onNetworkOnline(event: Event): void {
        // TODO
    }

    protected override onNetworkOffline(event: Event): void {
        // TODO
    }

    private showBanner(): void {
        var conf = new BannerConf();
        conf.isBadge = true;
        conf.isHitoBoard = true;
        conf.isExit = true;
        eventsCenter.emit('onSettingUpdated', conf);
    }
}