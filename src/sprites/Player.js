import Character from "@/sprites/Character.js";
import {Assets, Sprite} from "pixi.js";
import {gsap} from "gsap";
import {OutOfWorldSpaceError} from "@/sprites/errors/OutOfWorldSpaceError.js";
import {WorldConfig} from "@/sprites/WorldConfig.js";

class Player extends Character {
    worldSpace = {
        width: 0,
        height: 0
    }

    constructor(playerSprite) {
        super();
        Assets.add({alias: 'player', src: playerSprite})
    }

    async init() {
        this.spriteSheet = await Assets.load('player');
        await super.init();
    }

    setPosition(x, y) {
        console.log(this.worldSpace);
        if (x < 0 || x >= this.worldSpace.width || y < 0 || y >= this.worldSpace.height) {
            throw new OutOfWorldSpaceError("Player is attempting to move out {" + x + ", " + y + "} of world space ");
        }
        // this.sprite.position.set(x, y);
        // Animate the movement using GSAP
        gsap.to(this.sprite.position, {
            x: x,
            y: y,
            duration: WorldConfig.PLAYER_WALK_SPEED,
            ease: "power1.out"
        });
    }

    getSprite() {
        return this.sprite;
    }

    setWorldSpace(worldSpace) {
        console.log(worldSpace);
        this.worldSpace = worldSpace;
    }
}

export default Player