<template>
  <div class="battle-component">
    <div class="pokemon-container">
      <!-- Trainer's Pokemon -->
      <div class="trainer-pokemon">
        <div class="pokemon-header">
          <h3>{{ cps?.n }}</h3>
          <i class="fa fa-info-circle pokemon-info-icon" @click="showPokemonDetails(cps)"></i>
        </div>
        <img :src="getPokemonImage(cps?.i)" alt="Your Pokemon" class="pokemon-image"/>
        <div class="hp-bar-container">
          <div class="hp-bar" :style="{ width: cps ? (cps.h / cps.th) * 100 + '%' : '0%' }"></div>
          <span class="hp-text">{{ cps?.h }}/{{ cps?.th }}</span>
        </div>
        <div class="type-squares">
          <div v-for="(type, i) in cps?.ty" :key="i" :style="{ backgroundColor: getTypeColor(type) }"
               class="type-square" :title="type"></div>
        </div>
      </div>

      <!-- Opponent's Pokemon -->
      <div class="opponent-pokemon">
        <div class="pokemon-header">
          <h3>{{ ops?.n }}</h3>
          <i class="fa fa-info-circle pokemon-info-icon" @click="showPokemonDetails(ops)"></i>
        </div>
        <img :src="getPokemonImage(ops?.i)" alt="Opponent Pokemon" class="pokemon-image"/>
        <div class="hp-bar-container">
          <div class="hp-bar" :style="{ width: ops ? (ops.h / ops.th) * 100 + '%' : '0%' }"></div>
          <span class="hp-text">{{ ops?.h }}/{{ ops?.th }}</span>
        </div>
        <div class="type-squares">
          <div v-for="(type, i) in ops?.ty" :key="i" :style="{ backgroundColor: getTypeColor(type) }"
               class="type-square" :title="type"></div>
        </div>
      </div>
    </div>

    <!-- Battle m -->
    <div class="battle-m">{{ m }}</div>

    <!-- Moves Section -->
    <h3 class="section-title">Available Moves</h3>
    <div class="moves-list">
      <div v-for="move in availableMoves" :key="move.i" class="move-item">
        <input type="radio" :id="move.i" :value="move.i" v-model="selectedMove" :name="move.i" />
        <label :for="move.i" class="move-label" :style="{ backgroundColor: getTypeColor(move.t) }">
          <span>{{ move.n }}</span>
          <i class="fa fa-info-circle info-icon" @click="showMoveDetails(move)"></i>
        </label>
      </div>
    </div>

    <!-- Medicine Section -->
    <h3 class="section-title">Available Medicine</h3>
    <div class="medicine-list">
      <div v-for="medicine in availableMedicine" :key="medicine.i" class="medicine-item">
        <input type="radio" :id="'medicine-' + medicine.i" :value="medicine" v-model="selectedMedicine" name="medicine"
               :disabled="selectedMove"/>
        <label :for="'medicine-' + medicine.i" class="medicine-label">{{ medicine.n }}</label>
      </div>
    </div>

    <!-- Continue Button -->
    <button :disabled="!canContinue || isProcessing" @click="handleContinue" class="continue-button">Continue</button>

    <!-- Pokémon Details Cloud -->
    <div v-if="showDetailsOverlay" class="details-overlay" @click="closeDetails">
      <div class="details-content" @click.stop>
        <div class="cloud-header">
          <h4>{{ detailsForPokemon?.n }}</h4>
          <button class="close-button" @click="closeDetails">x</button>
        </div>
        <p v-if="!detailsForPokemon">Loading...</p>
        <p v-else>{{ detailsForPokemon?.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    m: {type: String, required: true},
    cps: {type: Object, required: true},
    ops: {type: Object, required: true},
    availableMoves: {type: Array, required: true},
    availableMedicine: {type: Array, required: true},
    op: {type: String, required: true},
  },
  data() {
    return {
      selectedMove: null,
      selectedMedicine: null,
      showDetailsOverlay: false,
      detailsForPokemon: null,
      isProcessing: false,
    };
  },
  computed: {
    canContinue() {
      return this.selectedMove || this.selectedMedicine;
    },
  },
  methods: {
    getPokemonImage(id) {
      return `/assets/pokemon/${id}.png`;
    },
    showPokemonDetails(pokemon) {
      this.detailsForPokemon = null; // Reset to show loader
      this.showDetailsOverlay = true;

      setTimeout(() => {
        // Simulate API call
        this.detailsForPokemon = {...pokemon, description: "This is a Pokémon with amazing abilities!"};
      }, 1000); // Replace with actual API call
    },
    showMoveDetails(move) {
      this.detailsForPokemon = null;
      this.showDetailsOverlay = true;

      setTimeout(() => {
        this.detailsForPokemon = {...move, description: "This move does extra damage when conditions are met."};
      }, 1000);
    },
    closeDetails() {
      this.detailsForPokemon = null;
      this.showDetailsOverlay = false;
    },
    handleContinue() {
      this.isProcessing = true;

      const selectedAction = this.selectedMove
          ? {type: "move", item: this.selectedMove}
          : {type: "medicine", item: this.selectedMedicine};

      this.$emit("action-selected", selectedAction);

      setTimeout(() => {
        this.isProcessing = false;
      }, 2000);
    },
    getTypeColor(type) {
      const typeColors = {
        Fire: "#e15115",
        Water: "#2260f6",
        Grass: "#48c309",
        Electric: "#F8D030",
        Ice: "#98D8D8",
        Fighting: "#C03028",
        Poison: "#A040A0",
        Ground: "#7c5e0b",
        Flying: "#A890F0",
        Psychic: "#F85888",
        Bug: "#A8B820",
        Rock: "#ca904e",
        Ghost: "#705898",
        Dragon: "#7038F8",
        Dark: "#35302d",
        Steel: "#d9d9e4",
        Fairy: "#fa8ca6",
      };
      console.log(type)
      console.log(typeColors[type])
      return typeColors[type] || "#A8A8A8";
    },
  },
};
</script>

