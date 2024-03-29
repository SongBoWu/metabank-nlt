import { Game, GameObjects } from "phaser";
import { TitleTypeName } from "../const/TitleType";
import { DatabaseCore } from "../databridge/DatabaseCore";
import { QuizImpl } from "../databridge/QuizImpl";
import { LogicController } from "../domain/LogicController";
import { BannerConf } from "../dto/BannerConf";
import { Level, LevelType } from "../dto/LevelInfo";
import { OptionID, QuizBuilder } from "../dto/Quiz";
import { UserData } from "../dto/UserData";
import eventsCenter from "../plugins/EventsCenter";

export class SettingsScene extends Phaser.Scene {

    private userDetail: UserData;
    private cachePoint: number = 0;

    private yCoord_icon: number = 16;
    private xCoord_icon: number[] = [30, 350, 940, 1000];
    private yCoord_txt: number = -3;
    private xCoord_txt: number[] = [0, 382, 0, 0];

    private bannerConfig: BannerConf;

    private userIcon: GameObjects.Image;
    private userName: GameObjects.Text;
    private dollarIcon: GameObjects.Image;
    private points: GameObjects.BitmapText;
    private badgeIcon: GameObjects.Image;
    private title: GameObjects.Text;
    private footprintIcon: GameObjects.Image;
    private footprintHoverIcon: GameObjects.Image;
    private hitoIcon: GameObjects.Image;
    private hitoHoverIcon: GameObjects.Image;
    private exitIcon: GameObjects.Image;
    private exitHoverIcon: GameObjects.Image;

    private quizImpl: QuizImpl;

    constructor() {
        super('SettingsScene');
        this.quizImpl = new QuizImpl();
    }

    preload(): void {
        this.load.bitmapFont('desyrel', 'assets/fonts/desyrel.png', 'assets/fonts/desyrel.xml');

        this.load.image('badge_icon', 'assets/badge.png');
        this.load.image('user_icon', 'assets/user.png');
        this.load.image('footprint_icon', 'assets/footprint.png');
        this.load.image('footprint_hover_icon', 'assets/footprint_hover.png');
        this.load.image('hito_icon', 'assets/leaderboard.png');
        this.load.image('hito_hover_icon', 'assets/leaderboard_hover.png');
        this.load.image('exit_icon', 'assets/logout.png');
        this.load.image('exit_hover_icon', 'assets/logout_hover.png');
        this.load.image('dollar_icon', 'assets/icons/scoreboard.png');
        
        //this.load.text('quizTable', 'assets/data/quiz_2.txt');
    }

