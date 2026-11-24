import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeAll, describe, expect, it } from 'vitest'
import i18n from 'i18next'
import { initI18n } from '../../i18n/i18n'
import { ThemeProvider } from '../../theme/ThemeProvider'
import { SettingsPage } from './SettingsPage'

function renderSettings() {
  return render(
    <ThemeProvider>
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    </ThemeProvider>,
  )
}

describe('SettingsPage', () => {
  beforeAll(async () => {
    initI18n()
    await i18n.changeLanguage('en')
  })

  it('switches the interface language', async () => {
    renderSettings()
    fireEvent.click(screen.getByRole('radio', { name: 'Ελληνικά' }))
    expect(await screen.findByRole('heading', { name: 'Ρυθμίσεις' })).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('el')
    await i18n.changeLanguage('en')
  })

  it('applies the chosen theme to the document', () => {
    renderSettings()
    fireEvent.click(screen.getByRole('radio', { name: 'Dark' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
