import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";

const Users = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    role: "",
    adminId: props.id,
    emailId: "",
    password: "",
  });
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${colors.grey[50]}/users?adminId=${props.id}`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleOpen = (user = null) => {
    setSelectedUser(user);
    setFormValues(
      user || {
        name: "",
        role: "",
        adminId: props.id,
        emailId: "",
        password: "",
      }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setConfirmDeleteOpen(false);
  };

  const handleSubmit = async () => {
    
    try {
      const method = selectedUser ? "PUT" : "POST";
      const url = selectedUser
        ? `${colors.grey[50]}/users/${selectedUser._id}`
        : `${colors.grey[50]}/users`;

        

        const submittedData = {
          ...formValues,
          showRoom:formValues.name ,

        };
        console.log(url)
        console.log(method)
        console.log(JSON.stringify(submittedData))
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submittedData),
        
      });

      

      fetchUsers();
      handleClose();
    } catch (error) {
      console.error("Error submitting user:", error);
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) {
      console.error("No user selected for deletion");
      return;
    }

    try {
      const response = await fetch(`${colors.grey[50]}/users/${userToDelete}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchUsers();
        handleClose();
      } else {
        const error = await response.json();
        console.error("Error deleting user:", error.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const columns = [
    { field: "_id", headerName: "User ID", flex: 1 },
    { field: "name", headerName: "Showroom", flex: 1 },
    { field: "role", headerName: "Role", flex: 0.5 },
    { field: "emailId", headerName: "Email ID", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleOpen(params.row)}
            style={{
              background: "white",
              color: "black",
              boxShadow: "none",
              border: "1px solid #ccc",
              marginRight: "1rem",
            }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setUserToDelete(params.row._id);
              setConfirmDeleteOpen(true);
            }}
            style={{
              background: "black",
              boxShadow: "none",
              border: "1px solid #ccc",
            }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <Box
      sx={{
        background: "#aae3d4",
        padding: "1rem",
      }}
    >
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"flex-end"}
      >
        <Typography fontSize={"1.8rem"} fontWeight={"bold"}>
          {props.role === "master admin" ? "SHOWROOM" : "EXECUTIVES"} LIST
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpen()}
        >
          Add New
        </Button>
      </Box>
      <Box
        m="1rem 0 0 0"
        height="75vh"
        
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "0px solid #ccc",
            fontSize: "0.9rem",
            color: "#000",
          },
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: "none",
            color: "#fff",
            fontSize: "1.1rem",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#02b384",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: "#02b384",
            color: "#fff",
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
          background: "rgba(255, 255, 255, 0.5)"
        }}
      >
        <DataGrid
          rows={users}
          columns={columns}
          slots={{
            toolbar: GridToolbar,
          }}
          getRowId={(row) => row._id} // Ensure each row has a unique ID
        />
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedUser ? "Edit User" : "Add New User"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Admin ID"
            variant="outlined"
            fullWidth
            disabled
            margin="normal"
            value={props.id}
            onChange={(e) =>
              setFormValues({ ...formValues, adminId: e.target.value })
            }
          />
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formValues.name}
            onChange={(e) =>
              setFormValues({ ...formValues, name: e.target.value })
            }
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              value={formValues.role}
              label="Role"
              onChange={(e) =>
                setFormValues({ ...formValues, role: e.target.value })
              }
            >
              {/* <MenuItem value="master admin">m Admin</MenuItem> */}
              {props.role === "master admin" ? (
                <MenuItem value="admin">Admin</MenuItem>
              ) : (
                <MenuItem value="executive">Executive</MenuItem>
              )}
            </Select>
          </FormControl>
          <TextField
            label="Email ID"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formValues.emailId}
            onChange={(e) =>
              setFormValues({ ...formValues, emailId: e.target.value })
            }
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={formValues.password}
            onChange={(e) =>
              setFormValues({ ...formValues, password: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedUser ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDeleteOpen} onClose={handleClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
