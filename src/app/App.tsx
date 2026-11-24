import { BrowserRouter } from 'react-router'
import { LearnerProfileProvider } from '../learning/LearnerProfileProvider'
import { ThemeProvider } from '../theme/ThemeProvider'
import { AppRoutes } from './AppRoutes'

export function App() {
  return (
    <ThemeProvider>
      <LearnerProfileProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </LearnerProfileProvider>
    </ThemeProvider>
  )
}
