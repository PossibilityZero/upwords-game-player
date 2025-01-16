<script setup>
defineProps({
  letter: String,
  active: Boolean,
  central: Boolean,
  temp: Boolean,
  inputHorizontal: Boolean,
})

function borderColor(active, temp) {
  if (active) {
    return 'border-blue-400'
  } else if (temp) {
    return 'border-green-500'
  } else {
    return 'border-gray-400'
  }
}

function tileShadow(active) {
  if (active) {
    return 'z-30 shadow-blue-600 shadow-[0_0px_8px_-2px]'
  } else {
    return 'shadow-sm shadow-gray-100'
  }
}

function letterColor(temp) {
  if (temp) {
    return 'text-green-600'
  }
  return 'text-black'
}

function letterSize(letter) {
  if (letter !== 'Q') {
    return 'sm:font-bold text-base sm:text-xl md:text-3xl lg:text-4xl '
  } else {
    return 'sm:font-bold text-base sm:text-lg md:text-2xl lg:text-3xl '
  }
}
</script>

<template>
  <div
    class="text-center aspect-square border rounded md:rounded-lg bg-slate-100 select-none"
    :class="`
      ${tileShadow(active)}
      ${borderColor(active, temp)}`"
  >
    <div class="border-2 rounded md:rounded-lg" :class="`${borderColor(active, temp)}`">
      <div class="grid grid-cols-5 grid-rows-5 aspect-square">
        <div
          class="row-start-2 col-start-2 row-span-3 col-span-3 align-middle"
          :class="`${letterSize(letter)} ${letterColor(temp)}`"
        >
          {{ letter === 'Q' ? 'Qu' : letter }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
