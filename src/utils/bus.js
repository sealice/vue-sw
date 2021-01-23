import mitt from 'mitt';

const bus = mitt();

bus.once = (type, handler) => {
    const wrappedHandler = evt => {
        handler(evt);
        bus.off(type, wrappedHandler);
    };
    bus.on(type, wrappedHandler);
    return wrappedHandler;
};

export default bus;
