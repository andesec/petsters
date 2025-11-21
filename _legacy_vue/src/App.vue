<template>
  <div id="app">
    <!-- Add FontAwesome CDN -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" rel="stylesheet"/>
    <Header />
    <div class="layout">
      <LeftSidebar/>
      <MainContent/>
      <RightSidebar @send-update="handleRightSidebarUpdates" />
    </div>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import LeftSidebar from './components/LeftSidebar.vue';
import MainContent from "@/components/MainContent.vue";
import RightSidebar from './components/RightSidebar.vue';
import { VueMaskDirective } from "vue-the-mask";
import EventBus from "@/eventBus.js";

export default {
  directives: {
    mask: VueMaskDirective,
  },
  components: {
    Header,
    LeftSidebar,
    MainContent,
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
  height: calc(100vh - 75px); /* Adjust height to exclude header */
  padding: 8px; /* Adds consistent padding around the layout */
  gap: 10px; /* Adds spacing between the sidebar and main content */
}

@media (max-width: 450px) {
  .layout {
    flex-direction: column;
    height: 100vh;
    padding: 0;
    gap: 8px;
    margin: 8px;
  }
}
</style>