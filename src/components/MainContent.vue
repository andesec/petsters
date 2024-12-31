<template>
  <div class="main-content">
    <router-view @send-update="handleMainContentUpdates" />
  </div>
</template>

<script>
export default {
  methods: {
    handleMainContentUpdates(update) {
      console.log('Update from Main Content:', update);
    },
    sendUpdate() {
      const update = { message: 'New update from Main Content' };
      this.$emit('event-from-center', update);
    },
  },
};
</script>

<style scoped>
.main-content {
  width: 55%;
  background-color: white;
  border: 1px solid lightslategray;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 15px;
  overflow-y: auto; /* Enable scrolling if there are too many updates */
}
</style>