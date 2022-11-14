import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Row } from '../App'

function createData(
  id: number,
  productName: string,
  partNumber: string,
  prize: number
) {
  return { id, productName, partNumber, prize }
}

const ProductsTable = ({ rows }: { rows: Row[] }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell align='right'>Id</TableCell>
            <TableCell align='left'>Product Name</TableCell>
            <TableCell align='left'>Part Number</TableCell>
            <TableCell align='right'>Prize (€)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component='th' align='right' scope='row'>
                {row.id}
              </TableCell>
              <TableCell align='left'>{row.productName}</TableCell>
              <TableCell align='left'>{row.partNumber}</TableCell>
              <TableCell align='right'>{row.prize}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ProductsTable
