<template>
  <div class="select-pet-component">
    <h4>{{ m }}</h4>
    <br>
    <div class="pokemon-list">
      <div v-for="o in os" :key="o.i" class="pokemon-card">
        <img :src="imageService.getImageURLForPokemon(o.o)" :alt="o.n" class="pokemon-image" />
        <p class="pokemon-name clickable-text" @click="UXService.showInfo('pk', o.o)">{{ o.n }}</p>
        <button @click="selectPokemon(o)" class="select-button">Select</button>
      </div>
    </div>
  </div>
</template>

<script>
import imageService from "@/services/ImageService.js";
import UXService from "@/services/UXService.js";

export default {
  computed: {
    UXService() {
      return UXService
    },
    imageService() {
      return imageService
    },
  },
  props: {
    m: {
      type: String,
      required: true,
    },
    os: {
      type: Array,
      required: true,
    },
  },
  methods: {
    selectPokemon(pokemon) {
      this.$emit('pokemon-selected', pokemon);
    },
  },
};
</script>

<style scoped>
.select-pet-component {
  text-align: center;
}
.pokemon-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}
.pokemon-card {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  width: 120px;
}
.pokemon-image {
  width: auto;
  height: 90px;
  object-fit: contain;
}
.pokemon-name {
  margin: 8px 0;
  font-weight: bold;
}
.select-button {
  padding: 6px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}
.select-button:hover {
  background-color: #0056b3;
}
</style>