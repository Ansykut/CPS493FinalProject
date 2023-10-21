<script setup lang="ts">
// we want to import all users and display them on this admin page
import { type User, deleteUserById, Users } from "@/model/users";
import { getSession } from "@/model/session";

const session = getSession();

function _deleteUserById(id: number) {
  deleteUserById(id);
}
</script>

<template>
  <table class="table">
    <thead><tr>
      <th>ID</th>
      <th>First Name</th>
      <th>Last Name</th>
      <th>Email</th>
      <th>Role</th>
      <th>Image</th>
    </tr></thead>
    <tbody>
      <tr v-for="user in Users">
        <th>{{ user.id }}</th>
        <td>{{ user.firstName }}</td>
        <td>{{ user.lastName }}</td>
        <td>{{ user.email }}</td>
        <td>{{ user.role }}</td>
        <td><img :src="user.image" width="50" height="50" /></td>
        <td><button v-if="session.user && user.id != session.user.id" class="button" @click.prevent="deleteUserById(user.id)">Delete</button></td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped></style>