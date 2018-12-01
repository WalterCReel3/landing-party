import Phaser = require('phaser');

export class IntroScene extends Phaser.Scene {
    private introText: Phaser.GameObjects.Text;
    private background: Phaser.GameObjects.Sprite;
    private startKey: Phaser.Input.Keyboard.Key;
    private firstLevelState: any;

    constructor() {
        super({
            key: 'IntroScene'
        });
    }

    preload(): void {
        this.load.image('background', 'assets/titlebackground.png');
    }

    init(): void {
        this.startKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ENTER
        );
        this.startKey.isDown = false;

        this.firstLevelState = {
        };
    }

    create(): void {
        console.log('In create');
        this.add.image(640, 640, 'background');
    }

    update(): void {
        if (this.startKey.isDown) {
            this.scene.start('RsMoveScene', this.firstLevelState);
            this.scene.stop('IntroScene');
        }
    }
}
