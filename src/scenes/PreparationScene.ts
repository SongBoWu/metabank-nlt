import { Timestamp } from "firebase/firestore";
import { GameObjects } from "phaser";
import { GroupType } from "../const/GroupType";
import { DatabaseCore } from "../databridge/DatabaseCore";
import { LevelInfoImpl } from "../databridge/LevelInfoImpl";
import { UserInfoImpl } from "../databridge/UserInfoImpl";
import { LogicController } from "../domain/LogicController";
import { BannerConf } from "../dto/BannerConf";
import { Level, LevelStatus, LevelType } from "../dto/LevelInfo";
import { VKSType } from "../dto/VKSHistory";
import eventsCenter from "../plugins/EventsCenter";
import 'core-js/features/array/at';

export class PreparationScene extends Phaser.Scene {

    // DB impl
    private userInfoImpl: UserInfoImpl;
    private levelInfoImpl : LevelInfoImpl;

    // Data
    private findUnFinished: boolean;

    // UI components
    // private entranceExamTxt: Phaser.GameObjects.Text;
    // private preVKSTxt: Phaser.GameObjects.Text;
    // private postVKSTxt: Phaser.GameObjects.Text;

    private entranceIcon: GameObjects.Image;
    private vksIcon: GameObjects.Image;
    private externalLinkIcon: GameObjects.Image;
    private mainGameIcon: GameObjects.Image;
    private arrowIcons: GameObjects.Image[] = []; // 5
    private arrowDoneIcons: GameObjects.Image[] = []; // 5
    private arrowObjects: Arrow[] = [];
    
    constructor() {
        super('PreparationScene');
        this.userInfoImpl = new UserInfoImpl();
        this.levelInfoImpl = new LevelInfoImpl();
    }

    preload(): void {
        this.load.image('welcome_bg', 'assets/station_bg.png');
        this.load.image('entrance_icon', 'assets/icons/exam_done_256.png');
        this.load.image('vks_icon', 'assets/icons/surveyor_256.png');
        this.load.image('link_icon', 'assets/icons/extra_link_256.png');
        this.load.image('game_icon', 'assets/icons/game_256.png');
        this.load.image('arrow_icon', 'assets/icons/arrow_128.png');
        this.load.image('arrow_done_icon', 'assets/icons/arrow-done_128.png');
    }

