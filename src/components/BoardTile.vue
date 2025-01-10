<script setup>
defineProps({
  letter: String,
  height: Number,
  active: Boolean,
  central: Boolean,
  temp: Boolean,
})

function borderColor(active, temp, height) {
  if (active) {
    return 'border-blue-400'
  } else if (temp) {
    return 'border-green-500'
  } else if (height > 0) {
    return 'border-gray-500'
  } else {
    return 'border-transparent'
  }
}

function borderColorOuter(active, temp, height) {
  if (height === 0 && !active && !temp) {
    return 'border-gray-150'
  } else {
    return borderColor(active, temp, height)
  }
}

function tileShadow(height, active) {
  if (active) {
    return 'shadow-md shadow-blue-600'
  }
  switch (height) {
    case 1:
      return 'shadow-sm shadow-gray-200'
    case 2:
      return 'shadow-sm shadow-gray-400'
    case 3:
      return 'shadow shadow-gray-500'
    case 4:
      return 'shadow shadow-gray-600'
    case 5:
      return 'shadow-md shadow-gray-800'
    default:
      return ''
  }
}

function letterColor(temp) {
  if (temp) {
    return 'text-green-600'
  }
  return 'text-black'
}

function letterSize(letter, central, height) {
  if (central && height === 0) {
    return 'font-black sm:text-2xl md:text-3xl lg:text-4xl'
  } else if (letter !== 'Q') {
    return 'sm:font-bold text-base sm:text-xl md:text-3xl lg:text-4xl '
  } else {
    return 'sm:font-bold text-base sm:text-lg md:text-2xl lg:text-3xl '
  }
}

function heightIndicatorColor(height, temp) {
  if (temp) {
    return 'text-green-600'
  } else if (height === 5) {
    return 'text-red-700'
  } else {
    return 'text-gray-500'
  }
}
</script>

<template>
  <div
    class="text-center border"
    :class="`
      ${tileShadow(height, active)}
      ${borderColorOuter(active, temp, height)}`"
  >
    <div class="border-2" :class="`${borderColor(active, temp, height)}`">
      <div class="grid grid-cols-5 grid-rows-5 aspect-square">
        <div
          class="row-start-2 col-start-2 row-span-3 col-span-3 align-middle"
          :class="`${letterSize(letter, central, height)} ${letterColor(temp)}`"
        >
          {{ height === 0 && central ? '·' : letter === 'Q' ? 'Qu' : letter }}
        </div>
        <span
          class="row-start-1 col-start-5 text-xs md:font-bold lg:text-sm"
          :class="heightIndicatorColor(height, temp)"
          >{{ height > 0 ? height : '' }}</span
        >
      </div>
    </div>
  </div>
</template>

<style scoped></style>
