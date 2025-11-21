<template>
  <div class="battle-component">
    <div class="pokemon-container">
      <!-- Trainer's Pokemon -->
      <div class="trainer-pokemon">
        <div class="pokemon-header">
          <h3>{{ "Your " + battle.cps?.n }}</h3>
          <i class="fa fa-info-circle pokemon-info-icon" @click="showPokemonDetails(battle.cps)"></i>
        </div>
        <img :src="ImageService.getImageURLForPokemon(battle.cps?.o)" alt="Your Pokemon" class="pokemon-image"/>
        <div class="hp-bar-container">
          <div class="hp-bar" :style="{ width: battle.cps ? (battle.cps.h / battle.cps.th) * 100 + '%' : '0%' }"></div>
          <span class="hp-text">{{ battle.cps?.h }}/{{ battle.cps?.th }}</span>
        </div>
        <p>Level {{ battle.cps?.l }}</p>
        <div class="type-squares">
          <div v-for="(type, i) in battle.cps?.ty" :key="i" :style="{ backgroundColor: TypeService.getTypeColor(type) }" class="type-square" :title="type">{{ type }}</div>
        </div>
      </div>

      <!-- Opponent's Pokemon -->
      <div class="opponent-pokemon">
        <div class="pokemon-header">
          <h3>{{ battle.op + "'s " + battle.ops?.n }}</h3>
          <i class="fa fa-info-circle pokemon-info-icon" @click="showPokemonDetails(battle.ops)"></i>
        </div>
        <img :src="ImageService.getImageURLForPokemon(battle.ops?.o)" alt="Opponent Pokemon" class="pokemon-image"/>
        <div class="hp-bar-container">
          <div class="hp-bar" :style="{ width: battle.ops ? (battle.ops.h / battle.ops.th) * 100 + '%' : '0%' }"></div>
          <span class="hp-text">{{ battle.ops?.h }}/{{ battle.ops?.th }}</span>
        </div>
        <p>Level {{ battle.ops?.l }}</p>
        <div class="type-squares">
          <div v-for="(type, i) in battle.ops?.ty" :key="i" :style="{ backgroundColor: TypeService.getTypeColor(type) }" class="type-square" :title="type">{{ type }}</div>
        </div>
      </div>
    </div>

    <!-- Battle m -->
    <h4 class="battle-m">{{ battle.m }}</h4>

    <!-- Actions and Items Section in Two Columns -->
    <div class="action-selection">
      <!-- Actions Section -->
      <div class="actions-list">
        <p class="section-title">Use a action:</p>
        <div v-for="action in battle.os" :key="action.i" class="action-item">
          <input type="radio" :id="action.i" :value="action.i" v-model="selectedAction" :name="action.i"/>
          <label :for="action.i" class="action-label" :style="{ backgroundColor: TypeService.getTypeColor(action.t) }">
            <span>{{ action.n }}</span>
            <i class="fa fa-info-circle info-icon" @click="showActionDetails(action)"></i>
          </label>
        </div>
      </div>

      <!-- Medicine Section -->
      <div class="item-list">
        <p class="section-title">Use an item:</p>
        <div v-for="item in battle.im" :key="item.i" class="div-item">
          <input type="radio" :id="'item-input' + item.i" :value="item" v-model="selectedItem" :disabled="selectedAction" name="item"/>
          <label :for="'item-input' + item.i" class="item-label">{{ item.n }}</label>
        </div>
      </div>
    </div>

    <!-- Continue Button -->
    <button :disabled="!canContinue || isProcessing" @click="handleContinue" class="continue-button">Continue</button>
  </div>
</template>

<script>
import ImageService from "@/services/ImageService.js";
import TypeService from "@/services/TypeService.js";
import UXService from "@/services/UXService.js";

export default {
  props: {
    battle: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedAction: null,
      selectedItem: null,
      isProcessing: false,
    };
  },
  computed: {
    UXService() {
      return UXService
    },
    ImageService() {
      return ImageService
    },
    TypeService() {
      return TypeService
    },
    canContinue() {
      return this.selectedAction || this.selectedItem;
    },
  },
  methods: {
    handleContinue() {
      this.isProcessing = true;

      const selectedAction = this.selectedAction
          ? {type: "action", item: this.selectedAction}
          : {type: "medicine", item: this.selectedItem};

      this.$emit("action-selected", selectedAction);
      console.log(selectedAction);

      setTimeout(() => {
        this.isProcessing = false;
      }, 2000);
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
  transition: width 0.5s ease-in-out; /* Smooth transition for the width */
}

.hp-text {
  font-size: 13px;
  color: #333;
}

/* Responsiveness */
@media (max-width: 1000px) {
  .action-selection {
    flex-direction: column;
  }

  .actions-list, .item-list {
    width: 100%;
  }
}

.action-selection {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin: 20px auto;
}

.actions-list, .item-list {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.action-item, .div-item {
  position: relative;
  margin: 10px 15%;
}

input[type="radio"] {
  display: none;
}

.action-label, .item-label {
  color: whitesmoke;
  display: block;
  padding: 10px 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease-in-out;
  border: 3px solid transparent;
}

input[type="radio"]:checked + .action-label {
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

.battle-component {
  font-family: Arial, sans-serif;
  padding: 20px;
}

.pokemon-container {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.trainer-pokemon, .opponent-pokemon {
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
  width: auto;
  height: 120px;
  margin-bottom: 10px;
}

.hp-text {
  font-size: 12px;
}

.battle-m {
  text-align: left;
}

.section-title {
  text-align: left;
}
</style>