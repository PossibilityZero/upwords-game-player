<script setup>
import BoardContainer from './components/BoardContainer.vue'
import TileBagContainer from './components/TileBagContainer.vue'
import { ref } from 'vue'
import { PlayDirection, UpwordsGame } from 'upwords-toolkit'

function makePlay(tiles, start, direction) {
  return { tiles, start, direction }
}

const game = new UpwordsGame(1)
const tileRack1 = game.getTiles(0)
const tiles = ref(tileRack1.listTiles())
const boardStateKey = ref(0)
const tileBagKey = ref(0)

const word = ref('HELLO')
const startX = ref(5)
const startY = ref(3)
const direction = ref('horizontal')

function playMove(e) {
  console.log(e)
  const play = makePlay(
    word.value.toUpperCase(),
    [startX.value, startY.value],
    direction.value === 'horizontal' ? PlayDirection.Horizontal : PlayDirection.Vertical,
  )
  console.log(play)
  game.playMove(play)
  tiles.value = tileRack1.listTiles()
  boardStateKey.value += 1
  tileBagKey.value += 1
}
</script>

<template>
  <header>
    <div class="container">
      <h1 class="mb-4 text-4xl font-extrabold leading-none">Upwords Game</h1>
    </div>
  </header>
  <main>
    <BoardContainer v-bind:key="boardStateKey" :board="game.getUBF()" />
    <div id="tileRack" class="container mx-auto">
      <p class="text-4xl"><span>Tiles: </span>{{ tiles }}</p>
    </div>
    <form v-on:submit.prevent="playMove" class="container mx-auto">
      <div class="py-2">
        <label for="word">Word: </label>
        <input name="word" type="text" v-model="word" class="border border-gray-500" />
      </div>
      <div class="py-2">
        <label for="word">x: </label>
        <input v-model.number="startX" name="x" type="text" class="border border-gray-500" />
        <label class="px-1" for="word">y: </label>
        <input v-model.number="startY" name="y" type="text" class="border border-gray-500" />
      </div>
      <div class="py-2">
        <input v-model="direction" type="radio" name="direction" value="horizontal" />
        <label for="dirHorizontal" class="px-1">Horizontal</label>
        <input v-model="direction" type="radio" name="direction" value="vertical" />
        <label for="dirVertical" class="px-1">Vertical</label>
      </div>
      <button
        type="submit"
        class="px-2 py-2 border bg-indigo-400 text-white rounded font-bold text-lg"
      >
        Play move
      </button>
    </form>
    <TileBagContainer v-bind:key="tileBagKey" :tileBag="game.getTileBag()" />
  </main>
</template>

<style scoped></style>
