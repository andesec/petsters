import * as PIXI from 'pixi.js';

export default class MapService {
    constructor(containerId) {
        this.containerId = containerId;
        this.app = null;
        this.map = null;
        this.avatar = null;
        this.camera = null;
        this.uninhabitableAreas = [];
        this.currentPosition = { x: 0, y: 0 };

        // Static API URLs
        this.apiUrls = {
            uninhabitable: '/api/getUninhabitableAreas',
            previousLocation: '/api/getPreviousLocation',
            saveLocation: '/api/saveLocation',
            userAssets: '/api/getUserAssets' // New API to fetch map and avatar image URLs
        };

        this.init();
    }

    /**
     * Initializes the PIXI.js application and loads dynamic assets.
     */
    async init() {
        this.app = new PIXI.Application({
            width: 800,
            height: 600,
            backgroundColor: 0x1099bb
        });

        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error('Container element not found!');
            return;
        }
        container.appendChild(this.app.view);

        // Fetch user assets and uninhabitable areas
        const { mapImage, avatarImage } = await this.fetchUserAssets();
        this.uninhabitableAreas = await this.fetchUninhabitableAreas();

        // Load PIXI resources
        PIXI.Loader.shared
            .add('map', mapImage)
            .add('avatar', avatarImage)
            .load(this.setup.bind(this));
    }

    /**
     * Sets up the map, avatar, and camera.
     */
    async setup() {
        // Create the map
        this.map = new PIXI.Container();
        const mapTexture = PIXI.Loader.shared.resources['map'].texture;
        const mapSprite = new PIXI.Sprite(mapTexture);
        this.map.addChild(mapSprite);
        this.map.scale.set(1.5); // Zoom the map
        this.app.stage.addChild(this.map);

        // Create the avatar
        const avatarTexture = PIXI.Loader.shared.resources['avatar'].texture;
        const avatarSheet = new PIXI.BaseTexture(avatarTexture);
        const walkFrames = [];
        for (let i = 0; i < 4; i++) {
            walkFrames.push(new PIXI.Texture(avatarSheet, new PIXI.Rectangle(i * 64, 0, 64, 64)));
        }
        this.avatar = new PIXI.AnimatedSprite(walkFrames);
        this.avatar.animationSpeed = 0.1;
        this.avatar.play();
        this.avatar.position.set(0, 0); // Default position
        this.map.addChild(this.avatar);

        // Set initial position from API
        const previousLocation = await this.fetchPreviousLocation();
        this.avatar.position.set(previousLocation.x, previousLocation.y);

        // Set up the camera
        this.camera = new PIXI.Container();
        this.camera.addChild(this.map);
        this.app.stage.addChild(this.camera);

        // Update the camera to follow the avatar
        this.updateCamera();
    }

    /**
     * Moves the avatar and updates the camera.
     * @param {string} direction - The direction to move ('up', 'down', 'left', 'right').
     */
    move(direction) {
        const speed = 5; // Adjust movement speed
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
            default:
                console.warn('Invalid direction:', direction);
        }

        // Check for uninhabitable areas
        if (this.isUninhabitable(this.avatar.x, this.avatar.y)) {
            console.warn('Cannot move to this area.');
            return;
        }

        // Update the camera to follow the avatar
        this.updateCamera();
    }

    /**
     * Updates the camera position to center on the avatar.
     */
    updateCamera() {
        this.camera.position.set(-this.avatar.x + this.app.screen.width / 2, -this.avatar.y + this.app.screen.height / 2);
    }

    /**
     * Checks if a position is uninhabitable.
     * @param {number} x - The x-coordinate.
     * @param {number} y - The y-coordinate.
     * @returns {boolean} - True if the position is uninhabitable, false otherwise.
     */
    isUninhabitable(x, y) {
        return this.uninhabitableAreas.some(area => area.x === x && area.y === y);
    }

    /**
     * Fetches uninhabitable areas from the API.
     * @returns {Promise<Array>} - An array of uninhabitable areas.
     */
    async fetchUninhabitableAreas() {
        const response = await fetch(this.apiUrls.uninhabitable);
        return response.json();
    }

    /**
     * Fetches the user's previous location from the API.
     * @returns {Promise<{x: number, y: number}>} - The previous location.
     */
    async fetchPreviousLocation() {
        const response = await fetch(this.apiUrls.previousLocation);
        return response.json();
    }

    /**
     * Fetches user-specific assets (map and avatar images) from the API.
     * @returns {Promise<{mapImage: string, avatarImage: string}>} - The URLs of the map and avatar images.
     */
    async fetchUserAssets() {
        const response = await fetch(this.apiUrls.userAssets);
        return response.json();
    }

    /**
     * Saves the user's current location to the API.
     */
    async saveCurrentLocation() {
        await fetch(this.apiUrls.saveLocation, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ x: this.avatar.x, y: this.avatar.y })
        });
    }
}