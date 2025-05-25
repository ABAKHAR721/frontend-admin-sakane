// components/AdminAuditLogs.tsx
'use client'

import { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, CircularProgress, Select, MenuItem, FormControl, InputLabel, useMediaQuery, useTheme,
    TablePagination, SelectChangeEvent, Stack // Using Stack for better filter layout
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { getAuditLogs } from '../../../services/api/adminApi'; // Import the API method

interface AuditLog {
    id: number;
    table_name: string;
    operation: string;
    record_id: number;
    old_data: any;  // Or a more specific type if you know the structure
    new_data: any;  // Or a more specific type
    performed_by: string | null;
    performed_at: string;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.7rem',
        padding: theme.spacing(1),
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
}));

// Define the available table names for the filter
const availableTables = ['credit_transactions', 'leads', 'purchased_leads'];


const AdminAuditLogs = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [operationFilter, setOperationFilter] = useState('ALL'); // 'ALL', 'INSERT', 'UPDATE', 'DELETE'
    const [tableFilter, setTableFilter] = useState('ALL'); // 'ALL', 'credit_transactions', 'leads', 'purchased_leads'

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [page, setPage] = useState(0);  // Current page number
    const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setLoading(true);
                // Use Axios via your adminApi instance
                const response = await getAuditLogs();
                // Assuming response.data is the array of logs
                setLogs(response.data);
            } catch (error: any) {
                console.error('Failed to fetch audit logs:', error);
                // Optionally set an error state to display an error message to the user
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);  // Fetch logs on component mount

    // Apply both operation and table filters
    const filteredLogs = logs.filter(log => {
        const operationMatch = operationFilter === 'ALL' || log.operation === operationFilter;
        const tableMatch = tableFilter === 'ALL' || log.table_name === tableFilter;
        return operationMatch && tableMatch;
    });

    const handleOperationFilterChange = (event: SelectChangeEvent<string>) => {
        setOperationFilter(event.target.value);
        setPage(0); // Reset to first page when changing filter
    };

    const handleTableFilterChange = (event: SelectChangeEvent<string>) => {
        setTableFilter(event.target.value);
        setPage(0); // Reset to first page when changing filter
    };


    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page when changing rows per page
    };

    // Calculate the start and end index for the current page
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

    // Function to safely stringify and format JSON for display
    const formatJson = (data: any) => {
        // Check for null or undefined explicitly before stringifying
        if (data === null || data === undefined) {
            return 'N/A'; // Display 'N/A' or similar for empty data
        }
        // Check if data is an empty object {} or empty array []
        if (typeof data === 'object' && Object.keys(data).length === 0) {
             return '{}'; // Or '[]' if it's an empty array, but {} is safer for generic 'any'
        }
        try {
            // Use JSON.stringify with 2 spaces for indentation (pretty-printing)
            return JSON.stringify(data, null, 2);
        } catch (error) {
            console.error('Failed to stringify JSON:', error, data);
            // Return an error message if stringification fails
            return 'Error Formatting Data';
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>Admin Audit Logs</Typography>

            {/* Filter Controls */}
            <Stack direction={isSmallScreen ? 'column' : 'row'} spacing={2} sx={{ mb: 2 }}>
                {/* Operation Filter */}
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="operation-filter-label">Operation</InputLabel>
                    <Select
                        labelId="operation-filter-label"
                        id="operation-filter"
                        value={operationFilter}
                        label="Operation"
                        onChange={handleOperationFilterChange}
                    >
                        <MenuItem value="ALL">All Operations</MenuItem>
                        <MenuItem value="INSERT">Insert</MenuItem>
                        <MenuItem value="UPDATE">Update</MenuItem>
                        <MenuItem value="DELETE">Delete</MenuItem>
                    </Select>
                </FormControl>

                {/* Table Name Filter */}
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel id="table-filter-label">Table Name</InputLabel>
                    <Select
                        labelId="table-filter-label"
                        id="table-filter"
                        value={tableFilter}
                        label="Table Name"
                        onChange={handleTableFilterChange}
                    >
                        <MenuItem value="ALL">All Tables</MenuItem>
                        {availableTables.map(tableName => (
                            <MenuItem key={tableName} value={tableName}>{tableName}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>

            <Paper elevation={3}>
                <TableContainer>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Table aria-label="admin audit logs table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Table</StyledTableCell>
                                    <StyledTableCell>Operation</StyledTableCell>
                                    <StyledTableCell>Record ID</StyledTableCell>
                                    <StyledTableCell>Performed At</StyledTableCell>
                                    {!isSmallScreen && <StyledTableCell>Old Data</StyledTableCell>}
                                    {!isSmallScreen && <StyledTableCell>New Data</StyledTableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedLogs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={isSmallScreen ? 4 : 6} align="center">
                                            No audit logs found matching the filters.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedLogs.map(log => (
                                        <StyledTableRow key={log.id}>
                                            <TableCell>{log.table_name}</TableCell>
                                            <TableCell>{log.operation}</TableCell>
                                            <TableCell>{log.record_id}</TableCell>
                                            <TableCell>{new Date(log.performed_at).toLocaleString()}</TableCell>

                                            {/* Apply formatting and styling for readability */}
                                            {!isSmallScreen && (
                                                <TableCell
                                                    sx={{
                                                        whiteSpace: 'pre-wrap', // Preserve spaces and newlines, wrap text
                                                        wordBreak: 'break-word', // Break long words
                                                        fontSize: '0.8rem', // Smaller font might help fit content
                                                        fontFamily: 'monospace', // Use monospace font for data
                                                        verticalAlign: 'top', // Align content to top in cells
                                                        // Optional: limit height and add scroll if content is very large
                                                        // maxHeight: '200px',
                                                        // overflowY: 'auto',
                                                    }}
                                                >
                                                    {formatJson(log.old_data)}
                                                </TableCell>
                                            )}
                                            {!isSmallScreen && (
                                                <TableCell
                                                    sx={{
                                                        whiteSpace: 'pre-wrap',
                                                        wordBreak: 'break-word',
                                                        fontSize: '0.8rem',
                                                        fontFamily: 'monospace',
                                                        verticalAlign: 'top', // Align content to top in cells
                                                        // maxHeight: '200px',
                                                        // overflowY: 'auto',
                                                    }}
                                                >
                                                    {formatJson(log.new_data)}
                                                </TableCell>
                                            )}
                                        </StyledTableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </TableContainer>
                {/* Table Pagination - Only show if there are logs after filtering */}
                {!loading && filteredLogs.length > 0 && (
                    <TablePagination
                        component="div"
                        count={filteredLogs.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25]}
                    />
                )}
            </Paper>
        </Box>
    );
};

export default AdminAuditLogs;