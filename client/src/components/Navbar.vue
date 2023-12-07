<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router'
import { getSession, loginWithServer, logout } from '../model/session'

const session = getSession()
const isActive = ref(false);
const isDropdownActive = ref(false);
const isLoggedIn = computed(() => session.user !== null);

const login = async (email: string, password: string) => {
  await loginWithServer(email, password)
}


</script>

<template>
  <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <RouterLink class="navbar-item" to="/">
        <img alt="Example logo" src="@/assets/logo.svg" width="28" height="28" />
      </RouterLink>

      <a role="button" class="navbar-burger burger" :class="{ 'is-active': isActive }" @click="isActive = !isActive"
        aria-label="menu" aria-expanded="false" data-target="navMenu">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navMenu" class="navbar-menu" :class="{ 'is-active': isActive }">
      <div class="navbar-start">
        <RouterLink class="navbar-item" to="/my-activity">
          <span class="icon mr-2"><i class="fas fa-user"></i></span>
          My Activity
        </RouterLink>
        <div v-if="isLoggedIn && session.user?.role == 'admin'" class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            <span class="icon mr-2"><i class="fas fa-cogs"></i></span>
            Admin
          </a>
          <div class="navbar-dropdown">
            <RouterLink class="navbar-item" to="/admin">Users</RouterLink>
          </div>
        </div>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <a v-if="!isLoggedIn" class="button is-primary">
              <strong>
              <RouterLink class="navbar-item" to="/signup">Sign Up</RouterLink>
            </strong>
            </a>
            <span v-if="isLoggedIn" class="mr-3">
              <span class="icon mr-4">
                <img :src="session.user?.image"  alt="Profile Picture" width="28" height="28" />
              </span>
              {{ session.user?.firstName + " " + session.user?.lastName }}
            </span>
            <a v-if="!isLoggedIn" class="button is-light">
              <strong>
              <RouterLink class="navbar-item" to="/login">Log in</RouterLink>
            </strong>
            </a>
            <a v-if="isLoggedIn" class="button is-light login-button"
              @click="logout">
              Log out
            </a>
            <a class="button is-info" href="https://X.com" target="_blank">
              <span class="icon mr-2">
                <i class="fab fa-twitter"></i>
              </span>
              Tweet
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
router-link-active {
  font-weight: bold;
  border-bottom: 2px solid #3273dc;
}

.navbar.is-dark {
  background-color: #363636;
}

.login-button:hover {
  background-color: #e8e8e8;
  color: #363636;
}
.navbar-dropdown {
  max-height: 13em;
  overflow-y: scroll;
}
</style>