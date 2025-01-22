import {Application, Assets, Container, Sprite} from 'pixi.js';
import {WorldConfig} from "@/sprites/WorldConfig.js";
import {next} from "lodash/seq.js";
import {gsap} from "gsap";

class World {
    containerElement;
    app = new Application();
    map;
    player;
    currentViewPoints = {
        x: 0,
        y: 0
    }
    playerStartingPoint = {
        x: 0,
        y: 0
    }
    worldContainer = new Container({isRenderGroup: true});

    constructor(containerId, mapSprite, currentViewPoints) {
        this.containerElement = document.getElementById(containerId);

        if (!this.containerElement) {
            throw new Error('Container element not found!');
        }

        this.currentViewPoints = currentViewPoints;
        Assets.add({alias: 'map', src: mapSprite})
    }

    async init() {
        await this.app.init({ background: 'white', resizeTo: this.containerElement});
        this.containerElement.appendChild(this.app.canvas);

        const texture = await Assets.load('map');

        this.map = new Sprite(texture);
        this.map.anchor.set(0, 0);
        this.map.scale.set(WorldConfig.WORLD_SCALE);
        this.map.position.set(this.currentViewPoints.x, this.currentViewPoints.y);
        this.worldContainer.addChild(this.map);

        this.app.stage.addChild(this.worldContainer);
    }

    async addPlayer(player) {
        await player.init();
        this.player = player
        this.player.setWorldSpace({width:this.map.width, height:this.map.height});
        this.player.sprite.scale.set(WorldConfig.PLAYER_SCALE);
        this.player.sprite.position = this.playerStartingPoint;
        this.worldContainer.addChild(player.getSprite());
    }

    destroy() {
        this.app.destroy(true, true);
    }

    moveCamera() {
        const cameraViewportWidth = this.containerElement.clientWidth;
        const cameraViewportHeight = this.containerElement.clientHeight;

        // Get player's current position
        const playerPosition = this.player.getSprite().position;

        // Calculate the camera's target position (centered on the player)
        const targetCameraPosition = {
            x: -(playerPosition.x - cameraViewportWidth / 2),
            y: -(playerPosition.y - cameraViewportHeight / 2)
        };

        // Clamp the camera's position to the bounds of the map
        const maxX = 0; // left edge
        const maxY = 0; // top edge
        const minX = -(this.map.width - cameraViewportWidth); // right edge
        const minY = -(this.map.height - cameraViewportHeight); // bottom edge

        targetCameraPosition.x = Math.min(maxX, Math.max(minX, targetCameraPosition.x));
        targetCameraPosition.y = Math.min(maxY, Math.max(minY, targetCameraPosition.y));

        // Smoothly move the world container to the target position
        gsap.to(this.worldContainer.position, {
            x: targetCameraPosition.x,
            y: targetCameraPosition.y,
            duration: WorldConfig.CAMERA_MOVEMENT_SPEED,
            ease: "power1.out"
        });
    }

    movePlayer(direction) {
        const playerCurrentPosition = this.player.getSprite().position;
        const stepSize = WorldConfig.TILE_SIZE * WorldConfig.WORLD_SCALE; // Size of each step
        const playerWidth = this.player.getSprite().width;
        const playerHeight = this.player.getSprite().height;
        let nextPosition = { x: playerCurrentPosition.x, y: playerCurrentPosition.y };

        // Calculate the next position of the player based on the direction
        switch (direction) {
            case 'up':
                nextPosition.y -= stepSize;
                break;
            case 'down':
                nextPosition.y += stepSize;
                break;
            case 'left':
                nextPosition.x -= stepSize;
                break;
            case 'right':
                nextPosition.x += stepSize;
                break;
            default:
                throw new Error("Unknown direction: " + direction);
        }

        // Clamp the player's position to the bounds of the map, considering the player's size
        nextPosition.x = Math.max(0, Math.min(this.map.width - playerWidth, nextPosition.x));
        nextPosition.y = Math.max(0, Math.min(this.map.height - playerHeight, nextPosition.y));

        // Move the player sprite
        this.player.setPosition(nextPosition.x, nextPosition.y);

        // Update the camera to follow the player
        this.moveCamera();
    }

}

export default World;