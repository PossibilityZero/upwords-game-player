<script setup>
defineProps({
  validPlays: Array,
})
</script>

<template>
  <div
    class="overflow-hidden border rounded-lg bg-slate-200 lg:w-[40rem] max-h-[50vh] select-none"
    @mouseleave="$emit('clearCandidate')"
  >
    <div class="grid grid-cols-5 text-lg">
      <button>Word</button>
      <button>Start</button>
      <button>Direction</button>
      <button>Points</button>
      <button>Tiles</button>
    </div>
    <div class="w-100 text-lg overflow-y-scroll max-h-[50vh]">
      <div
        class="grid grid-cols-5 font-mono hover:bg-slate-300"
        @mouseover="$emit('viewCandidate', play)"
        @click="$emit('playCandidate', play)"
        v-for="(play, index) in validPlays"
        :key="index"
      >
        <span>{{ play.tiles.replace(/ /g, '.') }}</span>
        <span>{{ play.start }}</span>
        <span>{{ play.direction === 0 ? 'Across' : 'Down' }}</span>
        <span>{{ play.points }}</span>
        <span>{{ play.numTiles }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
