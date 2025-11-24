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
    targetCameraPosition: { x: number; y: number };
    cameraPosition: { x: number; y: number };
    apiUrls: {
        uninhabitable: string;
        previousLocation: string;
        saveLocation: string;
        userAssets: string;
    };

    // Animation textures
    textures: {
        down: PIXI.Texture[];
        left: PIXI.Texture[];
        right: PIXI.Texture[];
        up: PIXI.Texture[];
    } | null = null;

    currentDirection: 'down' | 'left' | 'right' | 'up' = 'down';
    isMoving: boolean = false;

    constructor(containerId: string) {
        this.containerId = containerId;
        this.app = null;
        this.map = null;
        this.avatar = null;
        this.camera = null;
        this.uninhabitableAreas = [];
        this.currentPosition = { x: 0, y: 0 };
        this.targetCameraPosition = { x: 0, y: 0 };
        this.cameraPosition = { x: 0, y: 0 };

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

        // Get container dimensions - use actual size to fill available space
        const containerWidth = container.clientWidth || 800;
        const containerHeight = container.clientHeight || 600;

        this.app = new PIXI.Application();
        await this.app.init({
            width: containerWidth,
            height: containerHeight,
            backgroundAlpha: 0, // Make background transparent
            resizeTo: container // Automatically resize to container
        });

        container.appendChild(this.app.canvas);

        // Default assets
        let mapImage = '/assets/map/route_1.png';
        let avatarImage = '/assets/avatar/blue-hair.png';

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
        mapSprite.roundPixels = true;

        // Create the avatar
        const avatarTexture = PIXI.Assets.get('avatar');

        // Slice the sprite sheet
        // Image size is 96x128. 4 rows, 3 columns.
        // Frame size: 32x32
        const frameWidth = 32;
        const frameHeight = 32;
        const framesPerRow = 3;

        this.textures = {
            down: [],
            left: [],
            right: [],
            up: []
        };

        // Helper to create frames from specific coordinates (Row, Col) 0-indexed
        const createFrames = (idle: { r: number, c: number }, walk: { r: number, c: number }[]) => {
            const sequence = [
                walk[0], // Walk 1
                idle,    // Idle
                walk[1], // Walk 2
                idle     // Idle
            ];

            return sequence.map(pos => {
                const rect = new PIXI.Rectangle(pos.c * frameWidth, pos.r * frameHeight, frameWidth, frameHeight);
                return new PIXI.Texture({ source: avatarTexture.source, frame: rect });
            });
        };

        // User provided mapping (converted to 0-indexed):
        // Up: idle = R1C1 (0,0), walk = [R1C3 (0,2), R4C2 (3,1)]
        this.textures.up = createFrames({ r: 0, c: 0 }, [{ r: 0, c: 2 }, { r: 3, c: 1 }]);

        // Down: idle = R2C3 (1,2), walk = [R3C3 (2,2), R4C3 (3,2)]
        this.textures.down = createFrames({ r: 1, c: 2 }, [{ r: 2, c: 2 }, { r: 3, c: 2 }]);

        // Left: idle = R3C1 (2,0), walk = [R2C1 (1,0), R4C1 (3,0)]
        this.textures.left = createFrames({ r: 2, c: 0 }, [{ r: 1, c: 0 }, { r: 3, c: 0 }]);

        // Right: idle = R1C2 (0,1), walk = [R2C2 (1,1), R3C2 (2,1)]
        this.textures.right = createFrames({ r: 0, c: 1 }, [{ r: 1, c: 1 }, { r: 2, c: 1 }]);

        // Initialize avatar with 'down' animation
        this.avatar = new PIXI.AnimatedSprite(this.textures.down);
        this.avatar.animationSpeed = 0.15;
        this.avatar.roundPixels = true;
        this.avatar.loop = true;
        this.avatar.anchor.set(0.5);
        this.avatar.position.set(400, 300);

        // Start idle (stop animation, show idle frame which is index 1 in our sequence? 
        // Actually, if we stop, we should show the standing frame.
        // In our sequence [0, 1, 2, 1], index 1 is the standing frame.
        this.avatar.gotoAndStop(1);

        this.map.addChild(this.avatar);

        // Set initial position from API if available
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
        if (this.camera) {
            this.camera.position.set(this.targetCameraPosition.x, this.targetCameraPosition.y);
            this.cameraPosition = { x: this.targetCameraPosition.x, y: this.targetCameraPosition.y };
        }

        // Add ticker for smooth camera movement
        this.app.ticker.add(() => this.smoothCamera());

        console.log('Map setup complete. Map size:', mapSprite.width, 'x', mapSprite.height);
    }

    move(direction: string) {
        if (!this.avatar || !this.app || !this.textures) return;

        const speed = 1.5; // Reduced from 3 to half speed
        const dir = direction.toLowerCase() as 'down' | 'left' | 'right' | 'up';

        // Update direction and textures if changed
        if (this.currentDirection !== dir) {
            this.currentDirection = dir;
            this.avatar.textures = this.textures[dir];
            this.avatar.gotoAndPlay(0);
        } else if (!this.avatar.playing) {
            this.avatar.gotoAndPlay(0);
        }

        this.isMoving = true;

        // Calculate new position
        let newX = this.avatar.x;
        let newY = this.avatar.y;

        switch (dir) {
            case 'up':
                newY -= speed;
                break;
            case 'down':
                newY += speed;
                break;
            case 'left':
                newX -= speed;
                break;
            case 'right':
                newX += speed;
                break;
        }

        // Check for uninhabitable areas
        if (this.isUninhabitable(newX, newY)) {
            // console.warn('Cannot move to this area.');
            return;
        }

        // Check map bounds
        const mapWidth = this.map!.width / this.map!.scale.x; // Unscaled width
        const mapHeight = this.map!.height / this.map!.scale.y; // Unscaled height

        // Simple bounds check (assuming map starts at 0,0)
        // Adjust for anchor 0.5 (32px approx width, so 16px half-width)
        const margin = 16;
        if (newX < margin) newX = margin;
        if (newY < margin) newY = margin;
        if (newX > mapWidth - margin) newX = mapWidth - margin;
        if (newY > mapHeight - margin) newY = mapHeight - margin;

        this.avatar.x = newX;
        this.avatar.y = newY;

        // Update the camera to follow the avatar
        this.updateCamera();
    }

    stop() {
        if (!this.avatar || !this.textures) return;

        this.isMoving = false;
        this.avatar.stop();
        // Reset to idle frame (index 1 in our sequence [0, 1, 2, 1])
        this.avatar.gotoAndStop(1);
    }

    updateCamera() {
        if (!this.camera || !this.avatar || !this.app || !this.map) return;

        const screenWidth = this.app.screen.width;
        const screenHeight = this.app.screen.height;
        const mapScale = this.map.scale.x;
        const mapWidth = this.map.width; // Scaled width
        const mapHeight = this.map.height; // Scaled height

        // Calculate target camera position (centered on avatar)
        // Camera position is negative because we move the world opposite to avatar
        let targetX = -this.avatar.x * mapScale + screenWidth / 2;
        let targetY = -this.avatar.y * mapScale + screenHeight / 2;

        // Clamp camera to map bounds
        // Max X is 0 (left edge aligned)
        // Min X is screenWidth - mapWidth (right edge aligned)

        const minX = screenWidth - mapWidth;
        const maxX = 0;
        const minY = screenHeight - mapHeight;
        const maxY = 0;

        // If map is smaller than screen, center it
        if (mapWidth < screenWidth) {
            targetX = (screenWidth - mapWidth) / 2;
        } else {
            targetX = Math.max(minX, Math.min(maxX, targetX));
        }

        if (mapHeight < screenHeight) {
            targetY = (screenHeight - mapHeight) / 2;
        } else {
            targetY = Math.max(minY, Math.min(maxY, targetY));
        }

        this.targetCameraPosition = { x: targetX, y: targetY };
    }

    smoothCamera() {
        if (!this.camera) return;

        const lerp = 0.2; // Adjust for smoothness (lower is slower/smoother)

        this.cameraPosition.x += (this.targetCameraPosition.x - this.cameraPosition.x) * lerp;
        this.cameraPosition.y += (this.targetCameraPosition.y - this.cameraPosition.y) * lerp;

        this.camera.x = Math.round(this.cameraPosition.x);
        this.camera.y = Math.round(this.cameraPosition.y);
    }

    isUninhabitable(x: number, y: number) {
        return this.uninhabitableAreas.some(area => {
            // Simple distance check or grid check
            const dist = Math.sqrt(Math.pow(area.x - x, 2) + Math.pow(area.y - y, 2));
            return dist < 32; // Collision radius
        });
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
