<template>
  <div class="battle-page">
    <h1>Battle Page</h1>
    <div v-if="loading" class="loading">
      <p>Loading...</p>
    </div>
    <div v-else>
      <SelectPetComponent
          v-if="cs === 'SELECT_PET'"
          :m="battleData?.m"
          :pokemonList="battleData?.os"
          @pokemon-selected="handlePokemonSelection"
      />
      <BattleComponent
          v-else-if="cs === 'IN_BATTLE'"
          :m="battleData?.m"
          :cps="battleData?.cps"
          :ops="battleData?.ops"
          :availableMoves="battleData?.os"
          :op="battleData?.op"
          @move-selected="handleMoveSelection"
      />
    </div>
  </div>
</template>

<script>
import BattleService from "../services/BattleService"; // Updated to import BattleService
import SelectPetComponent from "../components/battle/SelectPetComponent.vue"
import BattleComponent from "../components/battle/BattleComponent.vue"

export default {
  components: {
    SelectPetComponent,
    BattleComponent,
  },
  data() {
    return {
      loading: true,
      cs: null, // 'SELECT_PET' or 'IN_BATTLE'
      battleData: null, // Holds the data received from the API
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
    /**
     * Processes the battle API response and determines the current state.
     * @param {Object} response - The API response data.
     */
    processBattleResponse(response) {
      this.battleData = response;
      if (response.ns === 1 || response.ns === 6) {
        this.cs = "SELECT_PET"; // Show SelectPetComponent
      } else if (response.ns === 2 || response.ns === 7) {
        this.cs = "IN_BATTLE"; // Show BattleComponent
      } else if (response.ns === 5 || response.ns === 9) {
        alert("Battle ended");
      } else {
        console.warn("Unexpected battle state:", response.ns);
      }
    },

    /**
     * Handles the event when a Pokémon is selected in the SelectPetComponent.
     * @param {Object} pokemon - The selected Pokémon object.
     */
    async handlePokemonSelection(pokemon) {
      try {
        this.loading = true;
        const response = await BattleService.continueBattle({cs: 6, oi: pokemon.i}); // Changed to use BattleService
        this.processBattleResponse(response);
        this.loading = false;
      } catch (error) {
        console.error("Error selecting Pokémon:", error);
        this.loading = false;
      }
    },

    /**
     * Handles the event when a move is selected in the BattleComponent.
     * @param {Object} move - The selected move object.
     */
    async handleMoveSelection(move) {
      try {
        this.loading = true;
        const response = await BattleService.continueBattle({cs: 7, oi: move.i}); // Changed to use BattleService
        this.processBattleResponse(response);
        this.loading = false;
      } catch (error) {
        console.error("Error selecting move:", error);
        this.loading = false;
      }
    },

    /**
     * Handles the event when a move is selected in the BattleComponent.
     * @param {Object} move - The selected move object.
     */
    async handleEndBattle(move) {
      try {
        this.loading = true;
        const response = await BattleService.continueBattle({cs: 9}); // Changed to use BattleService
        this.processBattleResponse(response);
        this.loading = false;
      } catch (error) {
        console.error("Error selecting move:", error);
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.battle-page {
  text-align: center;
  margin: 20px;
}

.loading {
  font-size: 18px;
  color: #555;
}
</style>