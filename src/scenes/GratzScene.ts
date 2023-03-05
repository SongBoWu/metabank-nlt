import { GameObjects } from "phaser";
import { TitleType, TitleTypeName, TitleTypePoint } from "../const/TitleType";
import { LevelInfoImpl } from "../databridge/LevelInfoImpl";
import { UserInfoImpl } from "../databridge/UserInfoImpl";
import { LogicController } from "../domain/LogicController";
import { BannerConf } from "../dto/BannerConf";
import { LevelStatus } from "../dto/LevelInfo";
import { UserData, UserDataBuilder } from "../dto/UserData";
import eventsCenter from "../plugins/EventsCenter";

export class GratzScene extends Phaser.Scene {

    // DB impl
    private userInfoApi : UserInfoImpl;
    private levelInfoApi : LevelInfoImpl;
    
    // Data
    private fakeUser : UserData;

    // UI component
    private nextBtn: GameObjects.Image;

    constructor() {
        super('GratzScene');
        this.userInfoApi = new UserInfoImpl();
        this.levelInfoApi = new LevelInfoImpl();
        this.fakeUser = new UserDataBuilder()
            .points(1000)
            .title(TitleType.T1)
            .build();
    }

    preload(): void {
        this.load.image('badgeColor', 'assets/icons/badge_color_128.png');
        this.load.image('nextHoverBtnIcon', 'assets/icons/next_hover_64.png');
    }

    create(data?: any): void {
        this.showBanner();
        this.add.rectangle(512, 384, 1024, 768, 0x000000, 30);

        var userInfo = LogicController.getInstance().getUser();
        var curLevel = LogicController.getInstance().getCurrentLevel();
        var nextLevel = LogicController.getInstance().getNextLevel();


        this.nextBtn = this.add.image(100, 700, 'nextHoverBtnIcon');
        this.nextBtn.setInteractive();
        this.nextBtn.on('pointerdown', () => {
            this.scene.start('WelcomeScene');
        });
        
        curLevel.status = LevelStatus.FINISHED;
        if (nextLevel) {
            nextLevel.status = LevelStatus.STARTED;
        }

        userInfo.points += curLevel.points;
        userInfo.totalPoints += curLevel.points;
        console.log('[GratzScene][Before]', 'user.points: ' + userInfo.points + ", user.totalPoints: " + userInfo.totalPoints);
        
        var isLevelUp;
        var badgeIndex = 0;
        do {
            isLevelUp = this.transformPointToTitile();
            if (isLevelUp) {
                badgeIndex ++;
            }
        } while (isLevelUp);
        console.log('[GratzScene][After]', 'user.points: ' + userInfo.points + ", user.totalPoints: " + userInfo.totalPoints);

        var xCoordStart = (1024/2) - (100/2) * badgeIndex;
        for (var index = 0; index < badgeIndex; index ++) {
            var x_coordinate = xCoordStart + index * 100;
            this.add.image(x_coordinate, 400, 'badgeColor');
        }


        // Cong string
        this.make.text({
            x: 110,
            y: 200,
            text: 'Congratulation!! Your are premoted to ' + TitleTypeName.at(userInfo.title),
            style: { font: 'bold 40px Arial', color: '#ffffff' } 
        });

        // Update user info
        var updateType = nextLevel ? nextLevel.type : curLevel.type;
        this.userInfoApi.updateLevelPointTitle(userInfo.id, updateType, userInfo.points, userInfo.totalPoints, userInfo.title)
        .then(() => {
            console.log("[GratzScene] update user Info done!");
        })
        .catch((err: string) => {
            console.log("[GratzScene] update user Info error! " + err);
        });

        // update current level info
        this.levelInfoApi.update(curLevel)
        .then(() => {
            console.log("[GratzScene] update level Info done!");
        })
        .catch((err: string) => {
            console.log("[GratzScene] update level Info error! " + err);
        });

        // update next level info
        this.levelInfoApi.update(nextLevel)
        .then(() => {
            console.log("[GratzScene] update next level Info done!");
        })
        .catch((err: string) => {
            console.log("[GratzScene] update next level Info error! " + err);
        });

        // TODO: 
    }

    transformPointToTitile() : Boolean {
        var user = LogicController.getInstance().getUser();
        var amountOfTitleType = Object.keys(TitleType).length / 2;

        var nextTitle = user.title + 1;
        if (nextTitle >= amountOfTitleType) {
            console.log("already in top level!");
            return false;
        }

        var remainPoint = user.points - TitleTypePoint[nextTitle];
        console.log("nextTitle: " + nextTitle + ", userPoint: " + user.points + ", remainPoint: " + remainPoint);

        if (remainPoint >= 0) {
            user.title = nextTitle;
            user.points = remainPoint;
            console.log(JSON.stringify(user))
            return true;
        }
        return false;
    }

    private showBanner(): void {
        var conf = new BannerConf();
        conf.isName = false;
        conf.isPoint = false;
        conf.curScene = 'GratzScene';
        eventsCenter.emit('onSettingUpdated', conf);
    }
}