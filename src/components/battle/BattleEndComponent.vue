<template>
  <h4>{{ battle.m }}</h4>
  <p v-for="t in finalData.ts" :key="t.id">{{ t }}</p>
  <button @click="goBackToMap">Back to Map</button>
</template>

<style scoped>

</style>

<script>
import battleService from "@/services/BattleService.js";

export default {
  props: {
    battle: {
      type: Object,
      required: true,
    },
  },
  async mounted() {
    const finalData = await battleService.continueBattle({cs: 9})

  },
  methods: {
    goBackToMap() {
      this.$router.push({ name: 'Maps' });
    },
  },
  data() {
    return {
      finalData: {},
    }
  },
};
</script>