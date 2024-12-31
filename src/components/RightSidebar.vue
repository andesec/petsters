<template>
  <div class="right-sidebar">
    <JoystickComponent v-if="$route.name === 'Maps'"/>
    <BattleUpdatesComponent v-if="$route.name === 'Battle'" />
  </div>
</template>

<script>
import eventBus from '../eventBus';
import BattleUpdatesComponent from "@/components/battle/BattleUpdatesComponent.vue";
import JoystickComponent from "@/components/map/JoystickComponent.vue";

export default {
  components: {JoystickComponent, BattleUpdatesComponent},
  methods: {
    sendUpdate() {
      eventBus.emit('update-from-right', { message: 'New update from Right Sidebar' });
    },
    receiveUpdate(update) {
      console.log(update);
    }
  },
};
</script>

<style scoped>
.right-sidebar {
  width: 25%;
  background-color: #e0e0e0;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2); /* Adds 3D effect */
}

</style>