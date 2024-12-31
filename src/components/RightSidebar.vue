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
  background-color: white;
  border: 1px solid lightslategray;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 10px;
  overflow-y: auto; /* Enable scrolling if there are too many updates */
}

</style>