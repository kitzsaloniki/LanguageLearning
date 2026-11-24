import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import i18n from 'i18next'
import { initI18n } from '../../i18n/i18n'
import { LearnerProfileProvider } from '../../learning/LearnerProfileProvider'
import { loadLearnerProfile, saveLearnerProfile } from '../../learning/learnerProfile'
import { ThemeProvider } from '../../theme/ThemeProvider'
import { SettingsPage } from './SettingsPage'

function renderSettings() {
  return render(
    <ThemeProvider>
      <LearnerProfileProvider>
        <MemoryRouter>
          <SettingsPage />
        </MemoryRouter>
      </LearnerProfileProvider>
    </ThemeProvider>,
  )
}

describe('SettingsPage', () => {
  beforeAll(async () => {
    initI18n()
    await i18n.changeLanguage('en')
  })

  beforeEach(() => {
    saveLearnerProfile({ nativeLanguage: 'de', targetLanguage: 'el', level: 'A0' })
  })

  it('switches the interface language', async () => {
    renderSettings()
    const interfaceGroup = screen.getByRole('radiogroup', { name: 'Interface language' })
    fireEvent.click(within(interfaceGroup).getByRole('radio', { name: 'Ελληνικά' }))
    expect(await screen.findByRole('heading', { name: 'Ρυθμίσεις' })).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('el')
    await i18n.changeLanguage('en')
  })

  it('applies the chosen theme to the document', () => {
    renderSettings()
    fireEvent.click(screen.getByRole('radio', { name: 'Dark' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('swaps languages when the native language becomes the learning language', () => {
    renderSettings()
    const nativeGroup = screen.getByRole('radiogroup', { name: 'Native language' })
    fireEvent.click(within(nativeGroup).getByRole('radio', { name: 'Ελληνικά' }))
    expect(loadLearnerProfile()).toMatchObject({ nativeLanguage: 'el', targetLanguage: 'de' })
  })

  it('changes the level', () => {
    renderSettings()
    fireEvent.click(screen.getByRole('radio', { name: 'B1' }))
    expect(loadLearnerProfile()?.level).toBe('B1')
  })
})
