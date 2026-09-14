import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { store } from '@/store'
import { organicTheme } from '@/theme/organicTheme'
import { FontScaleProvider } from '@/theme/FontScale/FontScaleProvider'
import { App } from './App'
import './assets/globalStyles.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('No se encontró el elemento raíz #root')
}

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={organicTheme}>
        <CssBaseline />
        <FontScaleProvider>
          <App />
        </FontScaleProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>
)
