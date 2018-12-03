import Phaser = require('phaser');

export class HowToScene extends Phaser.Scene {
  private player: Phaser.GameObjects.Sprite;
  private goal: Phaser.GameObjects.Sprite;
  private pursuit: Phaser.GameObjects.Sprite;
  private redshirt: Phaser.GameObjects.Sprite;

  private startKey: Phaser.Input.Keyboard.Key;
  private altStartKey: Phaser.Input.Keyboard.Key;

  private firstLevelState: any;

  constructor() {
    super({
      key: 'HowToScene'
    });
  }

  preload(): void {
    this.load.image('player', 'assets/lp_char_player.png');
    this.load.image('goal', 'assets/star.png');
    this.load.image('pursuit', 'assets/monster.png');
    this.load.image('redshirt', 'assets/lp_char_redshirt.png');
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

    this.firstLevelState = {
    };
  }

  create(): void {

    this.add.image(480, 90, 'player').setScale(2);
    this.add.image(1020, 170, 'goal').setScale(2);
    this.add.image(730, 290, 'pursuit').setScale(1.5);
    this.add.image(860, 360, 'redshirt').setScale(2);

    this.add.text(80, 80, 'You are the captain',
      { font: '32px Courier', fill: '#ffff00' });
    this.add.text(80, 160, 'You are trying to get back to the teleport zone',
      { font: '32px Courier', fill: '#ffff00' });
    this.add.text(80, 240, 'Unfortunately, for reasons known only to you,\nsomething is trying to stop you',
      { font: '32px Courier', fill: '#ffff00' });
    this.add.text(80, 350, 'Fortunately, we sent you some redshirts',
      { font: '32px Courier', fill: '#ffff00' });
    this.add.text(80, 430, 'You can use them to distract the thing chasing you,\nor open up shortcuts to the goal',
      { font: '32px Courier', fill: '#ffff00' });
    this.add.text(80, 550, '(Press ENTER to continue)',
      { font: '32px Courier', fill: '#ffff00' });
  }

  update(): void {
    if (this.startKey.isDown || this.altStartKey.isDown) {
      this.scene.start('RsMoveScene', this.firstLevelState);
      this.scene.stop('HowToScene');
    }
  }
}
