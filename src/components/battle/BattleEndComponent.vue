<template>
  <h4>{{ battle.m }}</h4>
  <br>
  <p v-for="t in finalData.ts" :key="t.id">{{ t }}</p>
  <br>
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
    t: {
      type: String,
      required: true,}
  },
  async mounted() {
    console.log("ending battle now")
    this.finalData = await battleService.continueBattle(this.t, {cs: 9})

  },
  methods: {
    goBackToMap() {
      this.$router.push({ name: 'Map' });
    },
  },
  data() {
    return {
      finalData: {},
    }
  },
};
</script>