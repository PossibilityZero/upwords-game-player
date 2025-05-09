import { render } from '@testing-library/vue'
import TileBagContainer from './TileBagContainer.vue'
import { TileBag } from 'upwords-toolkit'

describe('default state', () => {
  const testTileBag = new TileBag()

  it('should display the default title and remaining tiles', () => {
    const { getByText } = render(TileBagContainer, {
      props: {
        tileBag: testTileBag,
        showAllLetters: true,
      },
    })
    getByText('Count: 100')
    getByText('Tile Bag')
  })

  it('should show the override title if provided', () => {
    const overrideText = 'Reserved tiles'
    const { getByText } = render(TileBagContainer, {
      props: {
        overrideTitle: overrideText,
        tileBag: testTileBag,
        showAllLetters: true,
      },
    })
    getByText(overrideText)
  })
})
