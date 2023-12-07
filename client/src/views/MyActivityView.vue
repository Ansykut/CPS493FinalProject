<template>
  <div class="container has-text-centered">
    <!-- Activity Prompt -->
    <div class="columns is-centered mb-4">
      <div class="column is-half">
        <h2 class="title is-3">Please Log Your Activity</h2>
      </div>
    </div>

    <!-- Add Workout Button -->
    <div class="columns is-centered mb-5">
      <div class="column is-half">
        <button class="button is-primary is-medium is-fullwidth" @click="openModal">
          Add Workout
        </button>
      </div>
    </div>

    <!-- Display Workouts -->
<div v-if="workouts">
  <h2 class="title is-4 mt-5">My Workouts</h2>
  <div class="columns is-centered">
    <div class="column is-half">
      <div v-for="workout in workouts" :key="workout.id" class="workout-box">
        <!-- Display Username and Profile Picture -->
        <div class="user-details">
          <img :src="session.user?.image" alt="Profile Picture" class="profile-pic">
          <span class="user-activity-bold">{{ username }} went {{ workout.type.toLowerCase() }} at {{ workout.location }}</span> <!-- Updated class name -->
          <span class="small">{{ daysAgoToDateString(workout.dateDaysAgo) }}</span>
        </div>
            <!--<button class="delete is-small is-pulled-right" @click="_removeWorkout(workout.id)"></button>-->
            <div class="columns">
              <!-- Workout information column -->
              <div class="column is-8">
                <div class="distance-duration">
                  <div class="distance">Distance (mi): {{ workout.distance }}</div>
                  <hr> <!-- Line separating distance and duration -->
                  <div class="duration">Duration: {{ workout.duration }} mins</div>
                </div>
              </div>
              <!-- Photo column -->
              <div v-if="workout.photo" class="column is-4">
                <img :src="workout.photo" alt="Workout Photo">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal" :class="{ 'is-active': isModalActive }">
      <div class="modal-background" @click="closeModal"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Add Workout</p>
          <button class="delete" aria-label="close" @click="closeModal"></button>
        </header>
        <section class="modal-card-body">
          <!-- Workout Form -->
          <div class="field">
            <label class="label">Type of Exercise</label>
            <div class="control">
              <div class="select">
                <select v-model="currentWorkout.type">
                  <option>Running</option>
                  <option>Swimming</option>
                  <option>Cycling</option>
                  <!-- Add other options as needed -->
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <label class="label">Distance (in miles)</label>
            <div class="control">
              <input class="input" type="text" v-model="currentWorkout.distance" placeholder="Enter distance...">
            </div>
          </div>
          <div class="field">
            <label class="label">Duration (in mins)</label> <!-- Updated label -->
            <div class="control">
              <input class="input" type="number" v-model="currentWorkout.duration" placeholder="Enter duration in minutes..."> <!-- Changed to number type and updated placeholder -->
            </div>
          </div>
          <div class="field">
            <label class="label">Location</label>
            <div class="control">
              <input class="input" type="text" v-model="currentWorkout.location" placeholder="Enter location...">
            </div>
          </div>
          <!-- Photo Upload -->
          <div class="field">
            <label class="label">Upload Photo</label>
            <div class="control">
              <input type="file" @change="handlePhotoUpload">
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="saveWorkout">Save changes</button>
          <button class="button" @click="closeModal">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>

  
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getSession } from '../model/session';
import { getWorkoutsByUserId, type Workout, addWorkout, removeWorkout } from "@/model/workouts";

const daysAgoToDateString = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toLocaleDateString();
};

const session = getSession();
const username = computed(() => {
  return session.user ? session.user.firstName + " " + session.user.lastName : '';
});
const workouts = ref<Workout[]>();

const _removeWorkout = async (id:number) => {
  removeWorkout(id)
  workouts.value = await getWorkoutsByUserId(session.user?._id ?? -1)
};

const _getWorkouts = async () => {
  workouts.value = await getWorkoutsByUserId(session.user?._id ?? -1)
};

const isModalActive = ref(false);
const currentWorkout = ref<Workout>({
  id: 1,
  type: 'Running',
  dateDaysAgo: 0,
  distance: 0,
  duration: 0,
  location: "",
  photo: "",
});

function openModal() {
  isModalActive.value = true;
}

function closeModal() {
  isModalActive.value = false;
  resetCurrentWorkout();
}

function resetCurrentWorkout() {
  currentWorkout.value = {
    id: 1,
    type: 'Running',
    dateDaysAgo: 0,
    distance: 0,
    duration: 0,
    location: "",
    photo: "",
  };
}

function handlePhotoUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      currentWorkout.value.photo = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

async function saveWorkout() {
  currentWorkout.value.id = Date.now();
  try {
    await addWorkout({ ...currentWorkout.value }, session.user?._id ?? -1);
    debugger;
    workouts.value = await getWorkoutsByUserId(session.user?._id ?? -1);
  } catch (error) {
    console.error('Error adding workout:', error);
  }
  closeModal();
}
onMounted(() => {
  console.log('MyActivityView mounted');
  debugger;
  _getWorkouts();
});
</script>

<style scoped>
/* Make the button full width */
.button.is-fullwidth {
  width: 100%;
}

/* Additional styling for the activity prompt */
.title.is-3 {
  color: #363636;
  font-weight: bold;
  border-bottom: 2px solid #00d1b2;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

/* Styling for the workout box */
.workout-box {
  position: relative;
  padding: 1rem;
  border: 1px solid #dbdbdb;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.distance-duration {
  display: flex;
  flex-direction: column; /* Changed to column for stacking Distance & Duration */
  gap: 1rem; /* Adjusted gap value to separate Distance & Duration */
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

/* Added styling for the line separating distance and duration */
.distance-duration hr {
  border: 0.5px solid #dbdbdb;
  margin: 0.5rem 0;
  width: 100%;
}
/* Styling for user details */
.user-details {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}
.user-activity-bold { /* New class for bold and larger font size */
  font-weight: bold;
  font-size: 1.6rem; /* Adjust size as desired */
}

.profile-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
</style>
  