import { User } from "firebase/auth";
import { GroupType } from "../const/GroupType";
import { TitleTypeName } from "../const/TitleType";
import { FootprintImpl } from "../databridge/FootprintImpl";
import { HistoryImpl } from "../databridge/HistoryImpl";
import { LevelInfoImpl } from "../databridge/LevelInfoImpl";
import { UserInfoImpl } from "../databridge/UserInfoImpl";
import { FootprintBase, FootprintType } from "../dto/FootprintBase";
import { Level, LevelType } from "../dto/LevelInfo";
import { PracHistory } from "../dto/PracHistory";
import { RoundSummary } from "../dto/RoundSummary";
import { UserData } from "../dto/UserData";
import { VKSHistory } from "../dto/VKSHistory";


export class AnalysisBehaviorScene extends Phaser.Scene {

    private static PAGE_SIZE: number = 10;

    // DB impl
    private userInfoApi: UserInfoImpl;
    private footprintApi: FootprintImpl;
    private historyApi: HistoryImpl;
    private levelInfoApi: LevelInfoImpl;

    // Data
    private userExpList: UserData[];
    private userCtrList: UserData[];
    private practiceList: PracHistory[];
    private roundList: RoundSummary[];
    private footprintList: FootprintBase[];
    private userIdNameMap: Map<string, string>;

    constructor() {
        super({
            key: 'AnalysisBehaviorScene'
        })

        this.userInfoApi = new UserInfoImpl();
        this.footprintApi = new FootprintImpl();
        this.historyApi = new HistoryImpl();
        this.levelInfoApi = new LevelInfoImpl();
    }

    preload(): void {
        this.load.image('bg', 'assets/background-geo-grey.jpg');

        this.load.text('userExpLog', 'data/0404/user_exp.log');
        this.load.text('userContLog', 'data/0404/user_ctr.log');
        this.load.text('practiceLog', 'data/0404/practice_raw.log');
        this.load.text('roundLog', 'data/0404/round_raw.log');
        this.load.text('levelLog', 'data/0404/level_raw.log');
        this.load.text('footprintLog', 'data/0404/footprint_raw.log');
    }

    create(data?: any): void {
        console.log('[AnalysisBehaviorScene] Create');
        this.add.image(512, 384, 'bg');

        this.buildUserIdNameMap();
        // this.buildLevelLog();
        // this.buildPracticeLog();
        // this.buildRoundLog();
        this.buildFootprintLog();
        // this.buildBehaviorLog();

    }

    private buildUserIdNameMap(): void {
        var list = this.cache.text.get('footprintLog');
        this.footprintList = JSON.parse(list);
        
        this.userIdNameMap = new Map();
        this.footprintList.forEach((value, index, array) => {
            if (!this.userIdNameMap.has(value.uid)) {
                this.userIdNameMap.set(value.uid, value.name);
            }
        })
    }

    private countUser(users: UserData[], group: GroupType): void {
        var groupName = group == GroupType.EXPERIMENTAL ? 'Experimental' : 'Control';
        var total = users.length;
        var lessThanFifty = users.filter((value, index, array) => {
            return value.entranceScore <= 50;
        });
        var greatThanFifty = users.filter((value, index, array) => {
            return value.entranceScore > 50;
        });
        console.log('[AnalysisBehaviorScene]['+ groupName +'] totalUsers: ' + total + ", lessThanFifty: " + lessThanFifty.length + ", greatThanFifty: " + greatThanFifty.length);

        /* Log for dumping user info
        console.log(
            'nickName' + ',' + 'entranceScore' + ',' + 'group' + ',' + 'level' + ',' + 'title' + ',' + 'totalPoints' + ','
            + 'isPreExternalLink' + ',' + 'isPreVKSDone' + ',' + 'isPostVKSDone' + ',' + 'isPostExternalLink');
        users.forEach(user => {
            console.log(
                user.nickName + ',' + user.entranceScore + ',' + user.group + ',' + user.level + ',' + TitleTypeName.at(user.title) + ',' + user.totalPoints + ','
                + user.isPreExternalLink + ',' + user.isPreVKSDone + ',' + user.isPostVKSDone + ',' + user.isPostExternalLink);
        }); 
        */


        var validUser = users.filter((value, index, array) => {
            return value.isPreExternalLink && value.isPreVKSDone && value.isPostVKSDone && value.isPostExternalLink
        })
        console.log('[AnalysisBehaviorScene]['+ groupName +'] validUser: ' + validUser.length /*JSON.stringify(validUser)*/);

        var missPostVKSandLink = users.filter((value, index, array) => {
            return value.isPreExternalLink && value.isPreVKSDone && !value.isPostVKSDone && !value.isPostExternalLink;
        })
        console.log('[AnalysisBehaviorScene]['+ groupName +'] missPostVKSandLink: ' + missPostVKSandLink.length /*JSON.stringify(missPostVKS)*/);

    }

