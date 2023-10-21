<template>
  <div class="container has-text-centered">
    <h1>This is a Friend Activity page</h1>
    
    <!-- Display Workouts -->
    <h2 class="title is-4 mt-5">{{ username }}'s Friend's Workouts</h2>
    <div class="columns is-centered">
      <div class="column is-half">
        <div v-for="workout in friendWorkouts" :key="workout.id" class="workout-box">
          <!-- Display Username and Profile Picture -->
          <div class="user-details">
            <img :src="session.user?.image" alt="Profile Picture" class="profile-pic">
            <span class="user-activity-bold">{{ workout.friendName }} went {{ workout.type.toLowerCase() }} at {{ workout.location }}</span>
          </div>
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
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { getSession } from '../model/session';

// Get the session details
const session = getSession();

// Compute the username from the session
const username = computed(() => {
  return session.user ? session.user.firstName + " " + session.user.lastName : '';
});

// Mock data for display purposes
const friendWorkouts = [
  { id: 1, friendName: 'Andrew Sykut', type: 'Running', distance: '5', duration: '30', location: 'Park', photo: '@/assets/workout_photos/running_park.png' },
  { id: 2, friendName: 'Sarah Kiel', type: 'Swimming', distance: '1', duration: '45', location: 'Beach', photo: '@/assets/workout_photos/swimming_beach.png' },
  { id: 3, friendName: 'Steve Munich', type: 'Cycling', distance: '10', duration: '60', location: 'Hillside', photo: '@/assets/workout_photos/cycling_hillside.png' }
];
</script>

<style scoped>
/* Make the button full width */
.button.is-fullwidth {
  width: 100%;
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
  flex-direction: column;
  gap: 1rem;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

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

.user-activity-bold {
  font-weight: bold;
  font-size: 1.6rem;
}

.profile-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
</style>