    create(data?: any): void {

        this.add.image(512, 384, 'welcome_bg');
        this.scene.launch('SettingsScene');

        var user = DatabaseCore.getInstance().getAuthImpl().getUser();

        this.scene.launch('LoadingScene');
        this.userInfoImpl.get(user.uid)
            .then(userData => {
                console.log('[Preparation][getUser] ' + JSON.stringify(userData));
                LogicController.getInstance().setUser(userData);
                return this.levelInfoImpl.getLevels(user.uid);
            })
            .then((levels: Level[]) => {
                console.log('[Preparation][getLevels]');
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
        

        this.entranceIcon = this.add.image(250, 200, 'entrance_icon');
        this.entranceIcon.setScale(0.8, 0.8);
        this.entranceIcon.removeInteractive();
        this.entranceIcon.setAlpha(0.5);
        this.entranceIcon.on('pointerdown', () => {
            LogicController.getInstance().setCurrentLevel(LevelType.PREXAM);
            this.scene.start('EntranceExamScene');
        });

        this.externalLinkIcon = this.add.image(750, 200, 'link_icon');
        this.externalLinkIcon.setScale(0.8, 0.8);
        this.externalLinkIcon.removeInteractive();
        this.externalLinkIcon.setAlpha(0.5);
        this.externalLinkIcon.on('pointerdown', () => {
            console.log('[Preparation] external link clicked!');
            var userData = LogicController.getInstance().getUser();
            var url;
            if (!userData.isPreExternalLink) {
                url = 'https://docs.google.com/forms/d/1DYtb7_d93OcVZX1I_FJjwFmyvbC_twnMWVH-0wjyDuc/edit';
                userData.isPreExternalLink = true;
                this.userInfoImpl.updatePreExternalLink(userData.id);
            } else {
                url = userData.group == GroupType.EXPERIMENTAL 
                    ? 'https://docs.google.com/forms/d/1ugVnUqt87K_q49nWjWHV3hKxxiTLBbAY9x6BLD606gQ/edit?usp=forms_home'
                    : 'https://docs.google.com/forms/d/15T3o-r97biYT20oz81ehjWe6evjJ2_2IdlqiadUiDC4/edit?usp=forms_home';

                userData.isPostExternalLink = true;
                this.userInfoImpl.updatePostExternalLink(userData.id);
            }
            var s = window.open(url, '_blank');
            this.postDataFecth();

        })

        this.vksIcon = this.add.image(750, 600, 'vks_icon');
        this.vksIcon.setScale(0.8, 0.8);
        this.vksIcon.removeInteractive();
        this.vksIcon.setAlpha(0.5);
        this.vksIcon.on('pointerdown', () => {
            console.log('[Preparation] vks clicked! ');
            this.scene.start('VKSScene', {
                type: LogicController.getInstance().getUser().isPreVKSDone ? VKSType.POST : VKSType.PRE
            });
        })

        this.mainGameIcon = this.add.image(250, 600, 'game_icon');
        this.mainGameIcon.setScale(0.8, 0.8);
        this.mainGameIcon.removeInteractive();
        this.mainGameIcon.setAlpha(0.5);
        this.mainGameIcon.on('pointerdown', () => {
            this.scene.start('GuideScene');
        })


        this.createArrows();

    }

    private postDataFecth(): void {

        var userData = LogicController.getInstance().getUser();
        
        this.vksIcon.setInteractive();
        this.scene.stop('LoadingScene');

        // Start arrow
        // this.arrowIcons.at(0).setVisible(false);
        // this.arrowDoneIcons.at(0).setVisible(true);

        // Exam -> link
        if (userData.entranceScore != -1) {
            this.arrowDoneIcons.at(0).setVisible(true);

            this.entranceIcon.removeInteractive();
            this.entranceIcon.setAlpha(0.5);
            this.externalLinkIcon.setInteractive();
            this.externalLinkIcon.setAlpha(1);
        } else {
            this.entranceIcon.setInteractive();
            this.entranceIcon.setAlpha(1);
            this.externalLinkIcon.removeInteractive();
            this.externalLinkIcon.setAlpha(0.5);
        }

        // Link -> survey
        if (userData.entranceScore != -1) {
            if (userData.isPreExternalLink) {
                this.arrowDoneIcons.at(1).setVisible(true);
    
                this.externalLinkIcon.removeInteractive();
                this.externalLinkIcon.setAlpha(0.5);
                this.vksIcon.setInteractive();
                this.vksIcon.setAlpha(1);
            } else {
                this.externalLinkIcon.setInteractive();
                this.externalLinkIcon.setAlpha(1);
                this.vksIcon.removeInteractive();
                this.vksIcon.setAlpha(0.5);
            }
        }
        


        // survey -> game
        if (userData.entranceScore != -1 && userData.isPreExternalLink) {
            if (userData.isPreVKSDone) {
                this.arrowDoneIcons.at(2).setVisible(true);
    
                this.vksIcon.removeInteractive();
                this.vksIcon.setAlpha(0.5);
                this.mainGameIcon.setInteractive();
                this.mainGameIcon.setAlpha(1);
            } else {
                this.vksIcon.setInteractive();
                this.vksIcon.setAlpha(1);
                this.mainGameIcon.removeInteractive();
                this.mainGameIcon.setAlpha(0.5);
            }
        }
    

        // Game -> survey
        if (userData.entranceScore != -1 && userData.isPreExternalLink && userData.isPreVKSDone) {
            this.autoRedirectToMain();
            if (!this.findUnFinished) {
                this.arrowDoneIcons.at(3).setVisible(true);
    
                this.mainGameIcon.removeInteractive();
                this.mainGameIcon.setAlpha(0.5);
                this.vksIcon.setInteractive();
                this.vksIcon.setAlpha(1);
            } else {
                this.mainGameIcon.setInteractive();
                this.mainGameIcon.setAlpha(1);
            }
        }
        


        // survey -> link
        if (userData.entranceScore != -1 && userData.isPreExternalLink && userData.isPreVKSDone && !this.findUnFinished) {
            if (userData.isPostVKSDone) {
                this.arrowDoneIcons.at(4).setVisible(true);
    
                this.vksIcon.removeInteractive();
                this.vksIcon.setAlpha(0.5);
                this.externalLinkIcon.setInteractive();
                this.externalLinkIcon.setAlpha(1);
            } else {
                this.vksIcon.setInteractive();
                this.vksIcon.setAlpha(1);
                this.externalLinkIcon.removeInteractive();
                this.externalLinkIcon.setAlpha(0.5);
            }
        }

        if (userData.entranceScore != -1 && userData.isPreExternalLink && userData.isPreVKSDone && !this.findUnFinished
            && userData.isPostVKSDone) {
            if (userData.isPostExternalLink) {
                this.externalLinkIcon.removeInteractive();
                this.externalLinkIcon.setAlpha(0.5);
            }
        }
        
        
    }

    private autoRedirectToMain() {
        var user = LogicController.getInstance().getUser();
        var levels = LogicController.getInstance().getLevels();
        this.findUnFinished = false;
        if (levels.get(LevelType.PREXAM).status == LevelStatus.FINISHED && user.isPreVKSDone) {
            for (let level of levels.values()) {
                if (!this.findUnFinished && level.status != LevelStatus.FINISHED) {
                    // this.scene.start('WelcomeScene');
                    this.findUnFinished = true;
                }
            }
        }
    }

    private createArrows() {
        var arrowStart = new Arrow(100, 100);
        var arrowExamToLink = new Arrow(500, 200);
        arrowExamToLink.setRotation(0.5);

        var arrowLinkToSurvey = new Arrow(800, 400);
        arrowLinkToSurvey.setRotation(2);
        
        var arrowSurveyToLink = new Arrow(700, 400);
        arrowSurveyToLink.setRotation(-1);

        var arrowSurveyToGame = new Arrow(500, 650);
        arrowSurveyToGame.setRotation(4);
        var arrowGameToSurvey = new Arrow(500, 550);
        arrowGameToSurvey.setRotation(1);
        

        // this.arrowObjects.push(arrowStart);
        this.arrowObjects.push(arrowExamToLink);
        this.arrowObjects.push(arrowLinkToSurvey);
        this.arrowObjects.push(arrowSurveyToGame);
        this.arrowObjects.push(arrowGameToSurvey);
        this.arrowObjects.push(arrowSurveyToLink);


        for (var index = 0; index < this.arrowObjects.length; index++) {
            var arrowObj = this.arrowObjects.at(index);

            var arrowDoneIcon = this.add.image(arrowObj.getX(), arrowObj.getY(), 'arrow_done_icon');
            arrowDoneIcon.setFlip(arrowObj.getFlipX(), arrowObj.getFlipY());
            arrowDoneIcon.setScale(arrowObj.getScaleX(), arrowObj.getScaleY());
            arrowDoneIcon.setRotation(arrowObj.getRotation());
            arrowDoneIcon.setVisible(false);

            var arrowIcon = this.add.image(arrowObj.getX(), arrowObj.getY(), 'arrow_icon');
            arrowIcon.setFlip(arrowObj.getFlipX(), arrowObj.getFlipY());
            arrowIcon.setScale(arrowObj.getScaleX(), arrowObj.getScaleY());
            arrowIcon.setRotation(arrowObj.getRotation());

            this.arrowIcons[index] = arrowIcon;
            this.arrowDoneIcons[index] = arrowDoneIcon;
        }

        // this.arrowIcons.at(0).setVisible(false);
        // this.arrowDoneIcons.at(0).setVisible(false);
    }

    private showBanner(): void {
        var conf = new BannerConf();
        conf.isBadge = false;
        conf.isHitoBoard = false;
        conf.isExit = false;
        conf.curScene = 'PreparationScene';
        eventsCenter.emit('onSettingUpdated', conf);
    }
}

class Arrow {
    private coordX: number;
    private coordY: number;
    private scaleX: number = 1;
    private scaleY: number = 1;
    private flipX: boolean = false;
    private flipY: boolean = false;
    private rotation: number = 1;

    constructor(coordX: number, coordY: number) {
        this.coordX = coordX;
        this.coordY = coordY;
    }

    public getX(): number {
        return this.coordX;
    }

    public getY(): number {
        return this.coordY;
    }

    public setScale(x: number, y: number): void {
        this.scaleX = x;
        this.scaleY = y;
    }

    public getScaleX(): number {
        return this.scaleX;
    }

    public getScaleY(): number {
        return this.scaleY;
    }

    public setFlip(x: boolean, y: boolean): void {
        this.flipX = x;
        this.flipY = y;
    }

    public getFlipX(): boolean {
        return this.flipX;
    }

    public getFlipY(): boolean {
        return this.flipY;
    }

    public setRotation(radius: number): void {
        this.rotation = radius;
    }

    public getRotation(): number {
        return this.rotation;
    }
}