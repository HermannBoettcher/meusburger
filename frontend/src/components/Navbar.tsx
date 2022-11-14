import { alpha, styled } from '@mui/material/styles'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Stack,
  Button,
  InputBase,
  Snackbar,
  Alert,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import {
  KeyboardEvent,
  ChangeEvent,
  useState,
  Dispatch,
  useEffect,
} from 'react'
import axios from 'axios'
import { Row } from '../App'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}))

const Navbar = ({
  setRows,
}: {
  setRows: Dispatch<React.SetStateAction<Row[]>>
}) => {
  const [id, setId] = useState('')
  const [file, setFile] = useState<FormData | null>(null)
  const [open, setOpen] = useState(false)

  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

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

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type === 'text/csv') {
        let formData = new FormData()
        formData.append('file', file)
        setFile(formData)
      } else setFile(null)
    }
  }

  const onSearchProduct = (event: KeyboardEvent) => {
    if (event.key === 'Enter')
      axios.get(`http://localhost:5000/product?id=${id}`).then((res) => {
        if (res.data.found) {
          const e = res.data.product
          setRows([
            {
              id: e[0],
              productName: e[1],
              partNumber: e[2],
              prize: e[3],
            } as Row,
          ])
        } else setOpen(true)
      })
  }

  useEffect(() => {
    if (file)
      axios
        .post('http://localhost:5000/upload', file)
        .then((res) => {
          console.log(res.statusText)
        })
        .finally(() => {
          setFile(null)
        })
  }, [file, setFile])

  return (
    <>
      <AppBar position='static'>
        <Toolbar>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' component='div'>
            Products
          </Typography>
          <Stack direction='row' spacing={2} flex={1} justifyContent='flex-end'>
            <Button variant='contained' component='label'>
              Upload CSV
              <input
                type='file'
                accept='text/csv'
                hidden
                onChange={onFileChange}
              />
            </Button>
            <Button variant='contained' onClick={onShowAll}>
              Show All
            </Button>
            <Search>
              <SearchIconWrapper sx={{ cursor: 'pointer' }}>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder='Search…'
                inputProps={{ 'aria-label': 'search' }}
                value={id}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setId(event.target.value)
                }
                onKeyUp={onSearchProduct}
                onKeyPress={(event: KeyboardEvent) => {
                  if (
                    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(
                      event.code.slice(-1)
                    ) === -1
                  )
                    event.preventDefault()
                  //   event.charCode >= 48 && event.charCode <= 57
                }}
              />
            </Search>
          </Stack>
        </Toolbar>
      </AppBar>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity='error'>
          Product not found.
        </Alert>
      </Snackbar>
    </>
  )
}

export default Navbar
