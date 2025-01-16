<template>
  <h3>Details of {{id}}</h3>

</template>

<script>
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
  }
}
</script>

<style scoped>

</style>