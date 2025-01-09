<script setup>
import BoardContainer from './components/BoardContainer.vue'
import TileBagContainer from './components/TileBagContainer.vue'
import MoveForm from './components/MoveForm.vue'
import { ref } from 'vue'
import { UpwordsGame } from 'upwords-toolkit'

const game = new UpwordsGame(1)
const tileRack1 = game.getTiles(0)
const tiles = ref(tileRack1.listTiles())
const boardStateKey = ref(0)
const tileBagKey = ref(0)

function getPlay(data) {
  console.log('getplay', data)
  playMove(data)
}

function playMove(play) {
  console.log(play)
  game.playMove(play)
  tiles.value = tileRack1.listTiles()
  boardStateKey.value += 1
  tileBagKey.value += 1
}
</script>

<template>
  <header>
    <div class="container mx-auto">
      <h1 class="my-4 text-5xl font-extrabold leading-none">Upwords Game</h1>
    </div>
  </header>
  <main>
    <BoardContainer v-bind:key="boardStateKey" :board="game.getUBF()" />
    <div id="tileRack" class="container mx-auto">
      <p class="text-4xl"><span>Tiles: </span>{{ tiles }}</p>
    </div>
    <MoveForm @play="getPlay" />
    <TileBagContainer v-bind:key="tileBagKey" :tileBag="game.getTileBag()" />
  </main>
</template>

<style scoped></style>
