<template>
  <h2>Battle</h2>
  <div class="battle-page">
    <div v-if="loading" class="loading">
      <p>Loading...</p>
    </div>
    <div v-else>
      <SelectPetComponent v-if="cs === 'SELECT_PET'" :m="battle?.m" :os="battle?.os" @pokemon-selected="handlePokemonSelection"/>
      <BattleComponent v-else-if="cs === 'SELECT_ACTION'" :battle="battle" @action-selected="handleActionSelection"/>
      <BattleEndComponent v-else-if="cs === 'END_BATTLE'" :battle="battle" @end-battle="handleEndBattle"/>
    </div>
  </div>
</template>

<script>
import BattleService from "../services/BattleService"; // Updated to import BattleService
import SelectPetComponent from "../components/battle/SelectPetComponent.vue"
import BattleComponent from "../components/battle/BattleComponent.vue"
import eventBus from "@/eventBus.js";
import BattleEndComponent from "@/components/battle/BattleEndComponent.vue";

export default {
  components: {
    BattleEndComponent,
    SelectPetComponent,
    BattleComponent,
  },
  props: {
    ci: {type: String, required: true},
  },
  data() {
    return {
      loading: true,
      cs: null, // 'SELECT_PET' or 'IN_BATTLE'
      battle: null, // Holds the data received from the API
    };
  },
  async created() {
    try {
      // Fetch initial battle data from API and process state
      const response = await BattleService.initiateBattle({cs: null, ci: 'WHn9T', ai: 8}); // Changed to use BattleService
      this.processBattleResponse(response);
      this.loading = false;
    } catch (error) {
      console.error("Error loading battle data:", error);
      this.loading = false;
    }
  },
  methods: {
    processBattleResponse(response) {
      this.battle = response;
      if (response.ns === 1 || response.ns === 6) {
        this.cs = "SELECT_PET"; // Show SelectPetComponent
      } else if (response.ns === 2 || response.ns === 7) {
        this.cs = "SELECT_ACTION"; // Show BattleComponent
      } else if (response.ns === 5 || response.ns === 9) {
        alert("Battle ended");
        this.cs = "END_BATTLE"; // Show BattleEndComponent
      } else {
        console.warn("Unexpected battle state:", response.ns);
      }
    },
    async handlePokemonSelection(pokemon) {
      try {
        this.loading = true;
        const response = await BattleService.continueBattle({cs: 6, oi: pokemon.i}); // Changed to use BattleService
        console.log(response);
        eventBus.emit('battle-update', response.ts);
        this.processBattleResponse(response);
        this.loading = false;
      } catch (error) {
        console.error("Error selecting Pokémon:", error);
        this.loading = false;
      }
    },
    async handleActionSelection(action) {
      try {
        this.loading = true;
        const response = await BattleService.continueBattle({cs: 7, oi: action.item}); // Changed to use BattleService
        console.log(response);
        eventBus.emit('battle-update', response.ts);
        this.processBattleResponse(response);
        this.loading = false;
      } catch (error) {
        console.error("Error selecting action:", error);
        this.loading = false;
      }
    },
    async handleEndBattle() {
      try {
        this.loading = true;
        const response = await BattleService.endBattle({cs: 9});
        eventBus.emit('battle-update', response.ts);
        this.processBattleResponse(response);
        this.loading = false;
      } catch (error) {
        console.error("Error ending battle:", error);
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.battle-page {
  margin: 20px;
}

.loading {
  font-size: 18px;
  color: #555;
}
</style>