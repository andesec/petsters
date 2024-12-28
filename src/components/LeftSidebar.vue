<template>
  <div :class="['left-sidebar', { open: visible }]">
    <button class="toggle-btn" @click="$emit('toggle-sidebar')">
      {{ visible ? '❮' : '❯' }}
    </button>
    <p>Left Sidebar Content</p>
  </div>
</template>

<script>
export default {
  props: ['visible'],
};
</script>

<style scoped>
.left-sidebar {
  position: relative;
  height: 100%;
  width: 250px;
  background-color: #e0e0e0;
  border-radius: 0 8px 8px 0;
  padding: 20px;
  box-sizing: border-box;
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
}

.left-sidebar.open {
  transform: translateX(0);
}

.toggle-btn {
  position: absolute;
  top: 10px; /* Adjust to keep button visible within the sidebar */
  right: -50px; /* Extends slightly outside the sidebar */
  width: 40px;
  height: 30px;
  background-color: #3f51b5;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px; /* Subtle rounding for button corners */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Adds subtle shadow */
  display: flex;
  justify-content: center;
  align-items: center;
}

.toggle-btn:hover {
  background-color: #303f9f;
  box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.2); /* Enhances shadow on hover */
}
</style>