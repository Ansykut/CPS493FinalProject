/* B"H
*/

import data from "../data/workouts.json";
/*
const friendWorkouts = [
  { id: 1, friendName: 'Andrew Sykut', type: 'Running', distance: '5', duration: '30', location: 'Park', photo: new URL('@/assets/workout_photos/running_park.png', import.meta.url).href },
  { id: 2, friendName: 'Sarah Kiel', type: 'Swimming', distance: '1', duration: '45', location: 'Beach', photo: new URL('@/assets/workout_photos/swimming_beach.png', import.meta.url).href },
  { id: 3, friendName: 'Steve Munich', type: 'Cycling', distance: '10', duration: '60', location: 'Hillside', photo: new URL('@/assets/workout_photos/cycling_uphill.png', import.meta.url).href } // '@/assets/workout_photos/cycling_uphill.png' }
];
*/
export interface Workout {
  userId: number,
  type: string,
  distance: number,
  duration: number,
  location: string,
  photo: string
}
const workoutPhotos: string[] = [
  "running_park.png",
  "swimming_beach.png",
  "cycling_uphill.png"
];
// for each workoutPhotos element, create a new URL object and assign it to the same workoutPhotos element
for (let i = 0; i < workoutPhotos.length; i++) {
  workoutPhotos[i] = new URL(`../assets/workout_photos/${workoutPhotos[i]}`, import.meta.url).href;
}
console.log(workoutPhotos)
export function getWorkouts(): Workout[] {
  const workouts: Workout[] = [];
  for (const x of data.workouts) {
    let photo = workoutPhotos[Math.floor(Math.random() * workoutPhotos.length)];
    //photo = new URL(photo, import.meta.url).href
    workouts.push({ ...x, photo });
  }
  return workouts;
}

export function getWorkoutsByUserId(userId: number): Workout | undefined {
  const workouts = getWorkouts();
  return getWorkouts().find(workout => workout.userId === userId % workouts.length);
}