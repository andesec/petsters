<template>
  <h3>Details of {{id}}</h3>
  <h3>{{this.pet.n}}</h3>
  <br>


</template>

<script>
import PetsterService from "@/services/PetsterService.js";

export default {
  name: "PetInfoComponent",
  props: {
    id: {
      type: String,
      required: true
    }
  },
  mounted() {
    console.log("PetInfoComponent mounted")
  },
  methods: {
    async loadPetInfo() {
      this.pet = await PetsterService.loadPetInfo(this.id)
    }
  },
  data() {
    return {
      pet: {},
    }
  },
}
</script>

<style scoped>

</style>