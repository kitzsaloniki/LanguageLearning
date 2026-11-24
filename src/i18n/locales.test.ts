import { describe, expect, it } from 'vitest'
import { LANGUAGE_CODES } from '../languages/languages'
import { resources } from './resources'

type Tree = { [key: string]: string | Tree }

function collectKeys(tree: Tree, prefix = ''): string[] {
  return Object.entries(tree).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    return typeof value === 'string' ? [path] : collectKeys(value, path)
  })
}

function collectEmptyKeys(tree: Tree, prefix = ''): string[] {
  return Object.entries(tree).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof value !== 'string') return collectEmptyKeys(value, path)
    return value.trim() === '' ? [path] : []
  })
}

const referenceKeys = collectKeys(resources.en.translation).sort()

describe.each(LANGUAGE_CODES)('locale "%s"', (language) => {
  const translation = resources[language].translation as Tree

  it('has exactly the same keys as the English reference', () => {
    expect(collectKeys(translation).sort()).toEqual(referenceKeys)
  })

  it('has no empty translations', () => {
    expect(collectEmptyKeys(translation)).toEqual([])
  })
})
