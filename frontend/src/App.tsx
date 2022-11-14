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

  const onShowAll = () => {
    axios.get('http://localhost:5000/products').then((res) => {
      // console.log('res.data', res.data.products)
      setRows(
        res.data.products.map((e: (string | number)[]) => {
          return { id: e[0], productName: e[1], partNumber: e[2], prize: e[3] }
        })
      )
    })
  }

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
