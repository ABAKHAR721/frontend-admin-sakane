// LeadPage.tsx
'use client'

import {
    Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, CircularProgress, TextField, MenuItem, Select,
    InputLabel, FormControl, TablePagination, Modal, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, useMediaQuery, useTheme
} from '@mui/material';
import { useEffect, useState } from 'react';
import { getAllLeadsWithPurchaseInfo, getUserDetails } from '../../../services/api/adminApi';
import { styled } from '@mui/material/styles'; // Import styled from @mui/material/styles

interface Lead {
    id: number;
    type: string;
    mode: string;
    area: string;
    bedrooms: string;
    timing: string;
    contact_name: string;
    contact_phone: string;
    contact_email: string;
    budget: string;
    status: string;
    created_at: string;
    purchases: {
        id: number;
        purchased_at: string;
        user: {
            id: string;  // Changed to string
            name: string;
            email?: string; // Add email to user type
        };
    }[];
}

interface UserDetails {
    id: string;
    name: string;
    email: string;
    role: string;
    purchased_leads: {
        id: number;
        purchased_at: string;
        lead: {
            type: string; // Assuming 'type' is what you want from the lead
        };
    }[];
    credit_transactions: {
        amount: number;
        type: string;
        created_at: string;
    }[];
    created_at: string;
}

// Styled Components for better styling
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    [theme.breakpoints.down('sm')]: { // Responsive font size
        fontSize: '0.8rem',
        padding: theme.spacing(1),
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
}));

