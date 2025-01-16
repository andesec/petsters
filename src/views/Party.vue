<template>
  <h2>Your Current Party</h2>
  <br>
  <p>You can drag the cards to reorder your party.</p>
  <br>
  <div class="party-container">
    <draggable :list="pets" class="draggable-list" >
      <div v-for="(p, index) in pets" :key="p.i" class="pet-card">
        <div class="pet-index">{{ index + 1 }}</div>
        <div class="pet-card-contents">
          <img :src="ImageService.getImageURLForPokemon(p.o)" :alt="p.n" class="pet-image clickable-text"/>
          <div class="pet-details">
            <h3 class="pet-name clickable-text" @click="UXService.showInfo('pe', p.i)">{{ p.n }}</h3>
            <p class="pet-level">Level: {{ p.l }}</p>
            <div class="type-squares">
              <div v-for="(type, i) in p.ty" :key="i" :style="{ backgroundColor: TypeService.getTypeColor(type) }" class="type-square" :title="type">{{ type }}</div>
            </div>
            <div class="hp-bar-container">
              <div class="hp-bar-capsule">
                <div :class="UXService.getHPBarClass(p.h,p.t)" :style="UXService.getHPBarStyle(p.h,p.t)"></div>
              </div>
              <span class="hp-text">{{ p?.h }}/{{ p?.t }}</span>
            </div>
          </div>
          <div class="pet-actions">
            <h4>Learned Moves:</h4>
            <br>
            <div v-for="action in p.a" :key="action.i" class="pet-action clickable-text">
              {{ action.a }}
            </div>
          </div>
        </div>
        <div class="pet-remove" @click="removePet(index)" title="Remove from Party and send to box."><i class="fa-solid fa-xmark"></i></div>
      </div>
    </draggable>
  </div>
    <button class="button" @click="saveParty"> Save Sequence</button>
</template>

<script>
import ImageService from "@/services/ImageService";
import TypeService from "@/services/TypeService";
import UXService from "@/services/UXService";
import PetsterService from "@/services/PetsterService";
import {defineComponent} from 'vue'
import {VueDraggableNext} from 'vue-draggable-next'

export default defineComponent({
  components: {
    draggable: VueDraggableNext,
  },
  computed: {
    UXService() {
      return UXService
    },
    TypeService() {
      return TypeService
    },
    ImageService() {
      return ImageService
    },
    sequenceChanged() {
      // Runs 6 times, each time comparing the value in both the array at same index and if at any time found a difference it returns true:
      for (let i = 0; i < 6; i++) {
        if (this.currentSequence[i] !== this.originalSequence[i]) {
          return true;
        }
      }
      return false;
    },
    currentSequence() {
      const cu =  this.pets.map(pet => pet.i)
      console.log("Current sequence1: ", cu);
      console.log("Current sequence2: ", cu.length);

      // Pad the array so it's always six. Fewer computations for server code this way.
      for (let i = cu.length + 1; i <= 6; i++) {
        cu.push(null)
      }

      console.log("Current sequence3: ", cu);

      return cu;
    }
  },
  data() {
    return {
      pets: [],
      originalSequence: [],
      dragging: false,
    };
  },
  methods: {
    async saveParty() {
      if (!this.sequenceChanged) {
        alert("No changes to save!");
        return;
      }
      await PetsterService.saveCurrentParty(this.currentSequence)
    },
    removePet(index) {
      this.pets.splice(index, 1);
    },
    saveOriginalSequence() {
      this.originalSequence = this.pets.map(pet => pet.i);
      // Pad the array so it's always six. Fewer computations for server code this way.
      for (let i = this.originalSequence.length + 1; i <= 6; i++) {
        this.originalSequence.push(null)
      }
    }
  },
  async mounted() {
    this.pets = await PetsterService.fetchCurrentParty();
    this.saveOriginalSequence()
  },
});
</script>

<style scoped>
.party-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pet-card {
  display: flex;
  margin-bottom: 10px;
  height: 15%;
  justify-content: space-between;
  align-items: center;
  background-color: #eaecec;
  border: 2px solid #cbcdcd;
  border-radius: 8px;
}

.pet-index {
  display: flex;
  width: 5%;
  justify-content: center;
  align-items: center;
  background-color: #cbcdcd;
  height: 120px;
  border-radius: 5px 0px 0px 5px;
  font-size: 18px;
  padding: 10px;
  cursor: pointer;
}

.pet-remove {
  display: flex;
  width: 5%;
  justify-content: center;
  align-items: center;
  background-color: #ea3b3b;
  height: 120px;
  border-radius: 0px 5px 5px 0px;
  color: white;
  font-size: 18px;
  padding: 10px;
  cursor: pointer;
}

.pet-card-contents {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly; /* Distribute elements evenly with equal space */
  align-items: center; /* Align items vertically at the center */
  width: 100%; /* Ensure it spans the entire card width */
}

.pet-image {
  width: 100px;
  height: auto;
}

.pet-details {
  display: flex;
  flex-direction: column;
}

.pet-actions {
  display: flex;
  flex-direction: column;
  align-items: center; /* Center align the actions */
  text-align: center;
  margin-left: 30%;
}

.hp-bar-container {
  overflow: hidden;
  margin: 5px 0;
  display: flex;
  align-items: center;
  width: 100%;
}

.hp-bar-capsule {
  background-color: #f8f8f8;
  border-radius: 10px;
  width: 150px;
  height: 15px;
  display: flex;
}

.hp-bar {
  border-radius: 10px;
}

.hp-text {
  font-size: 13px;
  color: #333;
  text-align: center;
  width: 60px;
}

.save-button {
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

@media (max-width: 1100px) {
  .pet-actions {
    margin-left: 10%;
  }
}

@media (max-width: 950px) {
  .pet-actions {
    display: none;
  }
}

@media (max-width: 450px) {
  .pet-actions {
    display: none;
  }

}
</style>