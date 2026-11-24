import { describe, expect, it } from 'vitest'
import { ContentValidationError, parseContentPack } from './loadContentPack'
import { createTestPack } from './testPack'

describe('parseContentPack', () => {
  it('returns a valid pack unchanged', () => {
    const pack = createTestPack()
    expect(parseContentPack(pack)).toEqual(pack)
  })

  it('rejects data with the wrong shape', () => {
    const raw = { ...createTestPack(), words: [{ id: 'Not Kebab' }] }
    expect(() => parseContentPack(raw)).toThrow(ContentValidationError)
  })

  it('lists integrity issues in the error', () => {
    const pack = createTestPack()
    pack.texts[0].topicIds = ['space']
    expect(() => parseContentPack(pack)).toThrow(/Unknown topic "space"/)
  })
})
