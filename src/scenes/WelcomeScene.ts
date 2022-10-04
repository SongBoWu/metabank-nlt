import { DatabaseCore } from "../databridge/DatabaseCore";
import { LevelInfoImpl } from "../databridge/LevelInfoImpl";
import { UserInfoImpl } from "../databridge/UserInfoImpl";
import { LogicController } from "../domain/LogicController";
import { Level, LevelBuilder, LevelStatus, LevelType } from "../dto/LevelInfo";
import { UserDataBuilder } from "../dto/UserData";
import { BaseLogPanelScene } from "./BaseLogPanelScene";

// 1. Refer to "Scenes\Tutorial\Scene Controller" for scene control
export class WelcomeScene extends BaseLogPanelScene {
    private firestoreUserinfo: UserInfoImpl;
    private levelInfo : LevelInfoImpl;
    private levelMap : Map<LevelType, Level>;
    
    constructor() {
        super('WelcomeScene');
        this.firestoreUserinfo = new UserInfoImpl();
        this.levelInfo = new LevelInfoImpl();
    }

    override preload(): void {
        super.preload();
    }

    override create(): void {
        super.create();
        console.log("[Welcome] onCreate");

        var user = DatabaseCore.getInstance().getAuthImpl().getUser();

        var level1Txt = this.make.text({
            x: 10, 
            y: 500, 
            text: 'Level1', 
            style: { font: 'bold 30px Arial', color: '#00ff00' }
            });
            
        level1Txt.on('pointerdown', () => {  
            LogicController.getInstance().setCurrentLevel(LevelType.DEPOSIT);
            if (this.levelMap.get(LevelType.DEPOSIT).status != LevelStatus.FINISHED) {
                this.scene.start('LevelScene',
                {
                    from: 'WelcomeScene',
                    levelType: LevelType.DEPOSIT,
                });
            }
        });
        
        var level2Txt = this.make.text({
            x: 150, 
            y: 500, 
            text: 'Level2', 
            style: { font: 'bold 30px Arial', color: '#00ff00' }
        });

        level2Txt.on('pointerdown', () => {
            LogicController.getInstance().setCurrentLevel(LevelType.FOREX);
            if (this.levelMap.get(LevelType.FOREX).status != LevelStatus.FINISHED) {
                this.scene.start('LevelScene',
                {
                    from: 'WelcomeScene',
                    levelType: LevelType.FOREX,
                });
            }
        });

        var level3Txt = this.make.text({
            x: 300, 
            y: 500, 
            text: 'Level3', 
            style: { font: 'bold 30px Arial', color: '#00ff00' }
        });

        level3Txt.on('pointerdown', () => {
            LogicController.getInstance().setCurrentLevel(LevelType.LOAN);
            if (this.levelMap.get(LevelType.LOAN).status != LevelStatus.FINISHED) {
                this.scene.start('LevelScene',
                {
                    from: 'WelcomeScene',
                    levelType: LevelType.LOAN,
                });
            }
        });

        this.firestoreUserinfo.get(user.uid)
            .then(userData => {
                LogicController.getInstance().setUser(userData);
                this.showLog(JSON.stringify(LogicController.getInstance().getUser()));
                return this.levelInfo.getLevels(user.uid);
            })
            .then((levels: Level[]) => {
                LogicController.getInstance().setLevels(levels);
                this.levelMap = LogicController.getInstance().getLevels();
                let curLevel = LogicController.getInstance().getCurrentLevel();
                if (curLevel) {
                    this.showLog('Let\'s continue to Level: ' + curLevel.type);
                }
                
                level1Txt.setInteractive();
                level2Txt.setInteractive();
                level3Txt.setInteractive();
            })
            .catch((err: string) => {
                // TODO
                this.showLog(err);
                level1Txt.setInteractive();
                level2Txt.setInteractive();
                level3Txt.setInteractive();
            });  
    }

    protected override onNetworkOnline(event: Event): void {
        // TODO
    }

    protected override onNetworkOffline(event: Event): void {
        // TODO
    }
}