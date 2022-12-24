import { GameObjects } from "phaser";
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

    private banner_item_status: BannerConf;

    private userIcon: GameObjects.Image;
    private userName: GameObjects.Text;
    private dollarIcon: GameObjects.Image;
    private points: GameObjects.BitmapText;
    private badgeIcon: GameObjects.Image;
    private title: GameObjects.BitmapText;
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
        this.load.image('hito_icon', 'assets/leaderboard.png');
        this.load.image('hito_icon_hover', 'assets/leaderboard_hover.png');
        this.load.image('exit_icon', 'assets/logout.png');
        this.load.image('exit_icon_hover', 'assets/logout_hover.png');
        this.load.image('dollar_icon', 'assets/dollar.png');
        
        this.load.text('quizTable', 'assets/data/quiz_2.txt');
    }

    create(): void {
        

        this.add.rectangle(512, 20, 1024, 40, 0xffffff);

        // User icon/name
        this.userIcon = this.add.image(30, 16, 'user_icon');
        this.userName = this.make.text({
            x: 62,
            y: 0,
            text: '',
            style: { font: 'bold 32px Arial', color: '#f2c81f' }
        });

        this.dollarIcon = this.add.image(350, 16, 'dollar_icon');
        this.dollarIcon.setVisible(false);
        this.points = this.add.bitmapText(382, -3, 'desyrel', '', 32);
        this.points.setVisible(false);

        // Badge info
        this.badgeIcon = this.add.image(650, 16, 'badge_icon');
        this.title = this.add.bitmapText(682, -3, 'desyrel', '', 32);

        // Hito bulletin
        this.hitoIcon = this.add.image(940, 16, 'hito_icon');
        this.hitoHoverIcon = this.add.image(940, 16, 'hito_icon_hover');
        this.hitoHoverIcon.setVisible(false);
        this.hitoIcon.setInteractive();
        this.hitoIcon.on('pointerdown', () => {
            this.scene.run('LeaderboardScene', {
                from: 'LevelScene',
            })
        });
        this.hitoIcon.on('pointerover', () => { this.hitoHoverIcon.setVisible(true); });
        this.hitoIcon.on('pointerout', () => { this.hitoHoverIcon.setVisible(false); });

        // Exit
        this.exitIcon = this.add.image(1000, 16, 'exit_icon');
        this.exitHoverIcon = this.add.image(1000, 16, 'exit_icon_hover');
        this.exitHoverIcon.setVisible(false);
        this.exitIcon.setInteractive();
        this.exitIcon.on('pointerdown', () => {
            if (this.banner_item_status.isInLevel) {
                this.scene.stop('LevelScene');
                this.scene.resume('WelcomeScene');
            } else {
                DatabaseCore.getInstance().getAuthImpl().signOut();
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
        // console.log('[Banner] receive: ' + JSON.stringify(conf));
        this.banner_item_status = conf;

        // User icon
        this.userIcon.setVisible(conf.isName);
        this.userName.setVisible(conf.isName);

        // Point
        this.dollarIcon.setVisible(conf.isPoint)
        this.points.setVisible(conf.isPoint);

        // Badge
        this.badgeIcon.setVisible(conf.isBadge);
        this.title.setVisible(conf.isBadge);

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