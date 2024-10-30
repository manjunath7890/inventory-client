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
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useLocation } from "react-router-dom";

export default function Parts() {

  const query = new URLSearchParams(useLocation().search);
  const catagory = query.get("category");

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [parts, setParts] = useState([]);
  const [selectedParts, setSelectedParts] = useState(null);
  const [open, setOpen] = useState(false);
  const [dialogType, setDialogType] = useState(null);
  const [partFormValues, setPartFormValues] = useState({
    partId: "",
    partName: "",
    specification: "",
    catagory: catagory,
    quantity: 0,
    supplier: "",
    price: "",
  });
  const [issueFormValues, setIssueFormValues] = useState({
    partName: "",
    partId: "",
    specification: "",
    catagory: catagory,
    quantity: 0,
    batchNo: "",
    supplier: "",
    IO: "",
    purchasedBy: "",
    price: "",
    date: new Date().toISOString().slice(0, 10)
  });
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [partToDelete, setPartToDelete] = useState(null);

  useEffect(() => {
    fetchParts();
  }, [catagory]);

  const fetchParts = async () => {
    try {
      const response = await fetch(
        `${colors.grey[50]}/getparts?catagory=${catagory}`
      );
      const data = await response.json();
      setParts(data);
    } catch (error) {
      console.error("Error fetching parts:", error);
    }
  };

  const handleOpen = (parts = null, type) => {
    setSelectedParts(parts);
    setDialogType(type);

    if (type === "inward" || type === "issue") {
      setIssueFormValues({
        partName: parts ? parts.partName : "",
        partId: parts ? parts.partId : "",
        specification: parts ? parts.specification : "",
        catagory: catagory,
        supplier: "",
        quantity: 0,
        batchNo: "",
        IO: type,
        price: "",
        purchasedBy: "",
        date: new Date().toISOString().slice(0, 10),
      });
    } else {
      setPartFormValues(
        parts || {
          partId: "",
          partName: "",
          specification: "",
          catagory: catagory,
          quantity: 0,
          supplier: "",
          price: "",
        }
      );
    }

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setConfirmDeleteOpen(false);
  };

  const handlePartSubmit = async () => {
    try {
      const method = selectedParts ? "PUT" : "POST";
      const url = selectedParts
        ? `${colors.grey[50]}/parts/${selectedParts.partId}`
        : `${colors.grey[50]}/parts`;

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partFormValues),
      });

      fetchParts();
      handleClose();
    } catch (error) {
      console.error("Error submitting parts:", error);
    }
  };

  const handleIssueSubmit = async () => {
    try {
      // Send the issue details to the server
      const url = `${colors.grey[50]}/partsIO`;
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(issueFormValues),
      });
  
      // Update the quantity of the selected part
      if (selectedParts) {
        const updatedQuantity = selectedParts.quantity - issueFormValues.quantity;
  
        // Check if the updated quantity is valid
        if (updatedQuantity < 0) {
          console.error("Cannot issue more parts than available.");
          return; // Or handle the error as needed
        }
  
        // Update the part quantity in the database
        const updateUrl = `${colors.grey[50]}/parts/${selectedParts.partId}`;
        await fetch(updateUrl, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: updatedQuantity }),
        });
      }
  
      // Refresh the parts list and close the dialog
      fetchParts();
      handleClose();
    } catch (error) {
      console.error("Error submitting issue:", error);
    }
  };

  const handleInwardSubmit = async () => {
    try {
      // Send the inward details to the server
      const url = `${colors.grey[50]}/partsIO`;
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(issueFormValues),
      });
  
      // Update the quantity of the selected part
      if (selectedParts) {
        const updatedQuantity = Number(selectedParts.quantity) + Number(issueFormValues.quantity);
  
        // Update the part quantity in the database
        const updateUrl = `${colors.grey[50]}/parts/${selectedParts.partId}`;
        await fetch(updateUrl, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: updatedQuantity }),
        });
      }
  
      // Refresh the parts list and close the dialog
      fetchParts();
      handleClose();
    } catch (error) {
      console.error("Error submitting inward:", error);
    }
  };  
  

  const handleDelete = async () => {
    if (!partToDelete) {
      console.error("No part selected for deletion");
      return;
    }

    try {
      const response = await fetch(
        `${colors.grey[50]}/deleteparts?_id=${partToDelete}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        fetchParts();
        handleClose();
      } else {
        const error = await response.json();
        console.error("Error deleting part:", error.message);
      }
    } catch (error) {
      console.error("Error deleting part:", error);
    }
  };

  const columns = [
    { field: "partId", headerName: "Part ID", flex: 0.8 },
    { field: "partName", headerName: "Description", flex: 1.2 },
    { field: "specification", headerName: "Specification", flex: 1.5 },
    { field: "quantity", headerName: "Quantity", flex: 0.7 },
    { field: "supplier", headerName: "Supplier", flex: 2 },
    { field: "price", headerName: "Unit Price", flex: 1 },
    {
      field: "inWard",
      headerName: "InWard",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpen(params.row, "inward")}
          style={{
            background: "white",
            color: "black",
            boxShadow: "none",
            border: "1px solid #ccc",
            marginRight: "8px",
          }}
        >
          Inward Parts
        </Button>
      ),
    },
    {
      field: "issue",
      headerName: "Issue",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpen(params.row, "issue")}
          style={{
            background: "white",
            color: "black",
            boxShadow: "none",
            border: "1px solid #ccc",
            marginRight: "8px",
          }}
        >
          Issue Parts
        </Button>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.2,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="warning"
            onClick={() => handleOpen(params.row, "edit")}
            style={{
              background: "white",
              color: "black",
              boxShadow: "none",
              border: "1px solid #ccc",
              marginRight: "8px",
            }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setPartToDelete(params.row._id);
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
        pt: '2rem',
        minHeight: "calc(100vh - 4.5rem)"
      }}
    >
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"flex-end"}
      >
        <Typography fontSize={"1.8rem"} fontWeight={"1000"} variant="h2">
        {catagory.toUpperCase()} LIST 
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpen(null, "add")}
        >
          Add New part
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
          background: "rgba(255, 255, 255, 0.5)",
        }}
      >
        <DataGrid
          rows={parts}
          columns={columns}
          slots={{
            toolbar: GridToolbar,
          }}
          getRowId={(row) => row._id}
        />
      </Box>

      {/* Dialog for Add/Edit Parts */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{fontSize: "1.5rem", fontWeight: "bold"}}>
          {dialogType === "edit"
            ? "Edit Part"
            : dialogType === "add"
            ? "Add Parts"
            : dialogType === "inward"
            ? "Inward Parts"
            : "Issue Parts"}
        </DialogTitle>
        <DialogContent>
          {dialogType === "inward" || dialogType === "issue" ? (
            <>
              <TextField
                margin="dense"
                label="Category"
                type="text"
                fullWidth
                disabled
                variant="outlined"
                value={issueFormValues.catagory}
                onChange={(e) =>
                  setIssueFormValues({
                    ...issueFormValues,
                    catagory: e.target.value,
                  })
                }
              />
              <TextField
                autoFocus
                margin="dense"
                label="Part Id"
                type="text"
                fullWidth
                disabled
                variant="outlined"
                value={issueFormValues.partId}
                onChange={(e) =>
                  setIssueFormValues({
                    ...issueFormValues,
                    partId: e.target.value,
                  })
                }
              />
              <TextField
                margin="dense"
                label="Part Name"
                type="text"
                fullWidth
                disabled
                variant="outlined"
                value={issueFormValues.partName}
                onChange={(e) =>
                  setIssueFormValues({
                    ...issueFormValues,
                    partName: e.target.value,
                  })
                }
              />
              <TextField
                margin="dense"
                label="Specification"
                type="text"
                fullWidth
                disabled
                variant="outlined"
                value={issueFormValues.specification}
                onChange={(e) =>
                  setIssueFormValues({
                    ...issueFormValues,
                    specification: e.target.value,
                  })
                }
              />
              
              {dialogType === "inward" ? <TextField
                margin="dense"
                label="Batch Number"
                type="text"
                fullWidth
                variant="outlined"
                value={issueFormValues.batchNo}
                onChange={(e) =>
                  setIssueFormValues({
                    ...issueFormValues,
                    batchNo: e.target.value,
                  })
                }
              /> : null}
              <TextField
                margin="dense"
                label="Quantity"
                type="number"
                fullWidth
                variant="outlined"
                value={issueFormValues.quantity}
                onChange={(e) =>
                  setIssueFormValues({
                    ...issueFormValues,
                    quantity: e.target.value,
                  })
                }
              />
              <TextField
                margin="dense"
                label="Date"
                type="date"
                fullWidth
                variant="outlined"
                value={issueFormValues.date}
                onChange={(e) =>
                  setIssueFormValues({
                    ...issueFormValues,
                    date: e.target.value,
                  })
                }
              />
              <TextField
                margin="dense"
                label="Supplier"
                type="text"
                fullWidth
                variant="outlined"
                value={issueFormValues.supplier}
                onChange={(e) =>
                  setIssueFormValues({
                    ...issueFormValues,
                    supplier: e.target.value,
                  })
                }
              />
              {dialogType === "inward" ? <TextField
                margin="dense"
                label="Purchased By"
                type="text"
                fullWidth
                variant="outlined"
                value={issueFormValues.purchasedBy}
                onChange={(e) =>
                  setIssueFormValues({
                    ...issueFormValues,
                    purchasedBy: e.target.value,
                  })
                }
              /> : null}
              <TextField
                margin="dense"
                label="Total Price"
                type="text"
                fullWidth
                variant="outlined"
                value={issueFormValues.price}
                onChange={(e) =>
                  setIssueFormValues({
                    ...issueFormValues,
                    price: e.target.value,
                  })
                }
              />
            </>
          ) : (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="Category"
                type="text"
                fullWidth
                disabled
                variant="outlined"
                value={catagory}
                onChange={(e) =>
                  setPartFormValues({
                    ...partFormValues,
                    catagory: catagory,
                  })
                }
              />
              <TextField
                autoFocus
                margin="dense"
                label="Part ID"
                type="text"
                fullWidth
                variant="outlined"
                value={partFormValues.partId}
                onChange={(e) =>
                  setPartFormValues({
                    ...partFormValues,
                    partId: e.target.value,
                  })
                }
              />
              <TextField
                margin="dense"
                label="Part Name"
                type="text"
                fullWidth
                variant="outlined"
                value={partFormValues.partName}
                onChange={(e) =>
                  setPartFormValues({
                    ...partFormValues,
                    partName: e.target.value,
                  })
                }
              />
              <TextField
                margin="dense"
                label="Specification"
                type="text"
                fullWidth
                variant="outlined"
                value={partFormValues.specification}
                onChange={(e) =>
                  setPartFormValues({
                    ...partFormValues,
                    specification: e.target.value,
                  })
                }
              />
              <TextField
                margin="dense"
                label="Quantity"
                type="number"
                fullWidth
                variant="outlined"
                value={partFormValues.quantity}
                onChange={(e) =>
                  setPartFormValues({
                    ...partFormValues,
                    quantity: Number(e.target.value),
                  })
                }
              />
              <TextField
                margin="dense"
                label="Supplier"
                type="text"
                fullWidth
                variant="outlined"
                value={partFormValues.supplier}
                onChange={(e) =>
                  setPartFormValues({
                    ...partFormValues,
                    supplier: e.target.value,
                  })
                }
              />
              <TextField
                margin="dense"
                label="Unit Price"
                type="text"
                fullWidth
                variant="outlined"
                value={partFormValues.price}
                onChange={(e) =>
                  setPartFormValues({
                    ...partFormValues,
                    price: e.target.value,
                  })
                }
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={
              dialogType === "issue"
                ? handleIssueSubmit
                : dialogType === "inward"
                ? handleInwardSubmit
                : handlePartSubmit
            }
            variant="contained"
          >
            {dialogType === "edit"
              ? "Save"
              : dialogType === "add"
              ? "Add"
              : dialogType === "inward"
              ? "Inward"
              : "Issue"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Deletion */}
      <Dialog open={confirmDeleteOpen} onClose={handleClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this part?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
