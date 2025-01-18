<template>
  <div class="info-center-content">
    <h2>#{{ p.i }} - {{ p.n }}</h2>
    <img :src="ImageService.getImageURLForPokemon(p.i)" :alt="p.n" class="pet-image"/>
    <p>{{ p.f }}</p>
    <h4>Type:</h4>
    <div class="type-squares">
      <div v-for="(type, i) in p.t" :key="i" :style="{ backgroundColor: TypeService.getTypeColor(type) }" class="type-square" :title="type">{{ type }}</div>
    </div>
    <h4>Abilities:</h4>
  </div>



</template>

<script>
import PokemonService from "@/services/PokemonService.js";
import ImageService from "@/services/ImageService.js";
import TypeService from "@/services/TypeService.js";
import {reactive, watchEffect} from "vue";

export default {
  name: "PokemonInfoComponent",
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const p = reactive({}); // Reactive state for Pokemon data

    // Fetch Pokemon info whenever `props.id` changes
    watchEffect(async () => {
      try {
        const data = await PokemonService.loadPokemonInfo(props.id);
        Object.assign(p, data); // Update the reactive object with the fetched data
        console.log(p);
      } catch (error) {
        console.error("Error loading Pokemon info:", error);
      }
    });

    return {
      p,
      TypeService,
      ImageService,
    };
  },
}
</script>

<style scoped>
.info-center-content img {
  width: 90%;
  height: auto;
  margin: 20px;
}
</style>