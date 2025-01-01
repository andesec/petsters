<template>
  <h4>{{ battle.m }}</h4>

</template>

<style scoped>

</style>

<script>
export default {
  props: {
    battle: {
      type: Object,
      required: true,
    },
  },
  methods: {
    selectPokemon(pokemon) {
      this.$emit('pokemon-selected', pokemon);
    },
    getPokemonImage(id) {
      // Replace with actual logic that retrieves Pokémon images based on ID
      return `/assets/mon/nor/${id}.svg`;
    },
  },
};
</script>