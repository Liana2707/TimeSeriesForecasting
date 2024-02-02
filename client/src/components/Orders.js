import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';

// Generate Order Data
function createData(id, date, value) {
  return { id, date, value };
}

const rows = [
  createData(
    0,
    '16 Mar, 2019',
    'Elvis Presley'
  ),
  createData(
    1,
    '16 Mar, 2019',
    'Paul McCartney'
  ),
  createData(2, '16 Mar, 2019', 'Tom Scholz'),
  createData(
    3,
    '16 Mar, 2019',
    'Michael Jackson'
  ),
  createData(
    4,
    '15 Mar, 2019',
    'Bruce Springsteen'
  ),
  createData(
    5,
    '15 Mar, 2019',
    'Bruce Springsteen'
  ),
  createData(
    6,
    '15 Mar, 2019',
    'Bruce Springsteen'
  ),
];

function preventDefault(event) {
  event.preventDefault();
}

export default function Orders() {
  return (
    <React.Fragment>
      <Title>DATA</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align='right'>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.date}</TableCell>
              <TableCell align='right'>{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more rows
      </Link>
    </React.Fragment>
  );
}