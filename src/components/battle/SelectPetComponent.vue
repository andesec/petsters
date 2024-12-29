<template>
  <div class="select-pet-component">
    <h2>{{ m }}</h2>
    <div class="pokemon-list">
      <div v-for="pokemon in pokemonList" :key="pokemon.i" class="pokemon-card">
        <img :src="getPokemonImage(pokemon.i)" :alt="pokemon.n" class="pokemon-image" />
        <p class="pokemon-name">{{ pokemon.n }}</p>
        <button @click="selectPokemon(pokemon)" class="select-button">Select</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    m: {
      type: String,
      required: true,
    },
    pokemonList: {
      type: Array,
      required: true,
    },
  },
  methods: {
    selectPokemon(pokemon) {
      this.$emit('pokemon-selected', pokemon);
    },
    getPokemonImage(id) {
      // Replace with actual logic that retrieves Pokémon images based on ID
      return `/assets/pokemon/${id}.png`;
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
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  width: 120px;
}
.pokemon-image {
  width: 100px;
  height: 100px;
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
  border-radius: 4px;
  cursor: pointer;
}
.select-button:hover {
  background-color: #0056b3;
}
</style>