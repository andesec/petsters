<template>
  <div>
    <h1>Profile</h1>
    <form @submit.prevent="saveProfile">
      <div class="form-group">
        <label for="name">Name:</label>
        <input id="name" v-model="profile.name" />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input id="email" v-model="profile.email" type="email" />
      </div>
      <div class="form-group">
        <label for="age">Age:</label>
        <input id="age" v-model="profile.age" type="number" />
      </div>
      <button type="submit">Save</button>
    </form>
  </div>
</template>

<script>
import ApiService from '../services/ApiService';

export default {
  data() {
    return {
      profile: {
        name: '',
        email: '',
        age: '',
      },
    };
  },
  async mounted() {
    try {
      const response = await ApiService.makeRequest('/profile', 'GET');
      this.profile = response;
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  },
  methods: {
    async saveProfile() {
      try {
        await ApiService.makeRequest('/profile', 'POST', this.profile);
        alert('Profile saved successfully!');
      } catch (error) {
        console.error('Error saving profile:', error);
      }
    },
  },
};
</script>

<style scoped>
.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  margin-top: 15px;
}
</style>