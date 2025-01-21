<script setup>
import { ref } from 'vue'
import SvgDeleteIcon from './svgIcons/SvgDeleteIcon.vue'
import SvgLoadIcon from './svgIcons/SvgLoadIcon.vue'

const props = defineProps({
  game: Object,
})

const emit = defineEmits(['newGame', 'loadGame'])
const saveManagerKey = ref(0)
const saveGameName = ref('')
const newGamePlayerCount = ref(2)
const newGameAutomaticDraw = ref(false)

const savedGames = ref(getSavedGames())

;(function init() {
  reset()
})()

function generateAutomaticSaveName(granular = false) {
  const timeNow = new Date()
  if (granular) {
    return `Saved Game (${timeNow.toISOString()})`
  } else {
    return `Saved Game (${timeNow.toISOString().split('T')[0]})`
  }
}

function getSavedGames() {
  return Object.keys(JSON.parse(localStorage.getItem('saved-games') || {}))
}

function updateSavedGamesList() {
  savedGames.value.length = 0
  Object.keys(JSON.parse(localStorage.getItem('saved-games') || {})).forEach((gameId) => {
    savedGames.value.push(gameId)
  })
}

function newGame() {
  emit('newGame', newGamePlayerCount.value, !newGameAutomaticDraw.value)
}

function saveGame() {
  const gameId = saveGameName.value || generateAutomaticSaveName(true)
  const savedGames = JSON.parse(localStorage.getItem('saved-games')) || {}
  savedGames[gameId] = props.game.serialize()
  localStorage.setItem('saved-games', JSON.stringify(savedGames))
  updateSavedGamesList()
}

function loadGame(id) {
  const savedGames = JSON.parse(localStorage.getItem('saved-games')) || {}
  saveGameName.value = id
  emit('loadGame', savedGames[id])
}

function deleteSave(id) {
  const savedGames = JSON.parse(localStorage.getItem('saved-games')) || {}
  const deletedGames = JSON.parse(localStorage.getItem('deleted-games')) || []
  deletedGames.push({
    id,
    game: savedGames[id],
  })
  delete savedGames[id]
  localStorage.setItem('saved-games', JSON.stringify(savedGames))
  localStorage.setItem('deleted-games', JSON.stringify(deletedGames))
  updateSavedGamesList()
}

function reset() {
  newGamePlayerCount.value = 2
  newGameAutomaticDraw.value = false
  saveManagerKey.value++
  saveGameName.value = generateAutomaticSaveName()
}

defineExpose({ reset })
</script>

<template>
  <div :key="saveManagerKey">
    <form class="bg-zinc-200 p-2 mb-2" @submit.prevent="newGame">
      <h3 class="font-bold text-lg">New Game Setup</h3>
      <div class="py-1">
        <label>Automatic tile draw </label>
        <input v-model="newGameAutomaticDraw" type="checkbox" name="manualTiles" value="vertical" />
      </div>
      <div class="py-1">
        <label>Players (1 - 4) </label>
        <input
          v-model="newGamePlayerCount"
          class="px-1"
          type="number"
          name="numPlayers"
          value="2"
          min="1"
          max="4"
        />
      </div>
      <button class="mr-2 p-2 bg-slate-300 rounded-md hover:bg-slate-400">New game</button>
    </form>

    <form @submit.prevent="saveGame">
      <input
        v-model="saveGameName"
        name="saveName"
        type="text"
        class="px-1 mb-1 w-80 rounded border border-gray-500"
        autocomplete="off"
      />
      <button class="mx-2 p-2 bg-slate-300 rounded-md hover:bg-slate-400">Save game</button>
    </form>
    <div>
      <div class="my-2" v-for="(saved, index) in savedGames" :key="index">
        <button class="px-1 mr-2 bg-slate-200 rounded" @click="loadGame(saved)">
          <SvgLoadIcon />
        </button>
        <button class="px-1 mr-2 bg-slate-200 rounded" @click="deleteSave(saved)">
          <SvgDeleteIcon />
        </button>
        <span class="font-bold mr-2 text-lg">{{ saved }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
