export class LoadingScene extends Phaser.Scene {
    private loadingIcon: Phaser.GameObjects.Image;

    constructor() {
        super('LoadingScene');
    }

    preload(): void {
        this.load.image('loading_icon', 'assets/refresh.png');
    }

    create(): void {
        console.log('create');
        
        this.add.rectangle(512, 384, 1024, 768, 0x000000, 80);
        this.loadingIcon = this.add.image(512, 384, 'loading_icon');
    }

    update(): void {
        console.log('update');
        this.loadingIcon.rotation += 0.1;
    }
}