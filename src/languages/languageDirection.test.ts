import { describe, expect, it } from 'vitest'
import { listLanguageDirections, reverseDirection } from './languageDirection'

describe('listLanguageDirections', () => {
  it('lists all six directions between three languages', () => {
    const directions = listLanguageDirections().map(({ source, target }) => `${source}-${target}`)
    expect(directions.sort()).toEqual(['de-el', 'de-en', 'el-de', 'el-en', 'en-de', 'en-el'])
  })
})

describe('reverseDirection', () => {
  it('swaps source and target', () => {
    expect(reverseDirection({ source: 'de', target: 'el' })).toEqual({ source: 'el', target: 'de' })
  })
})
