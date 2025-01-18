<template>
  <div class="info-center-content">
    <h2>#{{ p.i }} - {{ p.n }}</h2>
    <img :src="ImageService.getImageURLForPokemon(p.i)" :alt="p.n" class="pet-image"/>
    <p>{{ p.f }}</p>
    <h4>Type:</h4>
    <div class="type-squares">
      <div v-for="(type, i) in p.t" :key="i" :style="{ backgroundColor: TypeService.getTypeColor(type) }" class="type-square" :title="type">{{ type }}</div>
    </div>
    <!-- Abilities Section -->
<!--    <h4>Abilities:</h4>-->
<!--    <div class="abilities-list">-->
<!--      <div v-for="(ability, index) in p.a" :key="index" class="ability-item">-->
<!--        <h5 @click="toggleAbility(index)" class="ability-name">{{ ability.name }}</h5>-->
<!--        <p v-if="expandedAbilities[index]" class="ability-description">-->
<!--          {{ ability.description }}-->
<!--        </p>-->
<!--      </div>-->
<!--    </div>-->

<!--    &lt;!&ndash; Moves Table &ndash;&gt;-->
<!--    <h4>Moves:</h4>-->
<!--    <table class="moves-table">-->
<!--      <thead>-->
<!--      <tr>-->
<!--        <th>Move</th>-->
<!--        <th>Level</th>-->
<!--      </tr>-->
<!--      </thead>-->
<!--      <tbody>-->
<!--      <tr v-for="(move, index) in p.m" :key="index">-->
<!--        <td>{{ move.name }}</td>-->
<!--        <td>{{ move.level }}</td>-->
<!--      </tr>-->
<!--      </tbody>-->
<!--    </table>-->
  </div>
</template>

<script setup>
import PokemonService from "@/services/PokemonService.js";
import ImageService from "@/services/ImageService.js";
import TypeService from "@/services/TypeService.js";
import {reactive, watchEffect} from "vue";

// Props
const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  pokemon: {
    type: Object,
    required: false
  }
});

// Reactive state for Pokémon data
const p = reactive({});

// Fetch Pokemon info whenever `props.id` changes
watchEffect(async () => {
  try {
    const data = (props.pokemon !== undefined) ? props.pokemon : await PokemonService.loadPokemonInfo(props.id);
    Object.assign(p, data); // Update the reactive object with the fetched data
  } catch (error) {
    console.error("Error loading Pokemon info:", error);
  }
});
</script>

<style scoped>
.info-center-content img {
  width: 90%;
  height: auto;
  margin: 20px;
}
</style>