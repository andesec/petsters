import mitt from 'mitt';

type Events = {
    'show-info': { v: string; i: string };
    [key: string]: any;
};

const eventBus = mitt<Events>();

export default eventBus;
