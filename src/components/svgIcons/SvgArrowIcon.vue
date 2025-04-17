<script setup>
const props = defineProps({
  across: Boolean,
  colorOverride: String,
})

const DEFAULT_COLOR = 'rgb(100 100 120)'
const color = props.colorOverride || DEFAULT_COLOR

const RIGHT_ARROW_STROKE =
  'M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z'
const DOWN_ARROW_STROKE =
  'M8 2a.75.75 0 0 1 .75.75v8.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.22 3.22V2.75A.75.75 0 0 1 8 2Z'

function stroke(horizontal) {
  return horizontal ? RIGHT_ARROW_STROKE : DOWN_ARROW_STROKE
}
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    :fill="color"
    :stroke="color"
    class="row-start-5 col-start-5 size-4"
  >
    <path fill-rule="evenodd" :d="stroke(across)" clip-rule="evenodd" />
  </svg>
</template>
