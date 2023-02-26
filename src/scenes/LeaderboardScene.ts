import { GameObjects } from "phaser";
import { TitleType, TitleTypeName } from "../const/TitleType";
import { UserInfoImpl } from "../databridge/UserInfoImpl";
import { LogicController } from "../domain/LogicController";
import { BannerConf } from "../dto/BannerConf";
import { UserData } from "../dto/UserData";
import eventsCenter from "../plugins/EventsCenter";
import { BaseLogPanelScene } from "./BaseLogPanelScene";

export class LeaderboardScene extends BaseLogPanelScene {
    private static PAGE_SIZE: number = 10;

    // DB impl
    private userInfoApi: UserInfoImpl;

    // Data
    private totalPage: number;
    private currentPage: number;
    private currentUserPageIndex: number;
    private totalUsers: number;
    private hitoUsers: HitoUserInformation[] = [];

    // UI components
    private rankTxtArray: Phaser.GameObjects.Text[] = [];
    private nameTxtArray: Phaser.GameObjects.Text[] = [];
    private pointTxtArray: Phaser.GameObjects.Text[] = [];
    private titleTxtArray: Phaser.GameObjects.Text[] = [];
    private nextBtn: GameObjects.Image;
    private preBtn: GameObjects.Image;
    private mainBtn: GameObjects.Image;
    private highLightBackground: GameObjects.Image;

    constructor() {
        super('LeaderboardScene');

        this.userInfoApi = new UserInfoImpl();
    }

    override preload(): void {
        super.preload();

        this.load.image('nextHoverBtnIcon', 'assets/icons/next_hover_64.png');
        this.load.image('homeIcon', 'assets/icons/home_64.png');
        this.load.image('HighLightIcon', 'assets/opt_btn.png');
    }

    override create(data?: any): void {
        super.create();
        this.showLog('[LeaderboardScene] create ' + JSON.stringify(data));

        this.showBanner(data.from);
        this.hitoUsers = [];

        this.add.rectangle(512, 384, 1024, 768, 0x000000);


        this.scene.launch('LoadingScene');
        this.userInfoApi.getAllOrderByPoint()
            .then((users: UserData[]) => {
                this.prepareHitoUserList(users);
                this.scene.stop('LoadingScene');

                this.preBtn.setInteractive();
                this.nextBtn.setInteractive();
                this.updateList(this.currentUserPageIndex + 1);
            })
            .catch(error => {
                this.showLog(error);
                this.scene.stop('LoadingScene');
            })


        this.prepareUI();
    }

    private prepareHitoUserList(users: UserData[]): void {
        var total = users.length;
        var currentUserIndex = 0;

        var tempRank = 0;
        var tempPoint = 0;
        var duplicatedUser = 1;
        users.forEach((value, index, array) => {
            
            if (value.totalPoints != tempPoint) {
                tempRank = tempRank + duplicatedUser;
                tempPoint = value.totalPoints;
                duplicatedUser = 1;
            } else {
                duplicatedUser ++;
            }
            var hitoUser = new HitoUserInformation();
            hitoUser.rank = tempRank;
            hitoUser.point = value.totalPoints;
            hitoUser.name = value.nickName;
            hitoUser.isCurrentUser = LogicController.getInstance().getUser().id === value.id;
            hitoUser.title = value.title;
            this.hitoUsers.push(hitoUser);

            if (hitoUser.isCurrentUser) {
                currentUserIndex = index;
            }
        })

        this.totalUsers = users.length;
        this.totalPage = Math.ceil(total / 10);
        this.currentUserPageIndex = Math.floor(currentUserIndex / 10);
        console.log('[LeaderboardScene] totalUsers: ' + this.totalUsers + ", totalPage: " + this.totalPage + ", currentUserPageIndex: " + this.currentUserPageIndex);

    }

