<template>
  <div class="type-squares">
    <div v-for="(type, i) in types" :key="i" :style="{ backgroundColor: TypeService.getTypeColor(type) }" class="type-square" :title="type">{{ type }}</div>
  </div>
</template>

<script setup>
import TypeService from "@/services/TypeService.js";
import {onMounted, ref} from "vue";

// Reactive States / Props
const types = ref([]);

// Lifecycle hook
onMounted(async () => {
  console.log("TypePreset mounted");
});

</script>

<style scoped>

</style>