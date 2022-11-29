import '@/styles/layers.css'

import { createTheme, ThemeProvider } from '@mui/material'

import { Container } from '@/components'
import { Guard } from '@/config'
import { AuthProvider } from '@/context'

type Props = {
  children: JSX.Element
}

export default function App({ children }: Props) {
  const theme = createTheme()
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Guard>
          <Container>{children}</Container>
        </Guard>
      </AuthProvider>
    </ThemeProvider>
  )
}
