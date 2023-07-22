import { GroupType } from "../const/GroupType";
import { TitleTypeName } from "../const/TitleType";
import { FootprintImpl } from "../databridge/FootprintImpl";
import { HistoryImpl } from "../databridge/HistoryImpl";
import { LevelInfoImpl } from "../databridge/LevelInfoImpl";
import { UserInfoImpl } from "../databridge/UserInfoImpl";
import { FootprintBase } from "../dto/FootprintBase";
import { Level } from "../dto/LevelInfo";
import { PracHistory } from "../dto/PracHistory";
import { RoundSummary } from "../dto/RoundSummary";
import { UserData } from "../dto/UserData";
import { VKSHistory } from "../dto/VKSHistory";


export class AnalysisScene extends Phaser.Scene {

    private static PAGE_SIZE: number = 10;

    // DB impl
    private userInfoApi: UserInfoImpl;
    private footprintApi: FootprintImpl;
    private historyApi: HistoryImpl;
    private levelInfoApi: LevelInfoImpl;

    constructor() {
        super({
            key: 'AnalysisScene'
        })

        this.userInfoApi = new UserInfoImpl();
        this.footprintApi = new FootprintImpl();
        this.historyApi = new HistoryImpl();
        this.levelInfoApi = new LevelInfoImpl();
    }

    preload(): void {
        this.load.image('bg', 'assets/background-geo-grey.jpg');
    }

    create(data?: any): void {
        console.log('[AnalysisScene] Create');
        this.add.image(512, 384, 'bg');

        /*
        this.userInfoApi.getAllOrderByPoint(GroupType.EXPERIMENTAL)
            .then((users: UserData[]) => {
                this.countUser(users, GroupType.EXPERIMENTAL);
            })
            .catch(error => {
                console.log('[AnalysisScene] error ' + error);
            });

        this.userInfoApi.getAllOrderByPoint(GroupType.CONTROL)
            .then((users: UserData[]) => {
                this.countUser(users, GroupType.CONTROL);
            })
            .catch(error => {
                console.log('[AnalysisScene] error ' + error);
            });
            */

        /*
        this.historyApi.getAllVKSHistory()
            .then((vksData: VKSHistory[]) => {
                this.countVKS(vksData);
            })
            .catch(error => {
                console.log('[AnalysisScene][getAllVKSHistory] error ' + error);
            });
            */

            /*
        this.historyApi.getAllPractice()
            .then((pracData: PracHistory[]) => {
                this.storePractice(pracData);
            })
            .catch(error => {
                console.log('[AnalysisScene][getAllPractice] error ' + error);
            });
            */

            /*
        this.historyApi.getAllRound()
            .then((roundData: RoundSummary[]) => {
                this.storeRound(roundData);
            })
            .catch(error => {
                console.log('[AnalysisScene][getAllRound] error ' + error);
            });
            */

            /*
        this.levelInfoApi.getAll()
            .then((levelData: Level[]) => {
                this.storeLevel(levelData);
            })
            .catch(error => {
                console.log('[AnalysisScene][getAllLevel] error ' + error);
            })
            */

            // /*
        this.footprintApi.getAll()
            .then((data: FootprintBase[]) => {
                this.storeFootprint(data);
            })
            .catch(error => {
                console.log('[AnalysisScene][getAllFootprint] error ' + error);
            })
            // */

    }