<style scoped>
.hp-bar-container {
  width: 100%;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  margin: 5px 0;
  display: flex;
  align-items: center;
  gap: 5px;
}

.hp-bar {
  background-color: #28a745;
  height: 15px;
  border-radius: 5px;
}

.hp-text {
  font-size: 13px;
  color: #333;
}

.moves-list, .medicine-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin: 20px auto;
}

.move-item, .medicine-item {
  position: relative;
  margin: auto 15%;
}

input[type="radio"] {
  display: none;
}

.move-label, .medicine-label {
  color: whitesmoke;
  display: block;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease-in-out;
  border: 3px solid transparent;
}

input[type="radio"]:checked + .move-label {
  background-color: rgba(0, 0, 0, 0.95);
  border: 3px solid rgba(0, 0, 0, 0.48);
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.2);
}

.info-icon {
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 12px;
  color: #dcdedf;
  cursor: pointer;
}

.info-icon:hover {
  color: #96989a;
}

.close-button {
  margin: 0;
  padding: 5px 10px;
  background-color: red;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 20px;
}

.close-button:hover {
  background-color: #a30303;
}

.battle-component {
  font-family: Arial, sans-serif;
  padding: 20px;
}

.pokemon-container {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.trainer-pokemon,
.opponent-pokemon {
  position: relative;
  width: 45%;
  text-align: center;
}

.pokemon-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.pokemon-info-icon {
  font-size: 14px;
  cursor: pointer;
  color: #007bff;
}

.pokemon-info-icon:hover {
  color: #0056b3;
}

.pokemon-image {
  width: 120px;
  height: auto;
  margin-bottom: 10px;
}

.hp-text {
  font-size: 12px;
}

.type-squares {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 10px;
}

.type-square {
  width: 20px;
  height: 20px;
  display: inline-block;
}

.battle-m {
  text-align: center;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 20px;
}

.details-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.details-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 500px;
  text-align: center;
}

.cloud-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>