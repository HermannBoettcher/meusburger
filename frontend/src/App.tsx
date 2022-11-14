import { ChangeEvent, useState } from 'react'
import axios from 'axios'
import './App.css'
import { Box, InputBase, Stack } from '@mui/material'
import ProductsTable from './components/ProductsTable'
import { ThemeProvider, createTheme, alpha, styled } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Navbar from './components/Navbar'

export type Row = {
  id: number
  productName: string
  partNumber: string
  prize: number
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

function App() {
  const [rows, setRows] = useState<Row[]>([])

  const onShowAll = () => {}

  return (
    <div className='App'>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box>
          <main>
            <Navbar {...{ onShowAll }} />
            <Stack direction='column' spacing={2}>
              <ProductsTable {...{ rows }} />
            </Stack>
          </main>
        </Box>
      </ThemeProvider>
    </div>
  )
}

export default App
