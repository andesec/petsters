<template>
  <div class="info-center-content">
    <h2>#{{ this.p.i }} - {{ this.p.n }}</h2>
    <img :src="ImageService.getImageURLForPokemon(this.p.i)" :alt="this.p.n" class="pet-image"/>
    <p>{{ this.p.f }}</p>
    <h4>Type:</h4>
    <div class="type-squares">
      <div v-for="(type, i) in this.p.t" :key="i" :style="{ backgroundColor: TypeService.getTypeColor(type) }" class="type-square" :title="type">{{ type }}</div>
    </div>
    <h4>Abilities:</h4>
  </div>



</template>

<script>
import PokemonService from "@/services/PokemonService.js";
import ImageService from "@/services/ImageService.js";
import TypeService from "@/services/TypeService.js";

export default {
  name: "PokemonInfoComponent",
  computed: {
    TypeService() {
      return TypeService
    },
    ImageService() {
      return ImageService
    }
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  mounted() {
    console.log("PokemonInfoComponent mounted")
    this.loadPokemonInfo()
  },
  methods: {
    async loadPokemonInfo() {
      this.p = await PokemonService.loadPokemonInfo(this.id)
      console.log(this.p)
    }
  },
  data() {
    return {
      p: {},
    }
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