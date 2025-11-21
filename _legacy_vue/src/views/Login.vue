<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <input v-model="username" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
// import AuthService from '../services/AuthService';
import config from '../config';

export default {
  data() {
    return {
      username: '',
      password: '',
      error: '',
    };
  },
  // methods: {
    // async login() {
    //   if (config.disableLogin) {
    //     this.$router.push('/battle');
    //     return;
    //   }
    //   try {
    //     await AuthService.login(this.username, this.password);
    //     this.$router.push('/battle');
    //   } catch (e) {
    //     this.error = e.message;
    //   }
    // },
  // },
};
</script>