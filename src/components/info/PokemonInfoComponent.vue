<template>
  <div class="info-center-content">
    <h2>#{{ p.i }} - {{ p.n }}</h2>
    <img :src="ImageService.getImageURLForPokemon(p.i)" :alt="p.n" class="pet-image"/>
    <p>{{ p.f }}</p>
    <h3>Type:</h3>
    <div class="type-squares">
      <div v-for="(type, i) in p.t" :key="i" :style="{ backgroundColor: TypeService.getTypeColor(type) }" class="type-square" :title="type">{{ type }}</div>
    </div>
    <!-- Abilities Section -->
    <h3>Abilities:</h3>
    <div class="abilities-list">
      <div v-for="(ability, index) in p.a" :key="index" class="ability-item">
        <p style="cursor: pointer" :title="ability.d" class="clickable-text" @click="UXService.showInfo('a',ability.i)">- {{ ability.t }}</p>
      </div>
    </div>

    <!-- Moves Table -->
    <h3>Moves:</h3>
    <table class="moves-table">
      <thead>
      <tr>
        <th>Move</th>
        <th>At Level</th>
        <th>Power</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(action, index) in p.ac" :key="index" :title="'Type: ' + action.t" :style="{ backgroundColor: TypeService.getTypeColor(action.t), color: 'white' }">
        <td class="clickable-text" @click="UXService.showInfo('m',action.i)">{{ action.a }}</td>
        <td>{{ action.l }}</td>
        <td>{{ action.p }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import PokemonService from "@/services/PokemonService.js";
import ImageService from "@/services/ImageService.js";
import TypeService from "@/services/TypeService.js";
import {reactive, watchEffect} from "vue";
import UXService from "@/services/UXService.js";

// Props
const props = defineProps({
  id: {
    type: String,
    required: true
  },
});

// Reactive state for Pokémon data
const p = reactive({});

// Reactive state for abilities toggle
const expandedAbilities = reactive([]);

// Fetch Pokemon info whenever `props.id` changes
watchEffect(async () => {
  try {
    const data = await PokemonService.loadPokemonInfo(props.id);
    Object.assign(p, data); // Update the reactive object with the fetched data

    // Initialize expandedAbilities to track abilities toggle state
    expandedAbilities.value = p.a ? new Array(p.a.length).fill(false) : [];
  } catch (error) {
    console.error("Error loading Pokemon info:", error);
  }
});
</script>

<style scoped>
.info-center-content img {
  width: 90%;
  max-height: 400px;
  margin: 20px;
}

.moves-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.moves-table th,
.moves-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.moves-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}
</style>