    prepareUI(): void {
        this.highLightBackground = this.add.image(480, 115, 'HighLightIcon');
        this.highLightBackground.setScale(2.1, 1);

        var baseCoordX = 150;
        var baseCoordY = 100;
        var distanceInColumn = 50;
        var distanceInRow = 100;
        
        this.make.text({x: baseCoordX,                          y: baseCoordY, text: 'Rank', style: { font: 'bold 32px Arial', color: '#ffffff' }});
        this.make.text({x: baseCoordX + distanceInRow,          y: baseCoordY, text: 'Name', style: { font: 'bold 32px Arial', color: '#ffffff' }});
        this.make.text({x: baseCoordX + (distanceInRow * 4),    y: baseCoordY, text: 'Score', style: { font: 'bold 32px Arial', color: '#ffffff' }});
        this.make.text({x: baseCoordX + (distanceInRow * 6),    y: baseCoordY, text: 'Title', style: { font: 'bold 32px Arial', color: '#ffffff' }});
        
        for(var index = 0; index < 10; index ++) {
            this.rankTxtArray[index] = this.make.text({x: baseCoordX,                           y: baseCoordY + ((index + 1) * distanceInColumn), text: '', style: { font: 'bold 32px Arial', color: '#ffffff' }});
            this.nameTxtArray[index] = this.make.text({x: baseCoordX + distanceInRow,           y: baseCoordY + ((index + 1) * distanceInColumn), text: '', style: { font: 'bold 32px Arial', color: '#ffffff' }});
            this.pointTxtArray[index] = this.make.text({x: baseCoordX + (distanceInRow * 4),    y: baseCoordY + ((index + 1) * distanceInColumn), text: '', style: { font: 'bold 32px Arial', color: '#ffffff' }});
            this.titleTxtArray[index] = this.make.text({x: baseCoordX + (distanceInRow * 6),    y: baseCoordY + ((index + 1) * distanceInColumn), text: '', style: { font: 'bold 32px Arial', color: '#ffffff' }});
        }
        


        this.preBtn = this.add.image(100, 700, 'nextHoverBtnIcon');
        this.preBtn.setFlipX(true);
        this.preBtn.disableInteractive();
        this.preBtn.setDepth(3);
        this.preBtn.on('pointerdown', () => {
            this.updateList(this.currentPage - 1);
        })

        this.nextBtn = this.add.image(700, 700, 'nextHoverBtnIcon');
        this.nextBtn.disableInteractive();
        this.nextBtn.setDepth(3);
        this.nextBtn.on('pointerdown', () => {
            this.updateList(this.currentPage + 1);
        })

    }

    private updateList(page: number): void {
        this.currentPage = page;
        var startIndex = (this.currentPage - 1) * LeaderboardScene.PAGE_SIZE;
        var endIndex = Math.min(startIndex + (LeaderboardScene.PAGE_SIZE - 1), this.totalUsers - 1);
        // console.log('[LeaderboardScene] startIndex: ' + startIndex + ", endIndex: " + endIndex);  

        this.highLightBackground.setVisible(false);
        for (var index = 0; index < LeaderboardScene.PAGE_SIZE; index++) {
            var hitoUuserIndex = startIndex + index;
            var hitoUser = hitoUuserIndex > endIndex ? null : this.hitoUsers[hitoUuserIndex];
            
            this.rankTxtArray.at(index).setText(hitoUser != null ? hitoUser.rank.toString() : "");
            this.nameTxtArray.at(index).setText(hitoUser != null ? hitoUser.name : "");
            this.pointTxtArray.at(index).setText(hitoUser != null ? hitoUser.point.toString() : "");
            this.titleTxtArray.at(index).setText(hitoUser != null ? TitleTypeName.at(hitoUser.title) : "");

            if (hitoUser && hitoUser.isCurrentUser) {
                this.highLightBackground.setY(115 + ((index + 1) * 50));
                this.highLightBackground.setVisible(true);
            }
        }

        this.preBtn.setVisible(this.currentPage > 1);
        this.nextBtn.setVisible(this.currentPage < this.totalPage);
    }

    private showBanner(from: string): void {
        var conf = new BannerConf();
        conf.isInLeaderboard = true;
        conf.isExit = true;
        conf.curScene = from;
        eventsCenter.emit('onSettingUpdated', conf);
    }
}

class HitoUserInformation {
    public rank: number;
    public name: string;
    public point: number;
    public isCurrentUser: boolean;
    public title: TitleType;
}