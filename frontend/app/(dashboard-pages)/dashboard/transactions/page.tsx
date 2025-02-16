'use client';
import {Box, Breadcrumbs, LinearProgress, Link, Typography} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// export default function Transactions() {
//     return (
//         <Box sx={{ height: '115vh' }}>
//             <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
//                 <Link underline="hover" color="inherit" href="/frontend/public">
//                     Home
//                 </Link>
//                 <Typography color="text.primary">Transactions</Typography>
//             </Breadcrumbs>
//             <Typography variant="h4" gutterBottom>
//                 Transactions
//             </Typography>
//             <Typography variant="body1">
//                 This is your transactions page.
//             </Typography>
//         </Box>
//     );
// }


import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination } from '@mui/material';

//  these are mock transactions which will be fetched from database in real scenario
const mockTransactions = Array.from({ length: 25 }, (_, index) => ({
  amount: Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000,
  type: index % 2 === 0 ? 'Deposit' : 'Withdrawal',
  date: new Date(2025, 1, 14).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
}));    

const TransactionList = () => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;
  const paginatedTransactions = mockTransactions.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
        <Box sx={{ height: '115vh' }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/frontend/public">
                    Home
                </Link>
                <Typography color="text.primary">Transactions</Typography>
            </Breadcrumbs>
            <Typography variant="h4" gutterBottom>
                Transactions
            </Typography>
            <Typography variant="body1">
                This is your transactions page.
            </Typography>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Amount</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedTransactions.map((tx, index) => (
            <TableRow key={index}>
              <TableCell>{tx.amount}</TableCell>
              <TableCell>{tx.type}</TableCell>
              <TableCell>{tx.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {mockTransactions.length > itemsPerPage && (
          <Pagination
          count={Math.ceil(mockTransactions.length / itemsPerPage)}
          page={page}
          onChange={(event, value) => setPage(value)}
          sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
          />
        )}
    </TableContainer>
    </Box>
  );
};

export default TransactionList;

