import { BaseLogPanelScene } from "./BaseLogPanelScene";
import { GameObjects } from "phaser";
import { LogicController } from "../domain/LogicController";
import { BannerConf } from "../dto/BannerConf";
import { UserData } from "../dto/UserData";
import eventsCenter from "../plugins/EventsCenter";
import { HistoryImpl } from "../databridge/HistoryImpl";
import { RoundSlice, RoundSummary } from "../dto/RoundSummary";
import { LevelType } from "../dto/LevelInfo";
import { GroupType } from "../const/GroupType";

export class FootprintScene extends BaseLogPanelScene {
    private static PAGE_SIZE: number = 10;

    // DB impl
    private historyImpl: HistoryImpl;

    // Data
    private user: UserData;
    private totalPage: number;
    private currentPage: number;
    private totalRecords: number;
    private historyList: HistoryInformation[] = [];

    // UI components
    private rankTxtArray: Phaser.GameObjects.Text[] = [];
    private typeTxtArray: Phaser.GameObjects.Text[] = [];
    private correctTxtArray: Phaser.GameObjects.Text[] = [];
    private inCorrectTxtArray: Phaser.GameObjects.Text[] = [];
    private bounsTxtArray: Phaser.GameObjects.Text[] = [];
    private nextBtn: GameObjects.Image;
    private preBtn: GameObjects.Image;
    // private highLightBackground: GameObjects.Image;

    constructor() {
        super('FootprintScene');

        this.historyImpl = new HistoryImpl();
    }

    override preload(): void {
        super.preload();

        this.load.image('nextHoverBtnIcon', 'assets/icons/next_hover_64.png');
        this.load.image('homeIcon', 'assets/icons/home_64.png');
        this.load.image('HighLightIcon', 'assets/opt_btn.png');
    }

    override create(data?: any): void {
        super.create();
        this.showLog('[FootprintScene] create ' + JSON.stringify(data));

        this.showBanner(data.from);
        this.historyList = [];

        this.add.rectangle(512, 384, 1024, 768, 0x000000);


        this.scene.launch('LoadingScene');
        this.user = LogicController.getInstance().getUser();
        this.historyImpl.getRoundHistory(this.user.id)
            .then((roundRecords: RoundSummary[]) => {
                this.prepareHitoUserList(roundRecords);
                this.scene.stop('LoadingScene');

                this.preBtn.setInteractive();
                this.nextBtn.setInteractive();
                this.updateList(1);
            })
            .catch(error => {
                this.showLog(error);
                this.scene.stop('LoadingScene');
            })


        this.prepareUI();
    }

    private prepareHitoUserList(roundSummaries: RoundSummary[]): void {
        var total = roundSummaries.length;
        // var currentUserIndex = 0;

        var tempRank = 0;
        // var tempPoint = 0;
        // var duplicatedUser = 1;
        roundSummaries.forEach((value, index, array) => {
            var history = new HistoryInformation();
            history.rank = index ++;
            history.type = value.level;
            history.correctList = value.quizzes.filter( quiz => quiz.isCorrect );
            history.wrongList = value.quizzes.filter( quiz => !quiz.isCorrect );
            this.historyList.push(history);
        })

        this.totalRecords = roundSummaries.length;
        this.totalPage = Math.ceil(total / 10);
        console.log('[FootprintScene] totalRecords: ' + this.totalRecords + ", totalPage: " + this.totalPage);

    }

