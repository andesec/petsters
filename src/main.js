import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Correctly import your router instance

const app = createApp(App);

app.use(router); // Use the router instance
app.mount('#app'); // Mount the Vue app