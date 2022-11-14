import { alpha, styled } from '@mui/material/styles'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Stack,
  Button,
  InputBase,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import { ChangeEvent } from 'react'
import axios from 'axios'

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

const Navbar = ({ onShowAll }: { onShowAll: () => void }) => {
  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type === 'text/csv') {
        let formData = new FormData()
        formData.append('file', file)
        axios.post('http://localhost:5000/upload', formData).then((res) => {
          console.log(res.statusText)
        })
      }
    }
  }

  return (
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
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder='Search…'
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
