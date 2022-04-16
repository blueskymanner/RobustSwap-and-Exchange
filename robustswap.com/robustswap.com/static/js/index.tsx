import React from 'react'
import ReactDOM from 'react-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import {
  createMuiTheme,
  ThemeProvider
} from '@material-ui/core/styles'
import Providers from './Providers'
import App from './App'
import Mode from './style/theme.json'
import "./assets/css/font.css"

interface MuiThemeProviderProps {
  children: any
}

const MuiThemeProvider = ({ children }: MuiThemeProviderProps) => {
  const themeMode = 'dark';
  const theme = createMuiTheme((Mode as any)[themeMode]);
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <MuiThemeProvider>
        <CssBaseline />
        <App />
      </MuiThemeProvider>
    </Providers>
  </React.StrictMode>,
  document.getElementById('root'),
)