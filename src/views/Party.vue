<template>
  <h2>Your Current Party</h2>
  <br>
  <div class="party-container">
    <draggable :list="pets" class="draggable-list" @change="log">
      <div v-for="(p, index) in pets" :key="p.i" class="pet-card">
        <div class="pet-index">{{ index + 1 }}</div>
        <div class="pet-card-contents">
          <img :src="ImageService.getImageURLForPokemon(p.o)" :alt="p.n" class="pet-image"/>
          <div class="pet-details">
            <h3 class="pet-name">{{ p.n }}</h3>
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
          <div v-for="action in p.a" :key="action.i" class="pet-action">
            {{ action.a }}
          </div>
        </div>
        </div>
      </div>
    </draggable>

    <button
        v-if="sequenceChanged"
        class="save-button"
        @click="saveSequence"
    >
      Save Sequence
    </button>
  </div>
</template>

<script>
import ApiService from "@/services/ApiService";
import ImageService from "@/services/ImageService.js";
import TypeService from "@/services/TypeService.js";
import UXService from "@/services/UXService.js";
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
    }
  },
  data() {
    return {
      pets: [],
      sequenceChanged: false,
      dragging: false,
    };
  },
  methods: {
    log(event) {
      console.log(event)
    },
    async fetchParty() {
      try {
        const response = await ApiService.makeRequest("/party");
        this.pets = response.p;
      } catch (error) {
        console.error("Error fetching party:", error);
      }
    },
    saveSequence() {
      const updatedSequence = this.pets.map(pet => pet.i);
      ApiService.makeRequest("/party/update-sequence", "POST", updatedSequence)
          .then(() => {
            this.sequenceChanged = false;
            alert("Sequence saved successfully!");
          })
          .catch(error => {
            console.error("Error saving sequence:", error);
          });
    },
  },
  mounted() {
    this.fetchParty();
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
}

.pet-card-contents {
  display: flex;
  margin-left: 15%;
  flex-direction: row;
}

.pet-image {
  width: 100px;
  height: auto;
  display: flex;
  gap: 10px;
}

.pet-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  //margin-right: 150px;
}

.pet-actions {
  display: flex;
  flex-direction: column;
  margin-right: 50px;
  gap: 8px;
  //width: 150px;
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
</style>