<template>
  <div style="">
    <ul v-for="sr in searchResults.r">
      <p class="clickable-text" @click="UXService.showInfo(searchResults.t, sr.i)">- {{sr.n}}</p>
    </ul>
  </div>
</template>

<script setup>
import UXService from "@/services/UXService.js";

const props = defineProps({
  searchResults: {
    type: Object,
    required: true
  }
});

console.log(props.searchResults);
</script>

<style scoped>
.info-center-content img {
  width: 90%;
  height: auto;
  margin: 20px;
}
</style>