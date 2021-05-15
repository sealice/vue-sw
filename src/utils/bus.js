import mitt from 'mitt';

const bus = mitt();

bus.once = (type, handler) => {
    const wrappedHandler = (eventOrType, event) => {
        bus.off(type, wrappedHandler);
        handler(eventOrType, event);
    };
    bus.on(type, wrappedHandler);
    return wrappedHandler;
};

export default bus;
