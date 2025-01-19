import {Application, Assets, Container, Sprite} from 'pixi.js';

export default class World {
    static initTest(containerId, mapSprite) {
        console.log(mapSprite)
        const containerElement = document.getElementById(containerId);
        if (!containerElement) {
            console.error('Container element not found!');
            return;
        }

        const app = new Application();

        app.init({ background: 'rgba(0,0,0,0.81)', resizeTo: containerElement}).then(() => {
            containerElement.appendChild(app.canvas);

            Assets.add({alias: 'map', src: mapSprite})

            Assets.backgroundLoad(['map'])

            Assets.load('map').then((texture) => {
                let isEggHead = true;

                const map = new Sprite(texture);
                map.anchor.set(0, 0);
                map.scale.set(0.5, 0.5);
                map.position.set(0, 0);

                console.log(app.screen.width)
                console.log(app.screen.height)
                console.log(app)
                console.log(app.screen)

                // map.x = app.screen.width / 2;
                // map.y = app.screen.height / 2;

                app.stage.addChild(map);
            });
        });
    }

}