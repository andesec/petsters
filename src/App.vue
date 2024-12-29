<template>
  <div id="app">
    <Header />
    <!-- Add FontAwesome CDN -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet"/>
    <div class="layout">
      <LeftSidebar :visible="isLeftSidebarVisible" @toggle-sidebar="toggleSidebar" />
      <div class="main-content">
        <router-view @send-update="handleMainContentUpdates" />
      </div>
      <RightSidebar @send-update="handleRightSidebarUpdates" />
    </div>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import LeftSidebar from './components/LeftSidebar.vue';
import RightSidebar from './components/RightSidebar.vue';
import { VueMaskDirective } from "vue-the-mask";

export default {
  directives: {
    mask: VueMaskDirective,
  },
  components: {
    Header,
    LeftSidebar,
    RightSidebar,
  },
  data() {
    return {
      isLeftSidebarVisible: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.isLeftSidebarVisible = !this.isLeftSidebarVisible;
    },
    handleMainContentUpdates(update) {
      console.log('Update from Main Content:', update);
    },
    handleRightSidebarUpdates(update) {
      console.log('Update from Right Sidebar:', update);
    },
  },
};
</script>

<style>
@import './assets/styles.css';

.layout {
  display: flex;
  height: calc(100vh - 60px); /* Adjust height to exclude header */
  padding: 10px; /* Adds consistent padding around the layout */
  gap: 10px; /* Adds spacing between the sidebar and main content */
  box-sizing: border-box;
}

.main-content {
  flex: 1;
  padding: 15px; /* Adds inner padding for content */
  margin: 0; /* Avoids additional margin */
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  overflow: auto;
}

.right-sidebar {
  width: 25%;
}
</style>