    create(): void {
        console.log('[SettingsScene] onCreate');

        this.add.rectangle(512, 20, 1024, 40, 0xf5f5f3);

        // User icon/name
        this.userIcon = this.add.image(30, 16, 'user_icon');
        this.userName = this.make.text({
            x: 62,
            y: 0,
            text: '',
            style: { font: 'bold 32px Arial', color: '#000000' }
        });

        this.dollarIcon = this.add.image(350, 16, 'dollar_icon');
        this.dollarIcon.setVisible(false);
        this.points = this.add.bitmapText(382, -3, 'desyrel', '', 32);
        this.points.setVisible(false);

        // Badge info
        this.badgeIcon = this.add.image(650, 16, 'badge_icon');
        this.title = this.make.text({
            x: 680,
            y: 0,
            text: '',
            style: { font: 'bold 32px Arial', color: '#000000' }
        });

        // footprint 
        this.footprintIcon = this.add.image(880, 16, 'footprint_icon');
        this.footprintHoverIcon = this.add.image(880, 16, 'footprint_hover_icon');
        this.footprintHoverIcon.setVisible(false);
        this.footprintIcon.setInteractive();
        this.footprintIcon.on('pointerdown', () => {
            this.scene.pause(this.bannerConfig.curScene);
            this.scene.run('FootprintScene', {
                from: this.bannerConfig.curScene,
            })
        });
        this.footprintIcon.on('pointerover', () => { this.footprintHoverIcon.setVisible(true); });
        this.footprintIcon.on('pointerout', () => { this.footprintHoverIcon.setVisible(false); });


        // Hito bulletin
        this.hitoIcon = this.add.image(940, 16, 'hito_icon');
        this.hitoHoverIcon = this.add.image(940, 16, 'hito_hover_icon');
        this.hitoHoverIcon.setVisible(false);
        this.hitoIcon.setInteractive();
        this.hitoIcon.on('pointerdown', () => {
            this.scene.pause(this.bannerConfig.curScene);
            this.scene.run('LeaderboardScene', {
                from: this.bannerConfig.curScene,
            })
        });
        this.hitoIcon.on('pointerover', () => { this.hitoHoverIcon.setVisible(true); });
        this.hitoIcon.on('pointerout', () => { this.hitoHoverIcon.setVisible(false); });

        // Exit
        this.exitIcon = this.add.image(1000, 16, 'exit_icon');
        this.exitHoverIcon = this.add.image(1000, 16, 'exit_hover_icon');
        this.exitHoverIcon.setVisible(false);
        this.exitIcon.setInteractive();
        this.exitIcon.on('pointerdown', () => {
            if (this.bannerConfig && this.bannerConfig.isInLevel) {
                this.scene.stop('LevelScene');
                this.scene.resume('WelcomeScene');
            } else if (this.bannerConfig && this.bannerConfig.isInLeaderboard) {
                this.scene.stop('LeaderboardScene');
                this.scene.resume(this.bannerConfig.curScene);
            } else if (this.bannerConfig && this.bannerConfig.isInFootprint) {
                this.scene.stop('FootprintScene');
                this.scene.resume(this.bannerConfig.curScene);
            } else {
                this.scene.start('PreparationScene');
            }
        });
        this.exitIcon.on('pointerover', () => { this.exitHoverIcon.setVisible(true); });
        this.exitIcon.on('pointerout', () => { this.exitHoverIcon.setVisible(false); });


        eventsCenter.on('onSettingUpdated', this.updateIcon, this);
        // clean up when Scene is shutdown
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            eventsCenter.off('onSettingUpdated', this.updateIcon, this)
        });

    }

    update(time: number, delta: number): void {
        
        this.userDetail = LogicController.getInstance().getUser();
        if (this.userDetail) {
            this.userName.text = this.userDetail.nickName;
            this.title.text = TitleTypeName.at(this.userDetail.title);
        }

        var curLevel = LogicController.getInstance().getCurrentLevel();
        // console.log('randy level: ' + curLevel.type + ", point: " + curLevel.points);
        
        if (curLevel != null) {
            if (this.cachePoint < curLevel.points) {
                this.cachePoint += 10;
            } else if (this.cachePoint > curLevel.points) {
                this.cachePoint -= 10;
            } else {
                // Do nothing
            }
            this.points.text = this.cachePoint.toString();
        }
        
    }

    private updateIcon(conf: BannerConf): void {
        console.log('[SettingsScene] receive: ' + JSON.stringify(conf));
        this.bannerConfig = conf;

        // User icon
        this.userIcon.setVisible(conf.isName);
        this.userName.setVisible(conf.isName);

        // Point
        this.dollarIcon.setVisible(conf.isPoint)
        this.points.setVisible(conf.isPoint);

        // Badge
        this.badgeIcon.setVisible(conf.isBadge);
        this.title.setVisible(conf.isBadge);

        // Foorprint
        this.footprintIcon.setVisible(conf.hasFootprint);
        this.footprintIcon.setPosition((!conf.isExit && conf.hasFootprint) ? 940 : 880, 16)
        this.footprintHoverIcon.setPosition((!conf.isExit && conf.hasFootprint) ? 940 : 880, 16)

        // hito
        this.hitoIcon.setVisible(conf.isHitoBoard);
        this.hitoIcon.setPosition((!conf.isExit && conf.isHitoBoard) ? 1000 : 940, 16);
        this.hitoHoverIcon.setPosition((!conf.isExit && conf.isHitoBoard) ? 1000 : 940, 16);
 
        // exit
        this.exitIcon.setVisible(conf.isExit);

    }

    private buildDBContent(): void {
        var list = this.cache.text.get('quizTable');
        var quiz = list.split('\n');
        quiz.forEach((element: string) => {
            var detail = element.split('|');
            var quizInstance = new QuizBuilder()
                .id(detail[0])
                // .type(detail[1] as LevelType)
                .description(detail[2])
                .optionA(detail[3]).optionB(detail[4]).optionC(detail[5]).optionD(detail[6])
                .answer(detail[7] as OptionID)
                .isBonus(Boolean(JSON.parse(detail[8])))
                .build();
            console.log(JSON.stringify(quizInstance));
            this.quizImpl.add(quizInstance);
                
        });
        console.log(quiz[0]);
    }
}