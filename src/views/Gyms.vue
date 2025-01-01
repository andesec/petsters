<template>
  <div class="gyms">
    <h2>Gyms</h2>
    <div class="gym-container">
      <div
          v-for="gym in gyms"
          :key="gym.i"
          class="gym-card"
          :class="getGymClass(gym.t)"
      >
        <a :href="'/api/battle/initiate/' + gym.gi" class="gym-link">
          <div class="gym-images">
            <img :src="gym.badgeImage" :alt="gym.m + ' badge'" class="badge-image" />
            <img :src="gym.image" :alt="gym.l" class="leader-image" />
          </div>
          <div class="gym-details">
            <h3>{{ gym.city }}</h3>
            <p>{{ gym.m }} Badge</p>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import ApiService from "@/services/ApiService";

export default {
  name: "Gyms",
  data() {
    return {
      gyms: [],
      typeStyles: {
        Normal: "normal-style",
        Fire: "fire-style",
        Water: "water-style",
        Grass: "grass-style",
        Electric: "electric-style",
        Ice: "ice-style",
        Fighting: "fighting-style",
        Poison: "poison-style",
        Ground: "ground-style",
        Flying: "flying-style",
        Psychic: "psychic-style",
        Bug: "bug-style",
        Rock: "rock-style",
        Ghost: "ghost-style",
        Dragon: "dragon-style",
        Dark: "dark-style",
        Steel: "steel-style",
        Fairy: "fairy-style",
      },
    };
  },
  methods: {
    getGymClass(type) {
      return this.typeStyles[type] || "default-style";
    },
  },
  async created() {
    try {
      this.gyms = await ApiService.makeRequest("/gym");
      console.log(this.gyms);
    } catch (error) {
      console.error("Failed to fetch gym data:", error);
    }
  },
};
</script>

<style scoped>
.gyms {
  padding: 10px;
}

.gym-container {
  margin-top: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.gym-card {
  flex: 1 1 calc(50% - 16px);
  border: 2px solid;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.gym-link {
  text-decoration: none;
  color: inherit;
  display: block;
  padding: 10px;
}

.gym-images {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.badge-image,
.leader-image {
  width: 48%;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.gym-details {
  padding: 8px 0;
  text-align: center;
}

.gym-details h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.gym-details p {
  margin: 8px 0 0;
  color: #666;
  font-size: 14px;
}

/* Type-Specific Styles */
.normal-style {
  border-color: #a8a878;
  background-color: #f8f8f0;
}

.fire-style {
  border-color: #f08030;
  background-color: #fddfdf;
}

.water-style {
  border-color: #6890f0;
  background-color: #def3fd;
}

.grass-style {
  border-color: #78c850;
  background-color: #e0f8d0;
}

.electric-style {
  border-color: #f8d030;
  background-color: #fff8dc;
}

.ice-style {
  border-color: #98d8d8;
  background-color: #f0ffff;
}

.fighting-style {
  border-color: #c03028;
  background-color: #fdd5d5;
}

.poison-style {
  border-color: #a040a0;
  background-color: #f8d4f8;
}

.ground-style {
  border-color: #e0c068;
  background-color: #f8e0b8;
}

.flying-style {
  border-color: #a890f0;
  background-color: #eef1fa;
}

.psychic-style {
  border-color: #f85888;
  background-color: #ffe6ed;
}

.bug-style {
  border-color: #a8b820;
  background-color: #f8ffd0;
}

.rock-style {
  border-color: #b8a038;
  background-color: #f8e8d0;
}

.ghost-style {
  border-color: #705898;
  background-color: #e8d8f8;
}

.dragon-style {
  border-color: #7038f8;
  background-color: #ece0ff;
}

.dark-style {
  border-color: #705848;
  background-color: #e8d8c8;
}

.steel-style {
  border-color: #b8b8d0;
  background-color: #f0f0f8;
}

.fairy-style {
  border-color: #ee99ac;
  background-color: #ffe3f3;
}

/* Default Fallback Style */
.default-style {
  border-color: #ccc;
  background-color: #f9f9f9;
}
</style>