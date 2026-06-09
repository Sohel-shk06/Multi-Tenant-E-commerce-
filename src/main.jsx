import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './app/store/index'
import AuthProvider from './app/providers/AuthProvider'
import QueryProvider from './app/providers/QueryProvider'
import ThemeProvider from './app/providers/ThemeProvider'
import App from './App'
import './index.css'

/**
 * Application entry point.
 * Provider order (inside-out):
 *   BrowserRouter → Redux Provider → AuthProvider → QueryProvider → ThemeProvider → App
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <QueryProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </QueryProvider>
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)
