<script setup>
const props = defineProps({
  letter: String,
  height: Number,
  active: Boolean,
  isFilter: Boolean,
  filterType: String,
  central: Boolean,
  temp: Boolean,
  inputHorizontal: Boolean,
})

function borderColor(active, temp, height) {
  if (active) {
    return 'border-blue-400'
  } else if (temp) {
    return 'border-green-500'
  } else if (height > 0) {
    switch (height) {
      case 1:
        return 'border-gray-400'
      case 2:
        return 'border-gray-400'
      case 3:
        return 'border-gray-500'
      case 4:
        return 'border-gray-700'
      case 5:
        return 'border-gray-900'
    }
  } else {
    return 'border-transparent'
  }
}

function borderStyle(height) {
  return height > 0 ? 'rounded md:rounded-lg' : ''
}

function borderColorOuter(active, temp, height) {
  if (height === 0 && !active && !temp) {
    return 'border-gray-200'
  } else {
    return borderColor(active, temp, height)
  }
}

function tileShadow(height, active) {
  if (active) {
    return 'z-30 shadow-blue-600 shadow-[0_0px_8px_-2px]'
  }
  switch (height) {
    case 1:
      return 'shadow-sm shadow-gray-100'
    case 2:
      return 'shadow shadow-gray-400'
    case 3:
      return 'shadow shadow-gray-500'
    case 4:
      return 'shadow shadow-gray-700'
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

function backgroundColor(isFilter) {
  if (!isFilter) {
    return 'bg-slate-100'
  } else {
    switch (props.filterType) {
      case 'only':
        return 'bg-amber-400/20'
      case 'exclude':
        return 'bg-red-400/30'
      case 'include':
        return 'bg-lime-600/20'
      default:
        return 'bg-slate-100'
    }
  }
}

function arrowRight(active, horizontal) {
  if (!active || !horizontal) {
    return 'hidden'
  }
}

function arrowDown(active, horizontal) {
  if (!active || horizontal) {
    return 'hidden'
  }
}
</script>

<template>
  <div
    class="text-center aspect-square border select-none"
    :class="`
      ${tileShadow(height, active)}
      ${borderStyle(height)}
      ${borderColorOuter(active, temp, height)}
      ${backgroundColor(isFilter)}`"
  >
    <div class="border-2" :class="`${borderStyle(height)} ${borderColor(active, temp, height)}`">
      <div class="grid grid-cols-5 grid-rows-5 aspect-square">
        <div
          class="row-start-2 col-start-2 row-span-3 col-span-3 align-middle"
          :class="`${letterSize(letter, central, height)} ${letterColor(temp)}`"
        >
          {{ height === 0 && central ? '·' : letter === 'Q' ? 'Qu' : letter }}
        </div>
        <div
          class="row-start-1 col-start-5 text-xs md:font-bold lg:text-sm"
          :class="heightIndicatorColor(height, temp)"
        >
          {{ height > 0 ? height : '' }}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="rgb(150 150 150)"
          stroke="rgb(150 150 150)"
          class="row-start-5 col-start-5 size-4"
          :class="arrowRight(active, inputHorizontal)"
        >
          <path
            fill-rule="evenodd"
            d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z"
            clip-rule="evenodd"
          />
        </svg>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="rgb(150 150 150)"
          stroke="rgb(150 150 150)"
          class="row-start-5 col-start-5 size-4"
          :class="arrowDown(active, inputHorizontal)"
        >
          <path
            fill-rule="evenodd"
            d="M8 2a.75.75 0 0 1 .75.75v8.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.22 3.22V2.75A.75.75 0 0 1 8 2Z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
