import Vue from 'vue';
import App from './App.vue';
import filter from './filter';
import router from './router';
import store from './store';
import './registerServiceWorker';
import './service';

Vue.use(filter);

new Vue(
    Object.assign(App, {
        store,
        router,
    })
).$mount('#app');
