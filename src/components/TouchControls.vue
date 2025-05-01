<script setup>
import SvgXCircle from './svgIcons/SvgXCircle.vue'
import SvgCheckCircle from './svgIcons/SvgCheckCircle.vue'
import SvgArrowIcon from './svgIcons/SvgArrowIcon.vue'
import SvgKeyboardIcon from './svgIcons/SvgKeyboardIcon.vue'
import SvgFlagIcon from './svgIcons/SvgFlagIcon.vue'
import SvgInfoIcon from './svgIcons/SvgInfoIcon.vue'
import { computed, inject } from 'vue'

const emit = defineEmits(['clearPlay', 'confirmPlay', 'showKeyboard', 'flagSquare', 'showInfo'])

const inputHorizontal = inject('inputHorizontal')
function toggleInputDirection() {
  inputHorizontal.value = !inputHorizontal.value
}

const tempPlay = inject('tempPlay')
const colorX = computed(() => {
  return tempPlay.value ? 'rgb(190 60 50)' : 'rgb(200 200 200)'
})
const colorCheck = computed(() => {
  return tempPlay.value ? 'rgb(0 170 100)' : 'rgb(200 200 200)'
})
const confirmButtonClass = computed(() => {
  return tempPlay.value ? 'cursor-pointer' : 'cursor-not-allowed'
})
</script>

<template>
  <div id="touch-controls">
    <div class="flex justify-around h-15">
      <button title="Confirm current play" @click="emit('clearPlay')" :class="confirmButtonClass">
        <SvgXCircle class="size-8" :color="colorX" />
      </button>
      <button title="Confirm current play" @click="emit('confirmPlay')" :class="confirmButtonClass">
        <SvgCheckCircle class="size-8" :color="colorCheck" />
      </button>
      <button
        title="Show keyboard for touch devices"
        class="cursor-pointer"
        @click="emit('showKeyboard')"
      >
        <SvgKeyboardIcon class="size-8" />
      </button>
      <button
        title="Toggle filter on current square"
        class="cursor-pointer"
        @click="emit('flagSquare')"
      >
        <SvgFlagIcon class="size-8" />
      </button>
      <button
        :title="`Toggle input direction on board (current: ${inputHorizontal ? 'across' : 'down'})`"
        class="cursor-pointer"
        @click="toggleInputDirection"
      >
        <SvgArrowIcon class="size-8" :across="inputHorizontal" />
      </button>
      <button title="Show info overlay" class="cursor-pointer" @click="emit('showInfo')">
        <SvgInfoIcon class="size-8" />
      </button>
    </div>
  </div>
</template>

<style scoped></style>