    private countVKS(data: VKSHistory[]) {
        console.log('[Analysys] vks.length: ' + data.length);
        
        console.log('name' + ',' + 'type' + ',' 
            + 'qid_0001' + ',' + 'qid_0002' + ','
            + 'qid_0003' + ',' + 'qid_0004' + ','
            + 'qid_0005' + ',' + 'qid_0006' + ','
            + 'qid_0007' + ',' + 'qid_0008' + ','
            + 'qid_0009' + ',' + 'qid_0010' + ','
            + 'qid_0011' + ',' + 'qid_0012' + ','
            + 'qid_0013' + ',' + 'qid_0014' + ','
            + 'qid_0015');
        data.forEach((value, index, array) => {
            console.log(value.uname + ',' + value.vType + ',' 
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


    private buildLevelLog(): void {
        var list = this.cache.text.get('levelLog');
        const data = JSON.parse(list);
        console.log('uid,userName,level,status,timesOfPrac');
        data.forEach((element : Level) => {
            console.log(element.uid + ',' + element.userName + ',' + this.getExactLevelName(element.type) + ',' + element.status + ',' + element.timesOfPrac);
        });
    }

    private buildPracticeLog(): void {
        var list = this.cache.text.get('practiceLog');
        this.practiceList = JSON.parse(list);

        console.log('uid,userName,level,detail');
        this.practiceList.forEach((value, index, array) => {
            console.log(value.uid + ',' + value.uname + ',' + this.getExactLevelName(value.level) + ',' + JSON.stringify(value.results));
        })
    }

    private buildRoundLog(): void {
        var list = this.cache.text.get('roundLog');
        this.roundList = JSON.parse(list);

        console.log('uid,userName,關卡,答對題數,答錯題數,額外增加題目次數,答錯單字');
        this.roundList.forEach((value, index, array) => {
            var passQuizzes = value.quizzes.filter((slice, sIndex, slicesList) => {
                return slice.isCorrect;
            })
            var failedQuizzes = value.quizzes.filter((slice, sIndex, slicesList) => {
                return !slice.isCorrect;
            })
            var failureWord = failedQuizzes.map((slice, sIndex, sliceList) => {
                return slice.selection;
            })

            console.log(value.uid + ',' + value.uname + ',' + this.getExactLevelName(value.level) + ',' + passQuizzes.length + ',' + failedQuizzes.length + ',' + value.bonusTimes + ',' + failureWord.join('/'));
        })
        // var test = this.roundList.filter((value, index, array) => {
        //     return value.uid == 'zwLtJHiFgmNkKKcdgAICMNdAjaC2';
        // })
        // test.forEach((value, index, array) => {
        //     var passQuizzes = value.quizzes.filter((slice, sIndex, slicesList) => {
        //         return slice.isCorrect;
        //     })
        //     var failedQuizzes = value.quizzes.filter((slice, sIndex, slicesList) => {
        //         return !slice.isCorrect;
        //     })
        //     var failureWord = failedQuizzes.map((slice, sIndex, sliceList) => {
        //         return slice.selection;
        //     })

        //     console.log(value.uid + ',' + value.uname + ',' + this.getExactLevelName(value.level) + ',' + passQuizzes.length + ',' + failedQuizzes.length + ',' + value.bonusTimes + ',' + JSON.stringify(failureWord));
        // })
    }

    private buildFootprintLog(): void {
        var list = this.cache.text.get('footprintLog');
        this.footprintList = JSON.parse(list);

        let userLeaderBoard = new Map();
        let userTrace = new Map();
        
        this.footprintList.forEach((value, index, array) => {
            if (value.fType == FootprintType.LEADER_BOARD) {
                if (!userLeaderBoard.has(value.uid)) {
                    userLeaderBoard.set(value.uid, 1);
                } else {
                    var newValue = userLeaderBoard.get(value.uid) + 1;
                    userLeaderBoard.set(value.uid, newValue);
                }
            }

            if (value.fType == FootprintType.TRACE) {
                if (!userTrace.has(value.uid)) {
                    userTrace.set(value.uid, 1);
                } else {
                    var newValue = userTrace.get(value.uid) + 1;
                    userTrace.set(value.uid, newValue);
                }
            }
        })

        console.log('====== Leaderboard ========');
        console.log('uid,userName,排行榜點擊次數');
        userLeaderBoard.forEach((values, keys) => {
            console.log(keys + ',' + this.userIdNameMap.get(keys) + ',' + values);
        })

        console.log('====== Trace ========');
        console.log('uid,userName,遊戲歷程點擊次數');
        userTrace.forEach((values, keys) => {
            console.log(keys + ',' + this.userIdNameMap.get(keys) + ',' + values);
        })
    }

    private buildBehaviorLog(): void {
        console.log('uid,name,行為類別,發生時間');
        var tmpList = this.cache.text.get('practiceLog');
        this.practiceList = JSON.parse(tmpList);
        this.practiceList.forEach((value, index, array) => {
            console.log(value.uid + ',' + value.uname + ',' + this.getPracMapping(value.level) + "," + value.date_time.seconds);
        })

        var tmpList2 = this.cache.text.get('roundLog');
        this.roundList = JSON.parse(tmpList2);
        this.roundList.forEach((value, index, array) => {
            console.log(value.uid + ',' + value.uname + ',' + this.getRoundMapping(value.level, value.isPass) + "," + value.date_time.seconds);
        })

        var list = this.cache.text.get('footprintLog');
        this.footprintList = JSON.parse(list);
        this.footprintList.forEach((value, index, array) => {
            console.log(value.uid + ',' + this.userIdNameMap.get(value.uid) + ',' + this.getFootprintMapping(value.fType) + "," + value.date_time.seconds);
        })

    }

    private getExactLevelName(type: LevelType): string {
        switch(type) {
            case LevelType.DEPOSIT:
                return 'Level1';
            case LevelType.FOREX:
                return 'Level2';
            case LevelType.LOAN:
                return 'Level3';
            case LevelType.PREXAM:
                return 'Pre_Exam';
        }
    }

    private getPracMapping(type: LevelType): string {
        switch(type) {
            case LevelType.DEPOSIT:
                return 'L1';
            case LevelType.FOREX:
                return 'L2';
            case LevelType.LOAN:
                return 'L3';
            case LevelType.PREXAM:
                return 'LNAN';
        }
    }

    private getRoundMapping(type: LevelType, isPass: boolean): string {
        if (isPass) {
            switch(type) {
                case LevelType.DEPOSIT:
                    return 'G1';
                case LevelType.FOREX:
                    return 'G2';
                case LevelType.LOAN:
                    return 'G3';
                case LevelType.PREXAM:
                    return 'GNAN';
            }
        } else {
            switch(type) {
                case LevelType.DEPOSIT:
                    return 'G4';
                case LevelType.FOREX:
                    return 'G5';
                case LevelType.LOAN:
                    return 'G6';
                case LevelType.PREXAM:
                    return 'GNAN';
            }
        }
    }

    private getFootprintMapping(type: FootprintType): string {
        switch(type) {
            case FootprintType.LEADER_BOARD:
                return 'A2';
            case FootprintType.TRACE:
                return 'A3';
        }
    }
}