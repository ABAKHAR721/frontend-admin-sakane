'use client'
import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { getUsers, createUser, updateUser, deleteUser } from '../../../services/api/adminApi';
import { updateUserBalance } from '../../../services/api/adminApi';

interface User {
  id: string;
  name: string | null; // Name can be null in Supabase profiles
  email: string;
  leads_purchased: number;
  credits_balance: number;
  created_at: string;
  role?: string; // Assuming role might be part of the profile
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  // Add 'password' to formData state
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [editingBalanceUserId, setEditingBalanceUserId] = useState<string | null>(null);
  const [newBalance, setNewBalance] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false); // Add saving state


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await getUsers({});
      // Add default values for potential nulls if needed, though the interface defines them
      setUsers(data.map((user: User) => ({
        ...user,
        name: user.name ?? 'N/A', // Example: handle null name
        leads_purchased: user.leads_purchased ?? 0,
        credits_balance: user.credits_balance ?? 0,
      })));
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    // Initialize formData with user data, leave password blank
    setFormData({ name: user.name || '', email: user.email || '', password: '' });
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setSelectedUser(null);
    // Initialize formData for new user, leave password blank
    setFormData({ name: '', email: '', password: '' });
    setOpenDialog(true);
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action is irreversible.')) return;
    try {
      setLoading(true); // Optional: show loading state while deleting
      await deleteUser(userId);
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user.'); // Provide feedback to user
    } finally {
       setLoading(false); // Hide loading
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    // Reset formData, including password
    setFormData({ name: '', email: '', password: '' });
  };

  const handleSaveBalance = async (userId: string) => {
     // Check if newBalance is different from current balance before saving
     const userToUpdate = users.find(u => u.id === userId);
     if (!userToUpdate) return; // Should not happen

     const currentBalance = userToUpdate.credits_balance;
     const numericNewBalance = parseFloat(newBalance);

      if (isNaN(numericNewBalance)) {
        alert('Invalid balance amount.');
        return;
      }

      // Check if the balance actually changed
      if (numericNewBalance === currentBalance) {
         console.log("Balance unchanged, skipping update.");
         setEditingBalanceUserId(null); // Exit editing mode
         setNewBalance(''); // Clear new balance input
         return;
      }


    try {
      // Optimistic update (optional, but improves perceived performance)
      setUsers(prevUsers => prevUsers.map(u =>
         u.id === userId ? { ...u, credits_balance: numericNewBalance } : u
      ));
      setEditingBalanceUserId(null); // Exit editing mode immediately


      await updateUserBalance(userId, numericNewBalance);
      // No need to fetchUsers() immediately after optimistic update,
      // but you might want to if the backend does more complex calculations
      // or if you need to ensure data consistency.
      // For robustness, let's keep fetchUsers() for now.
      await fetchUsers();


      setNewBalance('');
    } catch (error) {
      console.error('Failed to update balance:', error);
      alert('Failed to update balance.'); // Provide feedback
      // Revert optimistic update if save failed
      fetchUsers(); // Fetch correct data
    }
  };


  const handleSave = async () => {
    setIsSaving(true); // Start saving loading state
    try {
      const payload: any = { // Use 'any' or define a specific interface for payload
        name: formData.name,
        email: formData.email,
        // Add password to payload ONLY if it's not empty
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (selectedUser) {
        // Update existing user
        await updateUser(selectedUser.id, payload);
        alert('User updated successfully!'); // Success feedback
      } else {
        // Create new user
        // You might need additional fields for creation like a default role
        // and a required password here, depending on your createUser API
        if (!formData.password) {
             alert('Password is required for new users.');
             setIsSaving(false);
             return;
        }
         // Assume default role 'user' for new user creation
         payload.role = 'user';
         await createUser(payload);
         alert('User created successfully!'); // Success feedback
      }

      handleCloseDialog(); // Close dialog on success
      fetchUsers(); // Refresh list after save

    } catch (error: any) { // Use 'any' for caught error type
      console.error('Failed to save user:', error);
      // Display error message to user
      alert(`Failed to save user: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false); // Stop saving loading state
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(search.toLowerCase())
  );

  if (loading && users.length === 0) { // Show full page loader only on initial load
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ px: 4, py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          👥 User Management
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd} sx={{ borderRadius: 3 }}>
          Add User
        </Button>
      </Box>

      <Paper elevation={3} sx={{ borderRadius: 3 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search users by name or email..."
            value={search}
            onChange={handleSearch}
            size="small"
            sx={{ borderRadius: 2 }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>User</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell align="right"><strong>Leads</strong></TableCell>
                <TableCell align="right"><strong>Balance</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && users.length > 0 ? ( // Show loader inside table if refreshing
                 <TableRow>
                    <TableCell colSpan={5} align="center">
                       <CircularProgress size={24} />
                    </TableCell>
                 </TableRow>
              ) : (
                 filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                    <TableRow hover key={user.id}>
                    <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>{user.name?.[0]?.toUpperCase() || '?'}</Avatar>
                        <Typography>{user.name || 'N/A'}</Typography>
                        </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell align="right">{user.leads_purchased}</TableCell>
                    <TableCell align="right">
                        {editingBalanceUserId === user.id ? (
                        <TextField
                            size="small"
                            type="number"
                            value={newBalance}
                            onChange={(e) => setNewBalance(e.target.value)}
                            onBlur={() => handleSaveBalance(user.id)} // Save on blur
                            onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSaveBalance(user.id);
                            }
                            }}
                            autoFocus // Automatically focus when it appears
                            sx={{ width: 100 }}
                        />
                        ) : (
                        <Typography
                            onClick={() => {
                            setEditingBalanceUserId(user.id);
                            setNewBalance(user.credits_balance.toString()); // Set initial value to current balance
                            }}
                            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                        >
                            <span
                            style={{
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                backgroundColor: '#85BB65',
                                color: '#FFFFFF',
                                fontWeight: 'bold',
                            }}
                            >
                            ${user.credits_balance?.toFixed(2) || '0.00'} {/* Display balance with 2 decimal places */}
                            </span>
                        </Typography>
                        )}
                    </TableCell>
                    <TableCell align="right">
                        <Tooltip title="Edit">
                        <IconButton color="primary" onClick={() => handleEdit(user)}>
                            <Edit />
                        </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => handleDelete(user.id)}>
                            <Delete />
                        </IconButton>
                        </Tooltip>
                    </TableCell>
                    </TableRow>
                 ))
              )}
              {!loading && filteredUsers.length === 0 && (
                 <TableRow>
                    <TableCell colSpan={5} align="center">No users found.</TableCell>
                 </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedUser ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              variant="outlined" // Ensure variant is consistent
            />
            <TextField
              fullWidth
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              variant="outlined"
              // Consider adding 'type="email"' for better mobile keyboard
            />
            {/* Add Password Field */}
            <TextField
              fullWidth
              label={selectedUser ? "New Password (leave blank to keep current)" : "Password"}
              type="password" // This is important for hiding input
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              variant="outlined"
              helperText={selectedUser ? "Leave blank to keep current password" : ""} // Helper text for clarity
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} disabled={isSaving}>Cancel</Button> {/* Disable cancel while saving */}
          <Button variant="contained" onClick={handleSave} sx={{ borderRadius: 2 }} disabled={isSaving}>
            {isSaving ? <CircularProgress size={24} /> : (selectedUser ? 'Save Changes' : 'Create User')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}