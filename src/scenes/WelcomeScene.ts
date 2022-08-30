import { DatabaseCore } from "../databridge/DatabaseCore";
import { LevelInfoImpl } from "../databridge/LevelInfoImpl";
import { UserInfoImpl } from "../databridge/UserInfoImpl";
import { LogicController } from "../domain/LogicController";
import { Level, LevelBuilder, LevelType } from "../dto/LevelInfo";
import { UserDataBuilder } from "../dto/UserData";
import { BaseLogPanelScene } from "./BaseLogPanelScene";

export class WelcomeScene extends BaseLogPanelScene {
    private firestoreUserinfo: UserInfoImpl;
    private levelInfo : LevelInfoImpl;
    
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

        var user = DatabaseCore.getInstance().getAuthImpl().getUser();

        var startTxt = this.make.text({
            x: 10, 
            y: 500, 
            text: 'Start', 
            style: { font: 'bold 30px Arial', color: '#00ff00' }
            });
            
            startTxt.on('pointerdown', ()=>{
                this.scene.start('LevelScene',
                {
                    from: 'WelcomeScene'
                });
            });

        this.firestoreUserinfo.get(user.uid)
            .then(userData => {
                LogicController.getInstance().setUser(userData);
                this.showLog(JSON.stringify(LogicController.getInstance().getUser()));
                return this.levelInfo.getLevels(user.uid);
            })
            .then((levels: Level[]) => {
                LogicController.getInstance().setLevels(levels);
                this.showLog(JSON.stringify(LogicController.getInstance().getCurrentLevel()))
                startTxt.setInteractive();
            })
            .catch((err: string) => {
                // TODO
                this.showLog(err);
                startTxt.setInteractive();
            });  
    }

    protected override onNetworkOnline(event: Event): void {
        // TODO
    }

    protected override onNetworkOffline(event: Event): void {
        // TODO
    }
}