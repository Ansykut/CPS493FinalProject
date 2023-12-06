<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { loginWithServer } from "../model/session";
import type { User } from '../model/users';


const email = ref('');
const password = ref('');
const router = useRouter();

function login() {
    loginWithServer(email.value, password.value).then((user: User | null) => {
        if (user === null) {
            console.log("user is null");
            return;
        } else {
            router.push("/");
        }
       
    });
}

</script>

<template>
  <div class="hero-body">
    <div class="column is-half is-offset-one-quarter">
      <div class="box">
        <div class="field">
          <p class="control has-icons-left has-icons-right">
            <input v-model="email" class="input" type="email" placeholder="Email" />
            <span class="icon is-small is-left">
              <i class="fas fa-envelope"></i>
            </span>
          </p>
        </div>
        <div class="field">
          <p class="control has-icons-left">
            <input v-model="password" class="input" type="password" placeholder="Password" />
            <span class="icon is-small is-left">
              <i class="fas fa-lock"></i>
            </span>
          </p>
        </div>
        <div class="field">
          <p class="control">
            <button class="button is-success" @click="login">Login</button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Your styles here */
</style>