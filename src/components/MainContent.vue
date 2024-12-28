<template>
  <div class="main-content">
    <h2>Main Content</h2>
    <button @click="sendUpdate">Send Update</button>
  </div>
</template>

<script>
export default {
  methods: {
    sendUpdate() {
      const update = { message: 'New update from Main Content' };
      this.$emit('event-from-center', update);
    },
  },
};
</script>

<style scoped>
.main-content {
  padding: 20px;
}
</style>