// VirtualWorld.js
import * as PIXI from 'pixi.js';

export default class VirtualWorld {
    constructor(containerId) {
        this.containerId = containerId;
        this.app = null;
        this.map = null;
        this.avatar = null;
        this.camera = null;
        this.currentPosition = { x: 0, y: 0 };

        this.init();
    }

    /**
     * Initializes the PIXI.js application and loads dynamic assets.
     */
    async init() {
        this.app = new PIXI.Application();
        await this.app.init({
            width: 800,
            height: 600,
            backgroundColor: 0x1099bb,
        });

        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error('Container element not found!');
            return;
        }
        container.appendChild(this.app.view);

        // Load map and sprite sheet assets
        const mapImage = 'path/to/map.png';
        const spriteSheetImage = 'path/to/spritesheet.png';

        PIXI.Assets.load([mapImage, spriteSheetImage]).then((resources) => {
            this.setup(resources);
        });
    }

    /**
     * Sets up the map, avatar, and camera.
     */
    setup(resources) {
        // Create the map
        this.map = new PIXI.Container();
        const mapTexture = PIXI.Texture.from('path/to/map.png');
        const mapSprite = new PIXI.Sprite(mapTexture);
        this.map.addChild(mapSprite);
        this.map.scale.set(1.5); // Zoom the map
        this.app.stage.addChild(this.map);

        // Create the avatar from sprite sheet
        const avatarTexture = PIXI.Texture.from('path/to/spritesheet.png');
        const walkFrames = [];
        for (let i = 0; i < 4; i++) {
            walkFrames.push(new PIXI.Texture(avatarTexture, new PIXI.Rectangle(i * 64, 0, 64, 64)));
        }
        this.avatar = new PIXI.AnimatedSprite(walkFrames);
        this.avatar.animationSpeed = 0.1;
        this.avatar.play();
        this.avatar.position.set(400, 300); // Default position
        this.map.addChild(this.avatar);

        // Set up the camera
        this.camera = new PIXI.Container();
        this.camera.addChild(this.map);
        this.app.stage.addChild(this.camera);

        this.updateCamera();
    }

    /**
     * Updates the camera position to center on the avatar.
     */
    updateCamera() {
        this.camera.position.set(
            -this.avatar.x + this.app.screen.width / 2,
            -this.avatar.y + this.app.screen.height / 2
        );
    }

    /**
     * Moves the avatar in the given direction and updates the camera.
     * @param {string} direction - The direction to move ('up', 'down', 'left', 'right').
     */
    move(direction) {
        const speed = 5;
        switch (direction) {
            case 'up':
                this.avatar.y -= speed;
                break;
            case 'down':
                this.avatar.y += speed;
                break;
            case 'left':
                this.avatar.x -= speed;
                break;
            case 'right':
                this.avatar.x += speed;
                break;
        }

        this.updateCamera();
    }
}