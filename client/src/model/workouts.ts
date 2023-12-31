/* B"H
*/

import { api } from "./session"

const workoutPhotos: string[] = [
  "running_park.png",
  "swimming_beach.png",
  "cycling_uphill.png"
];
// for each workoutPhotos element, create a new URL object and assign it to the same workoutPhotos element
for (let i = 0; i < workoutPhotos.length; i++) {
  workoutPhotos[i] = new URL(`../assets/workout_photos/${workoutPhotos[i]}`, import.meta.url).href;
}

import data from "../data/workouts.json";
import { reactive } from "vue";
export const Workouts = reactive(sanitizeWorkoutData());
/*
const friendWorkouts = [
  { id: 1, friendName: 'Andrew Sykut', type: 'Running', distance: '5', duration: '30', location: 'Park', photo: new URL('@/assets/workout_photos/running_park.png', import.meta.url).href },
  { id: 2, friendName: 'Sarah Kiel', type: 'Swimming', distance: '1', duration: '45', location: 'Beach', photo: new URL('@/assets/workout_photos/swimming_beach.png', import.meta.url).href },
  { id: 3, friendName: 'Steve Munich', type: 'Cycling', distance: '10', duration: '60', location: 'Hillside', photo: new URL('@/assets/workout_photos/cycling_uphill.png', import.meta.url).href } // '@/assets/workout_photos/cycling_uphill.png' }
];
*/
export interface Workout {
  id: number,
  dateDaysAgo: number,
  type: string,
  distance: number,
  duration: number,
  location: string,
  photo: string
}

export interface stats {
  distance: number,
  duration: number,
  avgpace: number,
  calories: number,
}

console.log(workoutPhotos)
export function sanitizeWorkoutData(): Workout[] {
  const workouts: Workout[] = [];
  for (const x of data.workouts) {
    let photo = workoutPhotos[Math.floor(Math.random() * workoutPhotos.length)];
    //photo = new URL(photo, import.meta.url).href
    workouts.push({ ...x, photo });
  }
  return workouts;
}

export function getWorkouts(): Promise<Workout[]> {
  return api('/workouts');
}

export async function addWorkout(workout: Workout, userId: number) {
  try {
    // Assuming '/workouts' is your server's endpoint for adding a workout
    await api('/workouts', {
      workout,
      userId
    }, 'POST');
  } catch (error) {
    console.error('Error in adding workout:', error);
  }
}

// remove workout by id
export function removeWorkout(id: number) {
  const index = Workouts.findIndex(workout => workout.id === id);
  console.log("deleting activtity", index, "with id", id, "from", Workouts)
  Workouts.splice(index, 1);
}

export async function getWorkoutsByUserId(userId: number): Promise<Workout[]> {
  return api('/workouts/user/' + userId);
}