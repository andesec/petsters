import {Application, Assets, Container, Sprite} from 'pixi.js';
import {WorldConfig} from "@/sprites/WorldConfig.js";
import {next} from "lodash/seq.js";
import {gsap} from "gsap";

class World {
    containerElement;
    app = new Application();
    scale = 1;
    map;
    player;
    npcs = [];
    currentViewPoints = {
        x: 0,
        y: 0
    }
    playerStartingPoint = {
        x: 0,
        y: 0
    }

    constructor(containerId, mapSprite, currentViewPoints) {
        this.containerElement = document.getElementById(containerId);

        if (!this.containerElement) {
            throw new Error('Container element not found!');
        }

        this.currentViewPoints = currentViewPoints;
        Assets.add({alias: 'map', src: mapSprite})
    }

    async init() {
        await this.app.init({resizeTo: this.containerElement});
        this.containerElement.appendChild(this.app.canvas);

        const texture = await Assets.load('map');

        this.map = new Sprite(texture);
        this.map.anchor.set(0, 0);
        this.map.scale.set(WorldConfig.WORLD_SCALE);
        this.map.position.set(this.currentViewPoints.x, this.currentViewPoints.y);

        this.app.stage.addChild(this.map);
    }

    async addPlayer(player) {
        await player.init();
        this.player = player
        this.player.setWorldSpace({width:this.map.width, height:this.map.height});
        this.player.sprite.scale.set(WorldConfig.PLAYER_SCALE);
        this.player.sprite.position = this.playerStartingPoint;
        this.app.stage.addChild(player.getSprite());
    }

    addNPC(npc) {
        this.npcs.append(npc)
    }

    destroy() {
        this.app.destroy(true, true);
    }

    moveCamera(direction) {
        const cameraMovementSpeed = WorldConfig.CAMERA_MOVEMENT_SPEED;
        const cameraMovementSpace = WorldConfig.CAMERA_MOVEMENT_SPACE;
        const mapCurrentPosition = this.map.position;
        const mapNextPosition = {x: 0, y: 0};

        switch (direction) {
            case 'up':
                mapNextPosition.x = mapCurrentPosition.x;
                mapNextPosition.y = mapCurrentPosition.y + cameraMovementSpace;
                break;
            case 'down':
                mapNextPosition.x = mapCurrentPosition.x;
                mapNextPosition.y = mapCurrentPosition.y - cameraMovementSpace;
                break;
            case 'left':
                mapNextPosition.x = mapCurrentPosition.x + cameraMovementSpace;
                mapNextPosition.y = mapCurrentPosition.y;
                break;
            case 'right':
                mapNextPosition.x = mapCurrentPosition.x - cameraMovementSpace;
                mapNextPosition.y = mapCurrentPosition.y;
                break;
            default:
                throw new Error("Unknown direction: " + direction);
        }

        gsap.to(this.map.position, {
            x: mapNextPosition.x,
            y: mapNextPosition.y,
            duration: WorldConfig.CAMERA_MOVEMENT_SPEED,
            ease: "power1.out"
        });
    }

    movePlayer(direction) {
        console.log(direction);
        const playerCurrentPosition = this.player.getSprite().position;
        let nextPosition = {x: 0, y: 0};

        switch (direction) {
            case 'up':
                nextPosition.x = playerCurrentPosition;
                nextPosition.y = playerCurrentPosition.y - 32
                break;
            case 'down':
                nextPosition.x = playerCurrentPosition.x;
                nextPosition.y = playerCurrentPosition.y + 32;
                break;
            case 'left':
                nextPosition.x = playerCurrentPosition.x - 32;
                nextPosition.y = playerCurrentPosition.y;
                break;
            case 'right':
                nextPosition.x = playerCurrentPosition.x + 32;
                nextPosition.y = playerCurrentPosition.y
                break;
            default:
                throw new Error("Unknown direction: " + direction);
        }

        this.player.setPosition(nextPosition.x, nextPosition.y)

    }

}

export default World;