import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Correctly import your router instance
import VueTheMask from 'vue-the-mask';

const app = createApp(App);

app.use(router); // Use the router instance
app.use(VueTheMask);
app.mount('#app'); // Mount the Vue app