<template>
  <h2>Battle</h2>
  <div class="battle-page">
    <div v-if="loading" class="loading">
      <p>Loading...</p>
    </div>
    <div v-else>
      <SelectPetComponent v-if="cs === 'SELECT_PET'" :m="battle?.m" :os="battle?.os" @pokemon-selected="handlePokemonSelected"/>
      <BattleComponent v-else-if="cs === 'SELECT_ACTION'" :battle="battle" @action-selected="handleActionSelected"/>
      <BattleEndComponent v-else-if="cs === 'END_BATTLE'" :battle="battle" :t="t"/>
    </div>
  </div>
</template>

<script>
import BattleService from "../services/BattleService"; // Updated to import BattleService
import SelectPetComponent from "../components/battle/SelectPetComponent.vue"
import BattleComponent from "../components/battle/BattleComponent.vue"
import eventBus from "@/eventBus.js";
import BattleEndComponent from "@/components/battle/BattleEndComponent.vue";
import UXService from "@/services/UXService.js";

export default {
  components: {
    BattleEndComponent,
    SelectPetComponent,
    BattleComponent,
  },
  data() {
    return {
      loading: true,
      cs: null, // 'SELECT_PET' or 'IN_BATTLE'
      battle: null, // Holds the data received from the API
      ci: null,
      ai: null,
      t: null,
    };
  },
  async mounted() {
    console.log("Battle created");
    // Fetch which Petster to battle
    eventBus.on('bd', this.initiateBattle);
  },
  beforeUnmount() {
    eventBus.off('bd', this.initiateBattle);
  },
  methods: {
    async initiateBattle(bd) {
      this.ci = bd.ci;
      this.ai = bd.ai;
      this.t = bd.t;
      this.loading = true;
      console.log("Initiating battle");

      try {
        // Fetch initial battle data from API and process state
        const response = await BattleService.initiateBattle(this.t,{cs: null, ci: this.ci, ai: this.ai}); // Changed to use BattleService
        this.processBattleResponse(response);
      } catch (error) {
        UXService.notify("an error occurred while starting the battle.", error)
      } finally {
        this.loading = false;
      }
    },
    processBattleResponse(response) {
      this.battle = response;
      if (response.ns === 1 || response.ns === 6) {
        this.cs = "SELECT_PET"; // Show SelectPetComponent
      } else if (response.ns === 2 || response.ns === 7) {
        this.cs = "SELECT_ACTION"; // Show BattleComponent
      } else if (response.ns === 5 || response.ns === 9) {
        this.cs = "END_BATTLE"; // Show BattleEndComponent
      } else {
        UXService.warn("Unexpected battle state: " + response.ns);
      }
    },
    async handlePokemonSelected(pokemon) {
      try {
        this.loading = true;
        const response = await BattleService.continueBattle(this.t, {cs: 6, oi: pokemon.i}); // Changed to use BattleService
        console.log(response);
        eventBus.emit('battle-update', response.ts);
        this.processBattleResponse(response);
      } catch (error) {
        UXService.notify("an error occurred while selecting the pokemon.", error)
      } finally {
        this.loading = false;
      }
    },
    async handleActionSelected(action) {
      try {
        this.loading = true;
        const response = await BattleService.continueBattle(this.t, {cs: 7, oi: action.item}); // Changed to use BattleService
        console.log(response);
        eventBus.emit('battle-update', response.ts);
        this.processBattleResponse(response);
      } catch (error) {
        UXService.notify("an error occurred while performing the action.", error)
      } finally {
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