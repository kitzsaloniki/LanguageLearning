import { fireEvent, render, screen } from '@testing-library/react'
import i18n from 'i18next'
import { MemoryRouter } from 'react-router'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { AppRoutes } from '../../app/AppRoutes'
import { initI18n } from '../../i18n/i18n'
import { LearnerProfileProvider } from '../../learning/LearnerProfileProvider'
import { loadLearnerProfile, saveLearnerProfile } from '../../learning/learnerProfile'
import { ThemeProvider } from '../../theme/ThemeProvider'

function renderApp(path = '/') {
  return render(
    <ThemeProvider>
      <LearnerProfileProvider>
        <MemoryRouter initialEntries={[path]}>
          <AppRoutes />
        </MemoryRouter>
      </LearnerProfileProvider>
    </ThemeProvider>,
  )
}

function clickContinue() {
  fireEvent.click(screen.getByRole('button', { name: /continue|weiter/i }))
}

describe('onboarding', () => {
  beforeAll(() => {
    initI18n()
  })

  beforeEach(async () => {
    window.localStorage.clear()
    await i18n.changeLanguage('en')
  })

  it('sends first-time visitors to onboarding', () => {
    renderApp('/')
    expect(screen.getByRole('heading', { name: 'Which language do you know best?' })).toBeVisible()
  })

  it('saves the choices and lands on Today', async () => {
    renderApp('/')

    fireEvent.click(screen.getByRole('radio', { name: /Deutsch/ }))
    expect(await screen.findByRole('heading', { name: /Welche Sprache sprichst du/ })).toBeVisible()
    clickContinue()

    expect(screen.queryByRole('radio', { name: /^Deutsch/ })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('radio', { name: /English/ }))
    clickContinue()

    expect(screen.getByRole('radio', { name: /Deutsch/ })).toHaveAttribute('aria-checked', 'true')
    clickContinue()

    fireEvent.click(screen.getByRole('radio', { name: /A2/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Los geht’s' }))

    expect(await screen.findByText('Du lernst Englisch · Niveau A2')).toBeVisible()
    expect(loadLearnerProfile()).toEqual({
      nativeLanguage: 'de',
      targetLanguage: 'en',
      level: 'A2',
    })
  })

  it('skips onboarding once a profile exists', () => {
    saveLearnerProfile({ nativeLanguage: 'en', targetLanguage: 'el', level: 'A0' })
    renderApp('/welcome')
    expect(screen.getByText('You are learning Greek · Level A0')).toBeVisible()
  })
})
