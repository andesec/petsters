<template>
  <div class="main-content">
    <router-view />
  </div>
</template>

<script>
export default {
  methods: {
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

@media (max-width: 450px) {
  .main-content {
    width: auto;
    overflow-y: visible;
  }
}
</style>