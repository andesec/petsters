<template>
  <h3>Details of {{id}}</h3>
  <h3>{{pet.n}}</h3>
  <br>


</template>

<script setup>
import {reactive, watchEffect} from "vue";
import PetsterService from "@/services/PetsterService.js";
import TypeService from "@/services/TypeService.js";
import ImageService from "@/services/ImageService.js";

// Props
const props = defineProps({
  id: {
    type: Number,
    required: true
  }
});

// Reactive state for Pokémon data
const pet = reactive({});

// Fetch Pokemon info whenever `props.id` changes
watchEffect(async () => {
  try {
    const data = await PetsterService.loadPetInfo(props.id);
    Object.assign(pet, data); // Update the reactive object with the fetched data
    console.log(pet);
  } catch (error) {
    console.error("Error loading Pokemon info:", error);
  }
});
</script>

<style scoped>

</style>