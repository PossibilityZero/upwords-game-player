<script setup>
const props = defineProps({
  show: Boolean,
  across: Boolean,
  colorOverride: String,
})

const DEFAULT_COLOR = 'rgb(100 100 120)'
const color = props.colorOverride || DEFAULT_COLOR

function arrowRight(active, horizontal) {
  return active && horizontal ? 'inline-block' : 'hidden'
}

function arrowDown(active, horizontal) {
  return active && !horizontal ? 'inline-block' : 'hidden'
}
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    :fill="color"
    :stroke="color"
    class="row-start-5 col-start-5 size-4"
    :class="arrowRight(show, across)"
  >
    <path
      fill-rule="evenodd"
      d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z"
      clip-rule="evenodd"
    />
  </svg>

  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    :fill="color"
    :stroke="color"
    class="row-start-5 col-start-5 size-4"
    :class="arrowDown(show, across)"
  >
    <path
      fill-rule="evenodd"
      d="M8 2a.75.75 0 0 1 .75.75v8.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.22 3.22V2.75A.75.75 0 0 1 8 2Z"
      clip-rule="evenodd"
    />
  </svg>
</template>
