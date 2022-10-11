import { DatabaseCore } from "../databridge/DatabaseCore";

export class SettingsScene extends Phaser.Scene {
    constructor() {
        super('SettingsScene');
    }

    preload(): void {
        this.load.image('exit_icon', 'assets/exit.png');
    }

    create(): void {
        console.log('create');
        this.add.rectangle(512, 20, 1024, 40, 0x000000);
        var exitIcon = this.add.image(940, 16, 'exit_icon');
        exitIcon.setInteractive();
        exitIcon.setInteractive();
        exitIcon.on('pointerdown', () => {
            DatabaseCore.getInstance().getAuthImpl().signOut();
        });
    }
}