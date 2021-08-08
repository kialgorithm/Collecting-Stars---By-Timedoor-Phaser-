import Phaser from 'phaser'
var platforms
var player
var cursors
var stars
var score = 0
var scoreText
var bombs
var gameOver = false
export default class CollectingStarsScene extends Phaser.Scene
{
	constructor()
	{
        super('collecting-stars-scene')

    }
    
	preload()
	{
        this.load.image('ground', 'images/platform.png')
        this.load.image('sky', 'images/sky.png')
        this.load.image('star', 'images/star.png')
        this.load.image('bomb', 'images/bomb.png')

        this.load.spritesheet('dude', 'images/dude.png', {
            frameWidth : 32, frameHeight : 48
        })
        
    }

    create()
    {
        this.add.image(400, 300, 'sky')
        // this.add.image(400, 300, 'star')

        platforms = this.physics.add.staticGroup()

        platforms.create(400, 568, 'ground').setScale(2).refreshBody()

        platforms.create(600, 400, 'ground')
        platforms.create(50, 250, 'ground')
        platforms.create(750, 220, 'ground')

        player = this.physics.add.sprite(100, 450, 'dude');
        player.setCollideWorldBounds(true);
        player.setBounce(0.2);

        
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });
        
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.physics.add.collider(player, platforms)

        cursors = this.input.keyboard.createCursorKeys()

        stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        
        stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
        });

        this.physics.add.collider(stars, platforms)

        this.physics.add.overlap(player, stars, this.collectStar, null, this)

        scoreText = this.add.text(16, 16, 'Score : 0', { fontSize: '32px', fill: 'yellow' })

        bombs = this.physics.add.group()

        this.physics.add.collider(bombs, platforms)

        this.physics.add.collider(player, bombs, this.hitBomb, null, this)
    }

    collectStar(player, star)
    {
        star.disableBody(true, true)

        score += 10;
        scoreText.setText('Score : ' + score)

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400)

        var bomb = bombs.create(x, 0, 'bomb')
        bomb.setBounce(1)
        bomb.setCollideWorldBounds(true)
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)

        // challenge meeting 3
        if (stars.countActive(true) === 0)
        {
            stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true)
            });
        }
    }

    hitBomb(player, bomb)
    {
        this.physics.pause()

        player.setTint(0xff0000)
    
        player.anims.play('turn')
    
        gameOver = true
    }

    update()
    {
        // code gameOver ini belum ada di buku
        if (gameOver)
        {
            return
        }
        //gerak ke kiri
        if (cursors.left.isDown) {
            player.setVelocityX(-160)

            player.anims.play('left', true)
        //gerak ke kanan
        } else if (cursors.right.isDown) {
            player.setVelocityX(160)

            player.anims.play('right', true)
        //tidak bergerak
        } else {
            player.setVelocityX(0)

            player.anims.play('turn')
        }
        //lompat
        if (cursors.up.isDown ){
            player.setVelocityY(-250)
        }

    }

}