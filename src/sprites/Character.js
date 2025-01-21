import {AnimatedSprite, Assets, Rectangle, Sprite, Texture} from "pixi.js";

class Character {
    // Define the animated frames here
    spriteHeight = 32;
    spriteWidth = 32;
    animatedFrames = {
        idleUp: [0, 0, this.spriteWidth, this.spriteHeight], // R1C1
        idleRight: [32, 0, this.spriteWidth, this.spriteHeight], // R1C2
        idleDown: [64, 32, this.spriteWidth, this.spriteHeight], // R2C3
        idleLeft: [0, 64, this.spriteWidth, this.spriteHeight], // R3C1
        walkUp: [32, 96, this.spriteWidth, this.spriteHeight, 64, 0, this.spriteWidth, this.spriteHeight], // R4C2 and R1C3
        walkLeft: [0, 96, this.spriteWidth, this.spriteHeight, 0, 32, this.spriteWidth, this.spriteHeight], // R4C1 and R2C1
        walkRight: [32, 64, this.spriteWidth, this.spriteHeight, 32, 32, this.spriteWidth, this.spriteHeight], // R3C2 and R2C2
        walkDown: [64, 64, this.spriteWidth, this.spriteHeight, 64, 96, this.spriteWidth, this.spriteHeight], // R3C3 and R4C3
    };

    spriteSheet; // Texture
    sprite; // Animated Sprite
    animations = {};
    idles = {}

    async init() {
        // const frames = Object.values(this.animatedFrames).map(frame => {
        //     console.log(frame)
        //     return new Texture(this.spriteSheet, new Rectangle(...frame));
        // });

        // Directly create the texture for the idle frame
        const idleUpRectangle = new Rectangle(0, 0, 32, 32);
        const idleUpTexture = new Texture(await Assets.load('player'), 'idleUp', idleUpRectangle);
        this.sprite = new Sprite(idleUpTexture);
        // this.sprite.anchor.set(0.5);
        // this.sprite.animationSpeed = 0.5;
        // this.sprite.play();
    }


}

export default Character;