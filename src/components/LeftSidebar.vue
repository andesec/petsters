<template>
  <!-- Sidebar coming from the top -->
  <div :class="['left-sidebar', { collapsed: !isSidebarVisible }]">
    <!-- Sidebar Content -->
    <h2>Information Center</h2>
    <br/>
    <div class="info-center-content">
      <input ref="searchBar" id="search-bar" type="text" placeholder="Search" />
      <div class="button-row">
        <select ref="searchTypeDropdown" id="search-dropdown" class="dropdown">
          <option value="a">Ability</option>
          <option value="i">Item</option>
          <option value="l">Location</option>
          <option value="m">Move</option>
          <option value="n">NPC</option>
          <option value="p" selected>Pokémon</option>
        </select>
        <button class="button" @click="search">Search</button>
      </div>
    </div>
    <div v-if="(currentView !== undefined && currentView !== null)" class="sidebar-backdrop">
      <i class="fas fa-times" @click="resetViewAndCloseSidebar" style="cursor: pointer; color: red; display: flex; justify-content: right;" title="Close"></i>
      <SearchResultsControl id="search-results" v-if="currentView === 'r' && searchResults.r.length > 0" :searchResults="searchResults"/>
      <PetInfoComponent v-if="currentView === 'e'" :id="dataId" />
      <PokemonInfoComponent v-if="currentView === 'p'" :id="dataId"/>
    </div>
  </div>

  <!-- Toggle Button -->
  <button class="toggle-sidebar-button" @click="toggleSidebar">
    <i :class="isSidebarVisible ? 'fas fa-caret-up' : 'fas fa-caret-down'"></i>
  </button>
</template>

<script>
import EventBus from "@/eventBus.js";
import PetInfoComponent from "@/components/info/PetInfoComponent.vue";
import PokemonInfoComponent from "@/components/info/PokemonInfoComponent.vue";
import SearchService from "@/services/SearchService.js";
import SearchResultsControl from "@/components/info/SearchResultsControl.vue";

export default {
  name: "LeftSidebar",
  components: {SearchResultsControl, PokemonInfoComponent, PetInfoComponent},
  created() {
    // Listen for events on the EventBus
    EventBus.on("show-info", this.updateView);
  },
  mounted() {
    this.$refs.searchBar.addEventListener("keydown", this.searchOnEnter);
  },
  beforeDestroy() {
    // Clean up the event listener
    EventBus.off("show-info", this.updateView);
    this.$refs.searchBar.removeEventListener("keydown", this.searchOnEnter);
  },
  data() {
    return {
      isSidebarVisible: false, // Initial sidebar state
      currentView: undefined,
      dataId: undefined,
      searchData: undefined,
      searchResults: {},
      selectedSearchType: 'p',
    };
  },
  methods: {
    toggleSidebar() {
      // Toggle sidebar visibility
      this.isSidebarVisible = !this.isSidebarVisible;
    },
    updateView(data) {
      if (!this.isSidebarVisible) {
        this.toggleSidebar()
      }
      this.dataId = data.i;
      this.currentView = data.v;
    },
    resetViewAndCloseSidebar() {
      this.searchData = undefined;
      this.dataId = undefined;
      this.currentView = undefined;
      this.toggleSidebar();
    },
    async search() {
      this.selectedSearchType = this.$refs.searchTypeDropdown.value;
      let searchText = this.$refs.searchBar.value;

      if (searchText.length < 3) {
        alert(`Please enter a search keyword. Keyword should be at least 3 characters long.`);
        return;
      }

      let result = await SearchService.searchKeyword(this.selectedSearchType, searchText);
      console.log(result);

      if (result.error !== undefined) {
        alert(result.error);
        return;
      }

      this.currentView = 'r';
      this.searchResults = result;
      console.log(this.searchResults);
    }
  },
  searchOnEnter(event) {
    if (event.key === 'Enter') {
      this.search();
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
  margin-bottom: 20px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 10px;
  overflow-y: auto; /* Enable scrolling if there are too many updates */
}

.toggle-sidebar-button {
  display: none;
}

.info-center-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.info-center-content > * {
  margin-bottom: 10px; /* Adjust the value as needed */
}

.info-center-content .dropdown, .info-center-content input, .info-center-content button {
  border: 1px solid lightslategray;
  font-size: 1em;
  width: 100%;
  height: 40px;
  border-radius: 10px;
  box-shadow: none;
}

.info-center-content input {
  padding: 5px 10px;
  width: auto;
  height: 30px;
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
    max-height: 90vh; /* Sidebar takes 90% of the vertical height */
    overflow-y: auto; /* Ensure scrolling when content overflows */
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
    max-height: 90vh; /* Sidebar takes 70% of the vertical height */
    overflow-y: auto; /* Ensure scrolling when content overflows */
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