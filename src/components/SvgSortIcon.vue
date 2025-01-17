<script setup>
defineProps({
  show: Boolean,
  descending: Boolean,
  primary: Boolean,
})
function stroke(descending) {
  return descending
    ? 'M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25'
    : 'M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12'
}
function display(show, primary) {
  if (!show) {
    return 'hidden'
  } else {
    return primary ? 'stroke-gray-900' : 'stroke-gray-500'
  }
}
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    :class="display(show, primary)"
  >
    <path stroke-linecap="round" stroke-linejoin="round" :d="stroke(descending)" />
  </svg>
</template>

<style scoped></style>
