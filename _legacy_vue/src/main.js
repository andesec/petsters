import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Correctly import your router instance
import VueTheMask from 'vue-the-mask';

const app = createApp(App);

app.config.errorHandler = (err, vm, info) => {
    console.error('Vue Error:', err, info);
};

app.config.warnHandler = (msg, vm, trace) => {
    console.warn('Vue Warning:', msg, trace);
};

app.use(router); // Use the router instance
app.use(VueTheMask);
app.mount('#app'); // Mount the Vue app
