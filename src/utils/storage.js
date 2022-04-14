export default function storage(engine) {
    return Object.freeze({
        remove(key) {
            engine.removeItem(key);
        },
        set(key, value) {
            engine.setItem(key, JSON.stringify(value));
        },
        get(key) {
            let value = engine.getItem(key);
            if (value) {
                /* eslint no-empty: "off" */
                try {
                    value = JSON.parse(value);
                } catch (err) {}
            }

            return value;
        },
    });
}

export const session = storage(sessionStorage);
export const local = storage(localStorage);
