<script setup>
import { ref, computed } from 'vue'
import GameTools from './GameTools.vue'
import About from './About.vue'
import NotFound from './NotFound.vue'

const routes = {
  '/': GameTools,
  '/about': About,
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] || NotFound
})
</script>

<template>
  <component :is="currentView" />
</template>
