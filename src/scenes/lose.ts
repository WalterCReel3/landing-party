import Phaser = require('phaser');

export class LossScene extends Phaser.Scene {
    private background: Phaser.GameObjects.Sprite;
    private startKey: Phaser.Input.Keyboard.Key;
    private altStartKey: Phaser.Input.Keyboard.Key;

    constructor() {
        super({
            key: 'LossScene'
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
        this.altStartKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
        this.altStartKey.isDown = false;
    }

    create(): void {
        console.log('In create');
        this.add.image(640, 640, 'background');
        this.add.text(700, 500, 'You lost! Press ENTER to cry', { font: '32px Courier', fill: '#ff5500' })
    }

    update(): void {
        if (this.startKey.isDown || this.altStartKey.isDown) {
            this.scene.start('IntroScene');
            this.scene.stop('LossScene');
        }
    }
}
