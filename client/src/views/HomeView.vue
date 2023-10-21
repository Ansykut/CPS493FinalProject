<script setup lang="ts">
import { defineComponent, ref } from 'vue'
import SmallStatistic from '@/components/SmallStatistic.vue';
import { getSession } from '../model/session'
import { type User, getUsersFriendsIds, getUserById } from "@/model/users";
import { getWorkoutsByUserId, type Workout, type stats} from "@/model/workouts";

const session = getSession()
const test = ref('test')

// checks if the workout is today
const workoutByTodayFilterFunc = (workout: Workout) => {
  const today = new Date(); 
  const todayMinusOne = new Date(today.setDate(today.getDate() - 1));
  
  const workoutDateDaysAgo = workout.dateDaysAgo;
  const workoutDate = new Date(today.setDate(today.getDate() - workoutDateDaysAgo));
  
  const from = todayMinusOne.getTime(); 
  const to = today.getTime();
  const workoutTime = workoutDate.getTime();
  if(workoutTime >= from && workoutTime <= to) {
    return true;
  }
  return false;
}

// checks if the workout is within the past week
const workoutByWeekFilterFunc = (workout: Workout) => {
  const today = new Date(); // 1501653935994
  const sevenDaysAgo = new Date(today.setDate(today.getDate() - 7));

  const workoutDateDaysAgo = workout.dateDaysAgo;
  const workoutDate = new Date(today.setDate(today.getDate() - workoutDateDaysAgo));
  
  const from = sevenDaysAgo.getTime(); 
  const to = today.getTime();
  const workoutTime = workoutDate.getTime();
  if(workoutTime >= from && workoutTime <= to) {
    return true;
  }
  return false;
}


// distance duration avgpace, calories, (today, this week, all time)
function getStats(dayFilterType:String): stats {
  let todaysStats = {
    distance: 0,
    duration: 0,
    avgpace: 0,
    calories: 0,
  } as stats;
  // we need our workouts
  const ourId = session.user?.id;
  if(!ourId) return todaysStats;
  const workouts = getWorkoutsByUserId(ourId) as Workout[];
  let filteredWorkouts = [];
  if(dayFilterType == "today")
    filteredWorkouts = workouts.filter(workout => workoutByTodayFilterFunc);
  else if(dayFilterType == "week")
    filteredWorkouts = workouts.filter(workout => workoutByWeekFilterFunc);
  else if(dayFilterType == "all")
    filteredWorkouts = workouts;
  else
    filteredWorkouts = workouts.filter(workout => workoutByTodayFilterFunc);
  console.log(dayFilterType, filteredWorkouts)

  todaysStats = filteredWorkouts.reduce((acc, workout) => {
    acc.distance += workout.distance;
    acc.duration += workout.duration;
    acc.avgpace += workout.distance / workout.duration;
    acc.calories += acc.avgpace * 2;
    return acc;
  }, {
    distance: 0,
    duration: 0,
    avgpace: 0,
    calories: 0,
  });
  // make todaysStats into a stats object

  return todaysStats;
}


</script>

<template>
  <div class="about columns is-multiline">
    <div class="column is-hidden-touch is-one-quarter">
      <div class="box is-small-hidden" />
    </div>
    <div class="column">
      <SmallStatistic typeOfDisplay="today" :stats="getStats('today')"/>
      <SmallStatistic typeOfDisplay="week" :stats="getStats('week')"/>
      <SmallStatistic typeOfDisplay="all" :stats="getStats('all')"/>
    </div>
    <div class="column is-one-quarter">
      <div class="box is-small-hidden" />
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}</style>
