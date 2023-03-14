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
import { FootprintImpl } from "../databridge/FootprintImpl";
import { FootprintBuilder, FootprintType } from "../dto/FootprintBase";

export class FootprintScene extends BaseLogPanelScene {
    private static PAGE_SIZE: number = 10;

    // DB impl
    private historyImpl: HistoryImpl;
    private footprintImpl: FootprintImpl;

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
        this.footprintImpl = new FootprintImpl();
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
                this.prepareHistoryList(roundRecords);
                this.scene.stop('LoadingScene');

                this.preBtn.setInteractive();
                this.nextBtn.setInteractive();
                this.updateList(1);
            })
            .catch(error => {
                this.showLog(error);
                this.scene.stop('LoadingScene');
                this.updateList(1);
            });

        this.footprintImpl.add(new FootprintBuilder()
            .uid(this.user.id)
            .uname(this.user.nickName)
            .type(FootprintType.TRACE)
            .build());


        this.prepareUI();
    }

    private prepareHistoryList(roundSummaries: RoundSummary[]): void {
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
            history.bonus = value.bonusTimes;
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
            this.make.text({x: baseCoordX + (distanceInRow * 7),    y: baseCoordY, text: '額外增加次數', style: { font: 'bold 28px Arial', color: '#9df791' }});
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
        var hasBounsColumn = this.user.group == GroupType.EXPERIMENTAL;

        this.currentPage = page;
        var startIndex = (this.currentPage - 1) * FootprintScene.PAGE_SIZE;
        var endIndex = Math.min(startIndex + (FootprintScene.PAGE_SIZE - 1), this.totalRecords - 1);
        console.log('[FootprintScene] startIndex: ' + startIndex + ", endIndex: " + endIndex);  

        // this.highLightBackground.setVisible(false);
        for (var index = 0; index < FootprintScene.PAGE_SIZE; index++) {
            var historyIndex = startIndex + index;
            var history = historyIndex > endIndex ? null : this.historyList[historyIndex];
            
            this.rankTxtArray.at(index).setText(history != null ? history.rank.toString() : "");
            this.typeTxtArray.at(index).setText(history != null ? this.mappingLevel(history.type) : "");
            this.correctTxtArray.at(index).setText(history != null ? history.correctList.length.toString() : "");
            this.inCorrectTxtArray.at(index).setText(history != null ? history.wrongList.length.toString() : "");

            if (hasBounsColumn) {
                this.bounsTxtArray.at(index).setText((history && history.bonus) ? history.bonus.toString() : "");
            }
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
    public bonus: number;
}