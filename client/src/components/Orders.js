import * as React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';


export default function Orders({ mainData }) {
  return (
    <Paper sx={{
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      height: 500,
    }}
    >
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {mainData.map((row, index) => (
              <TableRow key={index}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}