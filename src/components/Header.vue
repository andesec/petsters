<template>
  <header class="header">
    <h1>Petsters</h1>
      <nav>
        <router-link to="/map">Map</router-link>
<!--        <router-link to="/battle">Battle</router-link>-->
        <router-link to="/profile">Profile</router-link>
        <router-link to="/gyms">Gyms</router-link>
      </nav>
  </header>
</template>

<script>
export default {};
</script>

<style scoped>
@media (max-width: 450px) {
  nav {
    display: none;

  }
}

.header {
  display: flex;
  align-items: center; /* Vertically align items */
  justify-content: space-between;
  background-color: #3f51b5; /* Adjust color if needed */
  padding: 10px 20px;
}

.header h1 {
  color: white;
}

.header nav {
  display: flex;
  gap: 15px; /* Spacing between navigation links */
}

.header nav a {
  color: white;
  text-decoration: none;
  font-size: 16px;
}

.header nav a:hover {
  text-decoration: underline;
}
</style>