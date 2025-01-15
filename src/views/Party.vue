<template>
  <h2>Your Current Party</h2>
  <br>
  <div class="party-container">
    <div v-for="(p, index) in pets" :key="p.i" class="pet-card">
      <div class="card-left">
        <img :src="imageService.getImageURLForPokemon(p.o)" :alt="p.n" class="pet-image" />
        <div class="pet-details">
          <div class="pet-name">{{ p.n }}</div>
          <div class="pet-level">Level: {{ p.l }}</div>
          <div class="hp-bar-container">
            <progress :value="p.h" :max="p.t" class="hp-bar"></progress>
            <span class="hp-text">{{ p.h }}/{{ p.t }}</span>
          </div>
        </div>
      </div>
      <div class="card-right">
        <div v-for="action in p.a" :key="action.i" class="pet-action">
          {{ action.a }}
        </div>
      </div>
    </div>
    <button
        v-if="sequenceChanged"
        class="save-button"
        @click="saveSequence"
    >
      Save Sequence
    </button>
  </div>
</template>

<script>
import ApiService from "@/services/ApiService";
import imageService from "@/services/ImageService.js";

export default {
  computed: {
    imageService() {
      return imageService
    }
  },
  data() {
    return {
      pets: [],
      sequenceChanged: false,
    };
  },
  methods: {
    async fetchParty() {
      try {
        const response = await ApiService.makeRequest("/party");
        this.pets = response.p;
      } catch (error) {
        console.error("Error fetching party:", error);
      }
    },
    saveSequence() {
      const updatedSequence = this.pets.map(pet => pet.i);
      ApiService.makeRequest("/party/update-sequence", "POST", updatedSequence)
          .then(() => {
            this.sequenceChanged = false;
            alert("Sequence saved successfully!");
          })
          .catch(error => {
            console.error("Error saving sequence:", error);
          });
    },
  },
  mounted() {
    this.fetchParty();
  },
};
</script>

<style scoped>
.party-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.pet-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
}
.card-left {
  display: flex;
  gap: 16px;
}
.pet-image {
  width: 100px;
  height: 100px;
}
.pet-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.hp-bar-container {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.hp-bar {
  flex-grow: 1; /* Ensures the bar takes up available space */
  height: 20px; /* Adjust height for better visibility */
  appearance: none;
  -webkit-appearance: none;
  background-color: #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ccc; /* Optional border for better visuals */
}

.hp-bar::-webkit-progress-bar {
  background-color: #e0e0e0;
  border-radius: 8px;
}

.hp-bar::-webkit-progress-value {
  background-color: #28a745;
  border-radius: 8px;
  transition: width 0.2s ease; /* Smooth animation for updates */
}

.hp-bar::-moz-progress-bar {
  background-color: #28a745;
  border-radius: 8px;
  transition: width 0.2s ease;
}

.hp-text {
  font-size: 14px;
  color: #333;
  white-space: nowrap; /* Prevent text from wrapping */
}
.card-right {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.save-button {
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.save-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>