<template>
  <div class="box has-text-success summary">
    <h2 class="title">{{typeOfDisplay}}</h2>
    <div class="columns is-multiline">
      <div class="column is-half">
        <h3 class="value">{{ (props.stats.distance) }} mi</h3>
        <caption class="caption">Distance</caption>
      </div>
      <div class="column is-half">
        <h3 class="value">{{  props.stats.duration }}</h3>
        <caption class="caption">Duration</caption>
      </div>
      <div class="column is-half">
        <h3 class="value">{{  props.stats.avgpace}} mph</h3>
        <caption class="caption">Avg Pace</caption>
      </div>
      <div class="column is-half">
        <h3 class="value">{{  props.stats.calories }}</h3>
        <caption class="caption">Calories</caption>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, type PropType } from 'vue'
import {type stats} from "@/model/workouts";

const props = defineProps({
  stats: {
    type: Object as PropType<stats>,
    required: true
  },
  typeOfDisplay: {
    type: String,
    required: true
  }
})

</script>

<style scoped></style>