import { GameObjects } from "phaser";
import { TitleTypeName } from "../const/TitleType";
import { DatabaseCore } from "../databridge/DatabaseCore";
import { LogicController } from "../domain/LogicController";
import { UserData } from "../dto/UserData";

export class SettingsScene extends Phaser.Scene {

    private userDetail: UserData;
    private userName: GameObjects.Text;
    private points: GameObjects.BitmapText;
    private title: GameObjects.BitmapText;

    constructor() {
        super('SettingsScene');
    }

    preload(): void {
        this.load.bitmapFont('desyrel', 'assets/fonts/desyrel.png', 'assets/fonts/desyrel.xml');

        this.load.image('exit_icon', 'assets/logout.png');
        this.load.image('exit_icon_hover', 'assets/logout_hover.png');
        this.load.image('hito_icon', 'assets/leaderboard.png');
        this.load.image('hito_icon_hover', 'assets/leaderboard_hover.png');
        this.load.image('badge_icon', 'assets/badge.png');
        this.load.image('dollar_icon', 'assets/dollar.png');
        this.load.image('user_icon', 'assets/user.png');
    }

    create(): void {
        

        this.add.rectangle(512, 20, 1024, 40, 0xffffff);

        var userIcon = this.add.image(30, 16, 'user_icon');
        this.userName = this.make.text({
            x: 62,
            y: 0,
            text: '',
            style: { font: 'bold 32px Arial', color: '#f2c81f' }
        });

        var dollarIcon = this.add.image(350, 16, 'dollar_icon');
        this.points = this.add.bitmapText(382, -3, 'desyrel', '', 32);

        var badgeIcon = this.add.image(560, 16, 'badge_icon');
        this.title = this.add.bitmapText(592, -3, 'desyrel', '', 32);

        var hitoIcon = this.add.image(940, 16, 'hito_icon');
        var hitoIconHover = this.add.image(940, 16, 'hito_icon_hover');
        hitoIconHover.setVisible(false);
        hitoIcon.setInteractive();
        hitoIcon.on('pointerdown', () => {
            console.log('click');
            this.scene.start('LeaderboardScene', {
                from: 'LevelScene',
            })
        });
        hitoIcon.on('pointerover', () => { hitoIconHover.setVisible(true); });
        hitoIcon.on('pointerout', () => { hitoIconHover.setVisible(false); });


        var exitIcon = this.add.image(1000, 16, 'exit_icon');
        var exitIconHover = this.add.image(1000, 16, 'exit_icon_hover');
        exitIconHover.setVisible(false);
        exitIcon.setInteractive();
        exitIcon.on('pointerdown', () => {
            DatabaseCore.getInstance().getAuthImpl().signOut();
        });
        exitIcon.on('pointerover', () => { exitIconHover.setVisible(true); });
        exitIcon.on('pointerout', () => { exitIconHover.setVisible(false); });
    }

    update(time: number, delta: number): void {
        this.userDetail = LogicController.getInstance().getUser();
        if (this.userDetail) {
            this.userName.text = this.userDetail.nickName;
            this.points.text = this.userDetail.points.toString();
            this.title.text = TitleTypeName.at(this.userDetail.title);
        }
        
    }
}