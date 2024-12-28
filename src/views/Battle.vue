<template>
  <div>
    <h1>Battle</h1>
    <div v-if="battleState === 'SELECT_ACTION'">
      <h2>Select an Action</h2>
      <button @click="performAction('attack')">Attack</button>
      <button @click="performAction('defend')">Defend</button>
      <button @click="performAction('use-item')">Use Item</button>
    </div>
    <div v-else-if="battleState === 'SELECT_PET'">
      <h2>Select a Pet</h2>
      <div class="pet-container">
        <div v-for="pet in pets" :key="pet.id" class="pet-card">
          <img :src="pet.image" alt="Pet" />
          <p>{{ pet.name }}</p>
          <button @click="selectPet(pet)">Select</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApiService from '../services/ApiService';
import eventBus from "@/eventBus.js";

export default {
  data() {
    return {
      battleState: 'SELECT_PET', // Simulate state for development
      pets: [
        { id: 1, name: 'Charmander', image: '/assets/charmander.png' },
        { id: 2, name: 'Squirtle', image: '/assets/squirtle.png' },
      ],
    };
  },
  mounted() {
    eventBus.on('update-from-right', this.updateFromRight);
  },
  beforeUnmount() {
    eventBus.off('update-from-right', this.updateFromRight);
  },
  methods: {
    async performAction(action) {
      console.log(`Performing Action: ${action}`);
      // Logic to send action to the API
    },
    async selectPet(pet) {
      console.log(`Selected Pet: ${pet.name}`);
      // Logic to select pet in the battle
    },
    async startBattle() {
      const response = await ApiService.initiateBattle('wild', { wi: 1, l: 5, ai: 1 });
      this.battleState = response.state; // Example state
      this.pets = response.pets || [];
    },
    updateFromRight(message) {
      console.log(message);
    }
  },
};
</script>

<style scoped>
/* Add themed styles */
</style>