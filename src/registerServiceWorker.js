/* eslint-disable no-console */

import { register } from 'register-service-worker';
import { bus } from '@/utils/bus';

if (process.env.NODE_ENV === 'production') {
    register(`${process.env.BASE_URL}service-worker.js`, {
        registered() {
            console.log('Service worker has been registered.');
        },
        cached() {
            console.log('Content has been cached for offline use.');
        },
        updatefound() {
            console.log('New content is downloading.');
        },
        updated(registration) {
            console.log('New content is available; please refresh.');
            bus.$emit('updated-version', registration);
        },
        offline() {
            console.log('No internet connection found. App is running in offline mode.');
        },
        error(error) {
            console.error('Error during service worker registration:', error);
        },
    });
}
