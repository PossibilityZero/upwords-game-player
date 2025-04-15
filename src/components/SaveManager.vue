<script setup>
import { ref } from 'vue'
import SvgDeleteIcon from './svgIcons/SvgDeleteIcon.vue'
import SvgLoadIcon from './svgIcons/SvgLoadIcon.vue'
import { UpwordsGame } from 'upwords-toolkit'

const props = defineProps({
  game: UpwordsGame,
})

const emit = defineEmits(['newGame', 'loadGame'])
const saveManagerKey = ref(0)
const saveGameName = ref('')
const newGamePlayerCount = ref(2)

const savedGames = ref(getSavedGames())

;(function init() {
  reset()
})()

function generateAutomaticSaveName(granular = false) {
  const SECONDS_PER_MINUTE = 60
  const MILLISECONDS_PER_SECOND = 1000
  const timeNow = new Date()
  timeNow.setTime(
    timeNow.getTime() - timeNow.getTimezoneOffset() * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND,
  )
  if (granular) {
    return `Saved Game (${timeNow.toISOString()})`
  } else {
    return `Saved Game (${timeNow.toISOString().split('T')[0]})`
  }
}

function getSavedGames() {
  return Object.keys(JSON.parse(localStorage.getItem('saved-games') || '{}'))
}

function updateSavedGamesList() {
  savedGames.value.length = 0
  Object.keys(JSON.parse(localStorage.getItem('saved-games') || '{}')).forEach((gameId) => {
    savedGames.value.push(gameId)
  })
}

function newGame() {
  emit('newGame', newGamePlayerCount.value)
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

function copyToClipboard(type) {
  let copyText
  switch (type) {
    case 'game':
      copyText = props.game.serialize()
      break
    case 'ubf':
      copyText = JSON.stringify(props.game.getUBF())
      break
    case 'tiles':
      copyText = props.game.getTileBag().listTiles()
      break
  }
  if (copyText) {
    navigator.clipboard.writeText(copyText)
  }
}

function reset() {
  newGamePlayerCount.value = 2
  saveManagerKey.value++
  saveGameName.value = generateAutomaticSaveName()
}

defineExpose({ reset })
</script>

<template>
  <div :key="saveManagerKey">
    <form class="bg-zinc-200 rounded-lg p-2 mb-2" @submit.prevent="newGame">
      <h3 class="font-bold text-lg">New Game Setup</h3>
      <div class="py-1">
        <label>Players (1 - 4) </label>
        <input
          v-model="newGamePlayerCount"
          class="rounded bg-gray-50 px-1"
          type="number"
          name="numPlayers"
          value="2"
          min="1"
          max="4"
        />
      </div>
      <button
        class="mr-2 px-2 py-1 bg-slate-600 text-white rounded-md hover:bg-slate-900 hover:cursor-pointer"
      >
        New game
      </button>
    </form>

    <div class="my-3">
      <button
        class="px-1 mr-2 bg-slate-300 rounded hover:bg-slate-400 hover:cursor-pointer"
        @click="copyToClipboard('tiles')"
      >
        Copy tilebag
      </button>
      <button
        class="px-1 mr-2 bg-slate-300 rounded hover:bg-slate-400 hover:cursor-pointer"
        @click="copyToClipboard('ubf')"
      >
        Copy board
      </button>
      <button
        class="px-1 mr-2 bg-slate-300 rounded hover:bg-slate-400 hover:cursor-pointer"
        @click="copyToClipboard('game')"
      >
        Copy game
      </button>
    </div>

    <form @submit.prevent="saveGame">
      <input
        v-model="saveGameName"
        name="saveName"
        type="text"
        class="px-1 mb-1 w-60 rounded bg-white"
        autocomplete="off"
      />
      <button class="mx-2 px-1 bg-slate-300 rounded-md hover:bg-slate-400 hover:cursor-pointer">
        Save game
      </button>
    </form>

    <div>
      <div
        class="flex flex-nowrap max-w-100 items-center my-2"
        v-for="(saved, index) in savedGames"
        :key="index"
      >
        <button
          class="inline-block px-1 mr-2 bg-slate-200 rounded hover:cursor-pointer"
          @click="loadGame(saved)"
        >
          <SvgLoadIcon />
        </button>
        <button
          class="inline-block px-1 mr-2 bg-slate-200 rounded hover:cursor-pointer"
          @click="deleteSave(saved)"
        >
          <SvgDeleteIcon />
        </button>
        <span
          :title="saved"
          class="whitespace-nowrap overflow-hidden text-ellipsis font-bold mr-2 text-lg"
          >{{ saved }}</span
        >
      </div>
    </div>
  </div>
</template>

<style scoped></style>
