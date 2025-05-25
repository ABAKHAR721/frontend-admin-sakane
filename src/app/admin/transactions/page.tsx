'use client'
import {
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, CircularProgress, Stack, TextField, TablePagination, Chip
} from '@mui/material';
import { useEffect, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { getTransactions } from '../../../services/api/adminApi'; 

interface Transaction {
  id: number;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  type: 'purchase' | 'usage';
  description: string;
  date: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const [userSearch, setUserSearch] = useState('');
  const [month, setMonth] = useState<Date | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, [page, rowsPerPage, userSearch, month]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data } = await getTransactions({
        page,
        limit: rowsPerPage,
        user: userSearch,
        month: month ? dayjs(month).format('YYYY-MM') : '',
      });

      setTransactions(data.transactions);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        💸 Transactions
      </Typography>

      {/* Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <TextField
            label="Search User Name"
            value={userSearch}
            onChange={(e) => { setUserSearch(e.target.value); setPage(0); }}
            size="small"
            sx={{ minWidth: 220 }}
          />
          <DatePicker
            views={['year', 'month']}
            label="Filter by Month"
            value={month ? dayjs(month) : null}
            onChange={(newValue) => { setMonth(newValue ? dayjs(newValue).toDate() : null); setPage(0); }}
            slotProps={{ textField: { size: 'small' } }}
          />
        </Stack>
      </Paper>

      {/* Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>User Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>User Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>{tx.userName || 'Unknown'}</TableCell>
                    <TableCell>{tx.userEmail || 'Unknown'}</TableCell>
                    <TableCell>
                      <Chip
                        label={tx.type === 'purchase' ? 'Credit Purchase' : 'Lead Purchase'}
                        color={tx.type === 'purchase' ? 'primary' : 'secondary'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{tx.amount} Credits</TableCell>
                    <TableCell>{tx.description || '—'}</TableCell>
                    <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 20, 50]}
          />
        </Paper>
      )}
    </Box>
  );
}