    prepareUI(): void {
        var hasBounsColumn = this.user.group == GroupType.EXPERIMENTAL;

        // this.highLightBackground = this.add.image(480, 115, 'HighLightIcon');
        // this.highLightBackground.setScale(2.1, 1);

        var baseCoordX = 100;
        var baseCoordY = 100;
        var distanceInColumn = 50;
        var distanceInRow = 100;
        
        this.make.text({x: baseCoordX,                          y: baseCoordY, text: '#', style: { font: 'bold 28px Arial', color: '#9df791' }});
        this.make.text({x: baseCoordX + distanceInRow,          y: baseCoordY, text: '關卡', style: { font: 'bold 28px Arial', color: '#9df791' }});
        this.make.text({x: baseCoordX + (distanceInRow * 3),    y: baseCoordY, text: '答對題數', style: { font: 'bold 28px Arial', color: '#9df791' }});
        this.make.text({x: baseCoordX + (distanceInRow * 5),    y: baseCoordY, text: '答錯題數', style: { font: 'bold 28px Arial', color: '#9df791' }});
        if(hasBounsColumn) {
            this.make.text({x: baseCoordX + (distanceInRow * 7),    y: baseCoordY, text: '額外增加', style: { font: 'bold 28px Arial', color: '#9df791' }});
        }
        
        
        for(var index = 0; index < 10; index ++) {
            this.rankTxtArray[index] = this.make.text({x: baseCoordX,                           y: baseCoordY + ((index + 1) * distanceInColumn), text: '', style: { font: 'bold 24px Arial', color: '#ffffff' }});
            this.typeTxtArray[index] = this.make.text({x: baseCoordX + distanceInRow,           y: baseCoordY + ((index + 1) * distanceInColumn), text: '', style: { font: 'bold 24px Arial', color: '#ffffff' }});
            this.correctTxtArray[index] = this.make.text({x: baseCoordX + (distanceInRow * 3),    y: baseCoordY + ((index + 1) * distanceInColumn), text: '', style: { font: 'bold 24px Arial', color: '#ffffff' }});
            this.inCorrectTxtArray[index] = this.make.text({x: baseCoordX + (distanceInRow * 5),    y: baseCoordY + ((index + 1) * distanceInColumn), text: '', style: { font: 'bold 24px Arial', color: '#ffffff' }});
            if (hasBounsColumn) {
                this.bounsTxtArray[index] = this.make.text({x: baseCoordX + (distanceInRow * 7),    y: baseCoordY + ((index + 1) * distanceInColumn), text: '', style: { font: 'bold 24px Arial', color: '#ffffff' }});
            }
        }
        

        this.preBtn = this.add.image(400, 700, 'nextHoverBtnIcon');
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
        var startIndex = (this.currentPage - 1) * FootprintScene.PAGE_SIZE;
        var endIndex = Math.min(startIndex + (FootprintScene.PAGE_SIZE - 1), this.totalRecords - 1);
        console.log('[FootprintScene] startIndex: ' + startIndex + ", endIndex: " + endIndex);  

        // this.highLightBackground.setVisible(false);
        for (var index = 0; index < FootprintScene.PAGE_SIZE; index++) {
            var hitoUuserIndex = startIndex + index;
            var hitoUser = hitoUuserIndex > endIndex ? null : this.historyList[hitoUuserIndex];
            
            this.rankTxtArray.at(index).setText(hitoUser != null ? hitoUser.rank.toString() : "");
            this.typeTxtArray.at(index).setText(hitoUser != null ? this.mappingLevel(hitoUser.type) : "");
            this.correctTxtArray.at(index).setText(hitoUser != null ? hitoUser.correctList.length.toString() : "");
            this.inCorrectTxtArray.at(index).setText(hitoUser != null ? hitoUser.wrongList.length.toString() : "");

            // if (hitoUser && hitoUser.isCurrentUser) {
            //     this.highLightBackground.setY(115 + ((index + 1) * 50));
            //     this.highLightBackground.setVisible(true);
            // }
        }

        this.preBtn.setVisible(this.currentPage > 1);
        this.nextBtn.setVisible(this.currentPage < this.totalPage);
    }

    private showBanner(from: string): void {
        var conf = new BannerConf();
        conf.isExit = true;
        conf.isInFootprint = true;
        conf.curScene = from;
        eventsCenter.emit('onSettingUpdated', conf);
    }

    private mappingLevel(type: LevelType): string {
        switch(type) {
            case LevelType.DEPOSIT:
                return "Level 1";
            case LevelType.FOREX:
                return "Level 2";
            case LevelType.LOAN:
                return "Level 3";
        }
    }
}

class HistoryInformation {
    public rank: number;
    public type: LevelType;
    public correctList: RoundSlice[] = [];
    public wrongList: RoundSlice[] = [];
    public bouns: number;
}