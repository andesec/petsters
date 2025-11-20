import * as PIXI from 'pixi.js';
import ApiService from './ApiService';

export default class MapService {
    containerId: string;
    app: PIXI.Application | null;
    map: PIXI.Container | null;
    avatar: PIXI.AnimatedSprite | null;
    camera: PIXI.Container | null;
    uninhabitableAreas: any[];
    currentPosition: { x: number; y: number };
    apiUrls: {
        uninhabitable: string;
        previousLocation: string;
        saveLocation: string;
        userAssets: string;
    };

    constructor(containerId: string) {
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
            userAssets: '/api/getUserAssets'
        };
    }

    async init() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error('Container element not found!');
            return;
        }

        // Get container dimensions
        const containerWidth = container.clientWidth || 800;
        const containerHeight = container.clientHeight || 600;

        this.app = new PIXI.Application();
        await this.app.init({
            width: Math.min(containerWidth, 800),
            height: Math.min(containerHeight, 600),
            backgroundAlpha: 0 // Make background transparent
        });

        container.appendChild(this.app.canvas);

        // Fetch user assets and uninhabitable areas
        // For now, we'll mock these or use defaults if API fails, 
        // but ideally we should fetch them.
        // const { mapImage, avatarImage } = await this.fetchUserAssets();
        // this.uninhabitableAreas = await this.fetchUninhabitableAreas();

        // Using hardcoded assets for now based on legacy code defaults/assumptions
        // or we can try to fetch.
        // Let's try to fetch but handle errors.
        let mapImage = '/assets/map/route_1.png'; // Default from MapComponent.vue
        let avatarImage = '/assets/avatar/blue-hair.png'; // Default from MapComponent.vue

        try {
            // const assets = await this.fetchUserAssets();
            // mapImage = assets.mapImage;
            // avatarImage = assets.avatarImage;
            // this.uninhabitableAreas = await this.fetchUninhabitableAreas();
        } catch (e) {
            console.warn("Failed to fetch assets, using defaults", e);
        }

        // Load PIXI resources
        PIXI.Assets.add({ alias: 'map', src: mapImage });
        PIXI.Assets.add({ alias: 'avatar', src: avatarImage });

        await PIXI.Assets.load(['map', 'avatar']);
        this.setup();
    }

    async setup() {
        if (!this.app) return;

        // Create the map
        this.map = new PIXI.Container();
        const mapTexture = PIXI.Assets.get('map');
        const mapSprite = new PIXI.Sprite(mapTexture);
        this.map.addChild(mapSprite);
        this.map.scale.set(1.5); // Zoom the map
        // this.app.stage.addChild(this.map); // We add to camera instead

        // Create the avatar
        const avatarTexture = PIXI.Assets.get('avatar');
        // Assuming avatar is a spritesheet or single image. Legacy code treated it as a spritesheet.
        // "new PIXI.BaseTexture(avatarTexture)" is old API.
        // If it's a simple image, we might need to slice it manually or use a proper spritesheet loader.
        // For simplicity in migration, let's assume it's a single texture for now or try to slice it.

        // Legacy: new PIXI.Rectangle(i * 64, 0, 64, 64)
        const walkFrames = [];
        for (let i = 0; i < 4; i++) {
            const rect = new PIXI.Rectangle(i * 64, 0, 64, 64);
            const frame = new PIXI.Texture({ source: avatarTexture.source, frame: rect });
            walkFrames.push(frame);
        }

        this.avatar = new PIXI.AnimatedSprite(walkFrames);
        this.avatar.animationSpeed = 0.1;
        this.avatar.play();
        this.avatar.position.set(400, 300); // Center of the screen initially
        this.map.addChild(this.avatar);

        // Set initial position from API
        try {
            // const previousLocation = await this.fetchPreviousLocation();
            // this.avatar.position.set(previousLocation.x, previousLocation.y);
        } catch (e) {
            console.warn("Failed to fetch location", e);
        }

        // Set up the camera
        this.camera = new PIXI.Container();
        this.camera.addChild(this.map);
        this.app.stage.addChild(this.camera);

        // Center the camera initially
        this.updateCamera();

        console.log('Map setup complete. Map size:', mapSprite.width, 'x', mapSprite.height);
        console.log('Avatar position:', this.avatar.position);
    }

    move(direction: string) {
        if (!this.avatar || !this.app) return;

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
            // Revert move?
            return;
        }

        // Update the camera to follow the avatar
        this.updateCamera();
    }

    updateCamera() {
        if (!this.camera || !this.avatar || !this.app) return;
        this.camera.position.set(
            -this.avatar.x * 1.5 + this.app.screen.width / 2,
            -this.avatar.y * 1.5 + this.app.screen.height / 2
        );
        // Note: multiplied by scale 1.5 to center correctly relative to scaled map
    }

    isUninhabitable(x: number, y: number) {
        return this.uninhabitableAreas.some(area => area.x === x && area.y === y);
    }

    async fetchUninhabitableAreas() {
        return await ApiService.makeRequest(this.apiUrls.uninhabitable);
    }

    async fetchPreviousLocation() {
        return await ApiService.makeRequest(this.apiUrls.previousLocation);
    }

    async fetchUserAssets() {
        return await ApiService.makeRequest(this.apiUrls.userAssets);
    }

    async saveCurrentLocation() {
        if (!this.avatar) return;
        await ApiService.makeRequest(this.apiUrls.saveLocation, 'POST', { x: this.avatar.x, y: this.avatar.y });
    }

    destroy() {
        if (this.app) {
            this.app.destroy(true, { children: true, texture: true });
            this.app = null;
        }
    }
}
