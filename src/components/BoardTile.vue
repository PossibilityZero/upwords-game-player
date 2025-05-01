<script setup>
import { inject } from 'vue'
import SvgArrowIcon from './svgIcons/SvgArrowIcon.vue'

const props = defineProps({
  letter: String,
  height: Number,
  active: Boolean,
  isFilter: Boolean,
  filterType: String,
  central: Boolean,
  temp: Boolean,
})

const inputHorizontal = inject('inputHorizontal')

function borderColor(active, temp, height) {
  if (active) {
    return 'border-blue-400'
  } else if (temp) {
    return 'border-green-500'
  } else if (height > 0) {
    switch (height) {
      case 1:
      case 2:
      case 3:
        return 'border-gray-500'
      case 4:
      case 5:
        return 'border-gray-700'
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

function tileShadowColor(height, active) {
  if (active) {
    return 'shadow-blue-600'
  } else if (height > 0) {
    return 'shadow-gray-800'
  } else {
    return ''
  }
}

function tileShadowStyle(height, active) {
  switch (height) {
    case 1:
      return 'z-10 shadow-[0_0px_1px_-1px] sm:shadow-[0_0px_2px_-1px]'
    case 2:
      return 'z-20 shadow-[0_1px_2px_-1px] sm:shadow-[0_3px_3px_-1px]'
    case 3:
      return 'z-30 shadow-[0_3px_2px_-1px] sm:shadow-[0_6px_3px_-1px]'
    case 4:
      return 'z-40 shadow-[0_4px_3px_-1px] sm:shadow-[0_8px_3px_-1px]'
    case 5:
      return 'z-50 shadow-[0_6px_3px_-1px] sm:shadow-[0_11px_3px_-1px]'
    default:
      return active ? 'shadow-[0_0px_3px_-1px] sm:shadow-[0_0px_8px_-2px]' : ''
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
    return 'font-bold text-xl sm:text-3xl lg:text-3xl 2xl:text-4xl'
  } else {
    return 'font-bold text-base sm:text-2xl lg:text-2xl 2xl:text-3xl'
  }
}

function heightIndicatorColor(height, temp) {
  if (temp) {
    return 'text-green-600'
  } else if (height === 5) {
    return 'text-red-700'
  } else {
    return 'text-gray-800 sm:text-gray-500'
  }
}

function backgroundColor(isFilter) {
  if (!isFilter) {
    return 'bg-slate-100'
  } else {
    switch (props.filterType) {
      case 'only':
        return 'bg-amber-100'
      case 'exclude':
        return 'bg-rose-200'
      case 'include':
        return 'bg-emerald-100'
      default:
        return 'bg-slate-100'
    }
  }
}

function bottomOffset(height) {
  switch (height) {
    case 1:
      return ''
    case 2:
      return 'bottom-[1px] md:bottom-[3px]'
    case 3:
      return 'bottom-[3px] md:bottom-[6px]'
    case 4:
      return 'bottom-[4px] md:bottom-[9px]'
    case 5:
      return 'bottom-[5px] md:bottom-[12px]'
    default:
      return ''
  }
}
</script>

<template>
  <div
    class="text-center aspect-square border select-none relative"
    :class="`
      ${tileShadowColor(height, active)}
      ${tileShadowStyle(height, active)}
      ${borderStyle(height)}
      ${borderColorOuter(active, temp, height)}
      ${backgroundColor(isFilter, height)}
      ${bottomOffset(height)}`"
  >
    <div
      class="border-1 sm:border-2"
      :class="`${borderStyle(height)} ${borderColor(active, temp, height)}`"
    >
      <div class="grid grid-cols-5 grid-rows-5 aspect-square">
        <div
          class="leading-none row-start-2 col-start-2 row-span-3 col-span-3"
          :class="`${letterSize(letter, central, height)} ${letterColor(temp)}`"
        >
          {{ height === 0 && central ? '·' : letter === 'Q' ? 'Qu' : letter }}
        </div>
        <div
          class="leading-none row-start-1 col-start-5 text-[0.6rem] md:font-bold sm:text-sm"
          :class="heightIndicatorColor(height, temp)"
        >
          {{ height > 0 ? height : '' }}
        </div>
        <SvgArrowIcon
          class="z-60"
          :class="`${active ? 'hidden sm:inline-block' : 'hidden'}`"
          :across="inputHorizontal"
          :color-override="'rgb(100 100 100)'"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
