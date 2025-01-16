<template>
  <!-- Sidebar coming from the top -->
  <div :class="['left-sidebar', { collapsed: !isSidebarVisible }]">
    <!-- Sidebar Content -->
    <h2>Information Center</h2>
    <br/>
    <PetInfoComponent v-if="currentView === 'pe'" :id="dataId" />
  </div>

  <!-- Toggle Button -->
  <button class="toggle-sidebar-button" @click="toggleSidebar">
    <i :class="isSidebarVisible ? 'fas fa-caret-up' : 'fas fa-caret-down'"></i>
  </button>

  <!-- Error Message -->
  <div v-if="errorMessage" class="error-message">
    {{ errorMessage }}
  </div>
</template>

<script>
import PetInfoComponent from "@/components/info/PetInfoComponent.vue";
import EventBus from "@/eventBus.js";

export default {
  components: {PetInfoComponent},
  created() {
    // Listen for events on the EventBus
    EventBus.on("show-info", this.updateView);
  },
  beforeDestroy() {
    // Clean up the event listener
    EventBus.off("show-info", this.updateView);
  },
  data() {
    return {
      isSidebarVisible: false, // Initial sidebar state
      errorMessage: null,      // To display expansion errors
      currentView: null,
      dataId: null,
    };
  },
  methods: {
    toggleSidebar() {
      // Toggle sidebar visibility
      try {
        if (!this.isSidebarVisible) {
          this.expandSidebar();
        } else {
          this.isSidebarVisible = false;
        }
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    expandSidebar() {
      if (this.someConditionFails()) {
        throw new Error('Failed to expand sidebar. Please try again later.');
      }
      this.isSidebarVisible = true;
      this.errorMessage = null;
    },
    someConditionFails() {
      // Dummy logic for condition
      return false; // Allow expansion
    },
    updateView(data) {
      if (!this.isSidebarVisible) {
        this.toggleSidebar()
      }
      this.dataId = data.i;
      this.currentView = data.v;
    }
  },
};
</script>

<style scoped>
/* Sidebar styling */
.left-sidebar {
  width: 20%;
  background-color: white;
  border: 1px solid lightslategray;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 10px;
  overflow-y: auto; /* Enable scrolling if there are too many updates */
}

.toggle-sidebar-button {
  display: none;
}

/* Adjust styles for smaller screens */
@media (max-width: 1100px) {
  .left-sidebar {
    position: fixed;
    top: 57px;
    left: 0;
    margin: 0px 8px;
    width: 90.6%; /* Full width remains consistent */
    z-index: 1000;
    transform: translateY(-100%); /* Hidden by default (collapsed) */
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  }

  .left-sidebar.collapsed {
    transform: translateY(-100%); /* Move out of view when collapsed */
    opacity: 0;
  }

  .left-sidebar:not(.collapsed) {
    transform: translateY(0); /* Slide in when expanded */
    opacity: 1;
  }

  .error-message {
    position: fixed;
    top: 80px;
    left: 10px;
    color: red;
    font-size: 0.9em;
  }

  /* Toggle button styles */
  .toggle-sidebar-button {
    display: inline-block;
    position: fixed;
    top: 50px; /* Same height as the header */
    right: 15px; /* Consistent positioning for mobile */
    z-index: 1300; /* Above the sidebar but beneath modals */
    background-color: lightslategray;
    color: white;
    border: none;
    border-radius: 55%;
    cursor: pointer;
    padding: 3px 6px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease, background-color 0.3s ease;
  }

  .toggle-sidebar-button:hover {
    background-color: darkslategray;
  }

  .toggle-sidebar-button i {
    font-size: 1.2rem;
  }
}

/* Adjust styles for smaller screens */
@media (max-width: 450px) {
  .left-sidebar {
    position: fixed;
    top: 57px;
    left: 0;
    margin: 0px 8px;
    width: 90.6%; /* Full width remains consistent */
    z-index: 1000;
    transform: translateY(-100%); /* Hidden by default (collapsed) */
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  }

  .left-sidebar.collapsed {
    transform: translateY(-100%); /* Move out of view when collapsed */
    opacity: 0;
  }

  .left-sidebar:not(.collapsed) {
    transform: translateY(0); /* Slide in when expanded */
    opacity: 1;
  }

  .error-message {
    position: fixed;
    top: 80px;
    left: 10px;
    color: red;
    font-size: 0.9em;
  }

  /* Toggle button styles */
  .toggle-sidebar-button {
    display: inline-block;
    position: fixed;
    top: 50px; /* Same height as the header */
    right: 15px; /* Consistent positioning for mobile */
    z-index: 1300; /* Above the sidebar but beneath modals */
    background-color: lightslategray;
    color: white;
    border: none;
    border-radius: 55%;
    cursor: pointer;
    padding: 3px 6px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease, background-color 0.3s ease;
  }

  .toggle-sidebar-button:hover {
    background-color: darkslategray;
  }

  .toggle-sidebar-button i {
    font-size: 1.2rem;
  }
}
</style>