    private countUser(users: UserData[], group: GroupType): void {
        var groupName = group == GroupType.EXPERIMENTAL ? 'Experimental' : 'Control';
        var total = users.length;
        var lessThanFifty = users.filter((value, index, array) => {
            return value.entranceScore <= 44;
        });
        var greatThanFifty = users.filter((value, index, array) => {
            return value.entranceScore > 44;
        });
        console.log('[AnalysisScene]['+ groupName +'] totalUsers: ' + total + ", lessThanFifty: " + lessThanFifty.length + ", greatThanFifty: " + greatThanFifty.length);

        // /* Log for dumping user info
        console.log(
            'uid' + ',' + 'nickName' + ',' + 'entranceScore' + ',' + 'group' + ',' + 'level' + ',' + 'title' + ',' + 'totalPoints' + ','
            + 'isPreExternalLink' + ',' + 'isPreVKSDone' + ',' + 'isPostVKSDone' + ',' + 'isPostExternalLink');
        users.forEach(user => {
            console.log(
                user.id + ',' + user.nickName + ',' + user.entranceScore + ',' + user.group + ',' + user.level + ',' + TitleTypeName.at(user.title) + ',' + user.totalPoints + ','
                + user.isPreExternalLink + ',' + user.isPreVKSDone + ',' + user.isPostVKSDone + ',' + user.isPostExternalLink);
        }); 
        // */


        var validUser = users.filter((value, index, array) => {
            return value.isPreExternalLink && value.isPreVKSDone && value.isPostVKSDone && value.isPostExternalLink
        })
        console.log('[AnalysisScene]['+ groupName +'] validUser: ' + validUser.length /*JSON.stringify(validUser)*/);

        var missPostVKSandLink = users.filter((value, index, array) => {
            return value.isPreExternalLink && value.isPreVKSDone && !value.isPostVKSDone && !value.isPostExternalLink;
        })
        console.log('[AnalysisScene]['+ groupName +'] missPostVKSandLink: ' + missPostVKSandLink.length /*JSON.stringify(missPostVKS)*/);

    }

    private countVKS(data: VKSHistory[]) {
        console.log('[Analysys] vks.length: ' + data.length);
        
        console.log('uid' + ',' + 'name' + ',' + 'type' + ',' 
            + 'qid_0001' + ',' + 'qid_0002' + ','
            + 'qid_0003' + ',' + 'qid_0004' + ','
            + 'qid_0005' + ',' + 'qid_0006' + ','
            + 'qid_0007' + ',' + 'qid_0008' + ','
            + 'qid_0009' + ',' + 'qid_0010' + ','
            + 'qid_0011' + ',' + 'qid_0012' + ','
            + 'qid_0013' + ',' + 'qid_0014' + ','
            + 'qid_0015');
        data.forEach((value, index, array) => {
            console.log(value.uid + ',' + value.uname + ',' + value.vType + ',' 
            + JSON.stringify(value.results.at(0)) + ',' + JSON.stringify(value.results.at(1)) + ','
            + JSON.stringify(value.results.at(2)) + ',' + JSON.stringify(value.results.at(3)) + ','
            + JSON.stringify(value.results.at(4)) + ',' + JSON.stringify(value.results.at(5)) + ','
            + JSON.stringify(value.results.at(6)) + ',' + JSON.stringify(value.results.at(7)) + ','
            + JSON.stringify(value.results.at(8)) + ',' + JSON.stringify(value.results.at(9)) + ','
            + JSON.stringify(value.results.at(10)) + ',' + JSON.stringify(value.results.at(11)) + ','
            + JSON.stringify(value.results.at(12)) + ',' + JSON.stringify(value.results.at(13)) + ','
            + JSON.stringify(value.results.at(14)));
        })
    }

    private storeUser(data: PracHistory[]) : void {
        console.log('[Analysys] practice.length: ' + data.length);
        console.log('[Analysys][storePractice] ' + JSON.stringify(data));
    }

    private storePractice(data: PracHistory[]) : void {
        console.log('[Analysys] practice.length: ' + data.length);
        console.log('[Analysys][storePractice] ' + JSON.stringify(data));
    }

    private storeRound(data: RoundSummary[]) : void {
        console.log('[Analysys] round.length: ' + data.length);
        console.log('[Analysys][storeRound] ' + JSON.stringify(data));
    }

    private storeLevel(data: Level[]) : void {
        console.log('[Analysys] level.length: ' + data.length);
        console.log('[Analysys][storeLevel] ' + JSON.stringify(data));
    }

    private storeFootprint(data: FootprintBase[]) : void {
        console.log('[Analysys] footprint.length: ' + data.length);
        console.log('[Analysys][storeFootprint] ' + JSON.stringify(data));
    }
}