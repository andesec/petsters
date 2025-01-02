<template>
  <div class="left-sidebar">
    <h2>Information Center</h2>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.left-sidebar {
  width: 20%;
  background-color: white;
  border: 1px solid lightslategray;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 10px;
  overflow-y: auto; /* Enable scrolling if there are too many updates */
}

@media (max-width: 450px) {
  .left-sidebar {
    width: auto;
    overflow-y: visible;
  }
}
</style>