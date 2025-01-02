<template>
  <div class="right-sidebar">
    <JoystickComponent v-if="$route.name === 'Map'"/>
    <BattleUpdatesComponent v-if="$route.name === 'Battle'" />
  </div>
</template>

<script>
import BattleUpdatesComponent from "@/components/battle/BattleUpdatesComponent.vue";
import JoystickComponent from "@/components/map/JoystickComponent.vue";

export default {
  components: {JoystickComponent, BattleUpdatesComponent},
  methods: {
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

@media (max-width: 450px) {
  .right-sidebar {
    width: auto;
    height: 30%;
    overflow-y: visible;
  }
}
</style>