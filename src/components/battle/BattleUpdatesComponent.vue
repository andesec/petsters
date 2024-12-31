<template>
    <h2>Battle Updates</h2>
  <div class="sidebar-backdrop">
    <ul>
      <li v-for="(summary, index) in turnSummary" :key="index">
        {{ summary }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import eventBus from '@/eventBus';

export default defineComponent({
  name: 'BattleUpdatesComponent',
  data() {
    return {
      turnSummary: []
    };
  },
  mounted() {
    eventBus.on('battle-update', this.showBattleUpdates);
  },
  beforeUnmount() {
    eventBus.off('battle-update', this.showBattleUpdates);
  },
  // setup() {
  //   // return battleService;
  //   // const updates = battleService.battleState.ts;
  //
  //   // // Watch for updates in the battle array
  //   // onMounted(() => {
  //   //   const interval = setInterval(() => {
  //   //     if (updates.length > 0) {
  //   //       battleUpdates.length = 0; // Clear the updates
  //   //     }
  //   //   }, 1000);
  //   //
  //   //   // Clean up interval on component unmount
  //   //   return () => clearInterval(interval);
  //   // });
  //
  //   // return { updates };
  // },
  methods: {
    showBattleUpdates(ts: string[]) {
      console.log('turnSummary:', this.turnSummary);
      this.turnSummary = ts;
      console.log('turnSummary:', this.turnSummary);
    }
  }
});
</script>

<style scoped>
.sidebar-backdrop {
  width: 100%;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

h3 {
  margin-top: 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 8px;
  font-size: 14px;
}
</style>