const BuyerName = styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.main,
    cursor: 'pointer',
    '&:hover': {
        textDecoration: 'underline',
        color: theme.palette.primary.dark,
    },
}));

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [userFilter, setUserFilter] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    const [userDetailsOpen, setUserDetailsOpen] = useState(false); // State for user details modal
    const [selectedUserDetails, setSelectedUserDetails] = useState<UserDetails | null>(null); // State to hold user details
    const [userDetailsLoading, setUserDetailsLoading] = useState(false);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Check if screen is small

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                setLoading(true);
                const { data } = await getAllLeadsWithPurchaseInfo({
                    page: page,
                    limit: rowsPerPage,
                    search,
                    status: statusFilter,
                    buyer: userFilter,
                });
                setLeads(data.leads);
                setTotal(data.total);
            } catch (error) {
                console.error('Failed to fetch leads:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeads();
    }, [page, rowsPerPage, search, statusFilter, userFilter]);

    const uniqueBuyers = Array.from(
        new Set(
            leads.flatMap(l => l.purchases.map(p => p.user?.name)).filter(Boolean)
        )
    );

    // Function to open the details modal
    const handleOpenDetails = async (userId: string) => {
        setUserDetailsLoading(true); // Set loading to true before fetching
        setUserDetailsOpen(true);

        try {
            const { data } = await getUserDetails(userId);
            setSelectedUserDetails(data);
        } catch (error) {
            console.error('Failed to fetch user details:', error);
            setSelectedUserDetails(null);
        } finally {
            setUserDetailsLoading(false); // Set loading to false after fetching
        }
    };

    // Function to close the details modal
    const handleCloseDetails = () => {
        setUserDetailsOpen(false);
        setSelectedUserDetails(null);
    };

    return (
        <Box sx={{ p: 4, backgroundColor: '#f5f5f5' }}>
            <Typography variant="h4" fontWeight="bold" mb={4} color="primary">
                🏠 Leads Overview
            </Typography>

            {/* Filters */}
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center',
                             flexDirection: isSmallScreen ? 'column' : 'row' }}> {/* Stack on small screens */}
                    <TextField
                        label="Search by Title"
                        variant="outlined"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                        sx={{ minWidth: isSmallScreen ? '100%' : 220, mb: isSmallScreen ? 2 : 0 }} // Full width on small
                    />
                    <FormControl sx={{ minWidth: isSmallScreen ? '100%' : 180, mb: isSmallScreen ? 2 : 0 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={statusFilter}
                            label="Status"
                            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="available">Available</MenuItem>
                            <MenuItem value="purchased">Purchased</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: isSmallScreen ? '100%' : 200 }}>
                        <InputLabel>Buyer</InputLabel>
                        <Select
                            value={userFilter}
                            label="Buyer"
                            onChange={(e) => { setUserFilter(e.target.value); setPage(0); }}
                        >
                            <MenuItem value="">All</MenuItem>
                            {uniqueBuyers.map((buyer, idx) => (
                                <MenuItem key={idx} value={buyer}>
                                    {buyer}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Paper>

            {/* Table */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 6 }}>
                    <CircularProgress color="primary" />
                </Box>
            ) : (
                <Paper elevation={5}>
                    <TableContainer>
                        <Table aria-label="leads table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Mode</StyledTableCell>
                                    <StyledTableCell>Title</StyledTableCell>
                                    {!isSmallScreen && <StyledTableCell>Bedrooms</StyledTableCell>}
                                    <StyledTableCell>Status</StyledTableCell>
                                    {!isSmallScreen && <StyledTableCell>Area</StyledTableCell>}
                                    {!isSmallScreen && <StyledTableCell>Timing</StyledTableCell>}
                                    <StyledTableCell>Contact Name</StyledTableCell>
                                    <StyledTableCell>Contact Phone</StyledTableCell>
                                    <StyledTableCell>Contact Email</StyledTableCell>
                                    <StyledTableCell>Buyer</StyledTableCell>
                                    {!isSmallScreen && <StyledTableCell>Buyer Email</StyledTableCell>}
                                    {!isSmallScreen && <StyledTableCell>Purchase Date</StyledTableCell>}
                                    {!isSmallScreen && <StyledTableCell>Credits Spent</StyledTableCell>}
                                    {!isSmallScreen && <StyledTableCell>Created At</StyledTableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {leads.map((lead) => {
                                    const purchase = lead.purchases?.[0];
                                    const isPurchased = lead.purchases.length > 0;
                                    return (
                                        <StyledTableRow key={lead.id}>
                                            <TableCell>{lead.mode}</TableCell>
                                            <TableCell>{lead.type}</TableCell>
                                            {!isSmallScreen && (
                                                <TableCell>
                                                    {lead.bedrooms ? lead.bedrooms : (
                                                        <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', backgroundColor: '#E0E0E0', color: '#616161', fontWeight: 'bold' }}>
                                                            Not specified
                                                        </span>
                                                    )}
                                                </TableCell>
                                            )}
                                            <TableCell>
                                                <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', backgroundColor: isPurchased ? '#C8E6C9' : '#E0E0E1', color: isPurchased ? '#2E7D32' : '#616161', fontWeight: 'bold' }}>
                                                    {isPurchased ? 'Purchased' : 'Available'}
                                                </span>
                                            </TableCell>
                                            {!isSmallScreen && <TableCell>{lead.area}</TableCell>}
                                            {!isSmallScreen && <TableCell>{lead.timing}</TableCell>}
                                            <TableCell>{lead.contact_name}</TableCell>
                                            <TableCell>
                                                <a href={`tel:${lead.contact_phone}`}>{lead.contact_phone}</a>
                                            </TableCell>
                                            <TableCell>
                                                <a href={`mailto:${lead.contact_email}`}>{lead.contact_email}</a>
                                            </TableCell>
                                            <TableCell>
                                                {purchase?.user?.name ? (
                                                    <BuyerName onClick={() => handleOpenDetails(purchase.user.id)}>
                                                        {purchase.user.name}
                                                    </BuyerName>
                                                ) : '—'}
                                            </TableCell>
                                            {!isSmallScreen && (
                                                <TableCell>
                                                    {purchase?.user?.email ? (
                                                        <a href={`mailto:${purchase.user.email}`}>{purchase.user.email}</a>
                                                    ) : '—'}
                                                </TableCell>
                                            )}
                                            {!isSmallScreen && (
                                                <TableCell>
                                                    {purchase?.purchased_at ? new Date(purchase.purchased_at).toLocaleDateString() : '—'}
                                                </TableCell>
                                            )}
                                            {!isSmallScreen && (
                                                <TableCell>{lead.budget ? `${lead.budget} Credits` : '—'}</TableCell>
                                            )}
                                            {!isSmallScreen && <TableCell>{lead.created_at}</TableCell>}
                                        </StyledTableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination */}
                    <TablePagination
                        component="div"
                        count={total}
                        page={page}
                        onPageChange={(event, newPage) => setPage(newPage)}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(event) => {
                            setRowsPerPage(parseInt(event.target.value, 10));
                            setPage(0);
                        }}
                        rowsPerPageOptions={[5, 10, 20, 50]}
                    />
                </Paper>
            )}

            {/* User Details Dialog */}
            <Dialog open={userDetailsOpen} onClose={handleCloseDetails} maxWidth="sm" fullWidth>
                <DialogTitle>User Details</DialogTitle>
                <DialogContent>
                    {userDetailsLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                        </Box>
                    ) : selectedUserDetails ? (
                        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography><strong>Name:</strong> {selectedUserDetails.name}</Typography>
                            <Typography>
                              <a href={`mailto:${selectedUserDetails.email}`}><strong>Email:</strong> {selectedUserDetails.email}</a>
                            </Typography>
                            <Typography><strong>Role:</strong> {selectedUserDetails.role}</Typography>
                            <Typography><strong>Created At:</strong> {selectedUserDetails.created_at}</Typography>
                            {/* Add more user details here as needed */}
                        </Box>
                    ) : (
                        <Typography>No user details available.</Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseDetails}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}