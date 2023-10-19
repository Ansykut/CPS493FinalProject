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
    <div v-if="workouts.length">
      <h2 class="title is-4 mt-5">My Workouts ({{ username }})</h2>
      <div class="columns is-centered">
        <div class="column is-half">
          <div v-for="workout in workouts" :key="workout.id" class="workout-box">
            <button class="delete is-small is-pulled-right" @click="deleteWorkout(workout.id)"></button>
            <h3 class="title is-5">{{ workout.type }}</h3>
            <div class="columns">
              <!-- Workout information column -->
              <div class="column is-8">
                <div class="distance-duration">
                  <span class="distance">Distance (mi): {{ workout.distance }}</span>
                  <span class="duration">Duration: {{ workout.duration }}</span>
                </div>
                <p><strong>Location:</strong> {{ workout.location }}</p>
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
            <label class="label">Duration (in HH:MM format)</label>
            <div class="control">
              <input class="input" type="text" v-model="currentWorkout.duration" placeholder="Enter duration...">
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

<script>
export default {
  data() {
    return {
      isModalActive: false,
      currentWorkout: {
        id: null,
        type: 'Running',
        distance: '',
        duration: '',
        location: '',
        photo: null,
      },
      workouts: [],
      username: 'John Doe' // replace with actual logic to fetch the logged-in user's name
    };
  },
  methods: {
    openModal() {
      this.isModalActive = true;
    },
    closeModal() {
      this.isModalActive = false;
      this.resetCurrentWorkout();
    },
    resetCurrentWorkout() {
      this.currentWorkout = {
        id: null,
        type: 'Running',
        distance: '',
        duration: '',
        location: '',
        photo: null,
      };
    },
    handlePhotoUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.currentWorkout.photo = URL.createObjectURL(file);
      }
    },
    saveWorkout() {
      this.currentWorkout.id = Date.now();
      this.workouts.push({ ...this.currentWorkout });
      this.closeModal();
    },
    deleteWorkout(workoutId) {
      this.workouts = this.workouts.filter(workout => workout.id !== workoutId);
    },
  },
};
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

/* Styling for distance and duration */
.distance-duration {
  display: flex;
  gap: 2rem;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}
</style>
