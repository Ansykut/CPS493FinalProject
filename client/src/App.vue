<script setup lang="ts">
import { ref, provide } from 'vue';
import { RouterView } from 'vue-router';
import Navbar from './components/Navbar.vue';

const isLoggedIn = ref(false);
const loggedInUser = ref('');

</script>

<template>
  <header>
    <Navbar />
  </header>
  <div class="container">
    <RouterView />
  </div>
</template>

<style scoped></style>
