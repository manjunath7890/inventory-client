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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";  // Import the plugin
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";  // Import the plugin

dayjs.extend(isSameOrAfter);   // Extend dayjs with the plugin
dayjs.extend(isSameOrBefore); 

export default function PartsIO({ catagory = "electronics" }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [parts, setParts] = useState([]);
  const [filteredParts, setFilteredParts] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);
  const [open, setOpen] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [issueFormValues, setIssueFormValues] = useState({
    partId: "",
    partName: "",
    specification: "",
    catagory: catagory,
    quantity: 0,
    batchNo: "",
    supplier: "",
    purchasedBy: "",
    price: "",
    IO: "",
    date: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
  });
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [partToDelete, setPartToDelete] = useState(null);

  const [startDate, setStartDate] = useState(dayjs().startOf("month"));
  const [endDate, setEndDate] = useState(dayjs().endOf("month"));

  useEffect(() => {
    fetchParts();
  }, [catagory]);

  useEffect(() => {
    filterPartsByDate();
  }, [parts, startDate, endDate]);

  const fetchParts = async () => {
    try {
      const response = await fetch(`${colors.grey[50]}/getpartsIO?catagory=${catagory}`);
      const data = await response.json();
      setParts(data);
    } catch (error) {
      console.error("Error fetching parts:", error);
    }
  };

  const filterPartsByDate = () => {
    const filtered = parts.filter((part) => {
      const partDate = dayjs(part.date);
      return partDate.isSameOrAfter(startDate, "day") && partDate.isSameOrBefore(endDate, "day");
    });

    const total = filtered.reduce((acc, part) => {
      if (part.IO === "inward") {
        return acc + parseFloat(part.price || 0);
      } else if (part.IO === "issue") {
        return acc - parseFloat(part.price || 0);
      }
      return acc;
    }, 0);

    setFilteredParts(filtered);
    setTotalCost(total);
  };
  

  const handleOpen = (parts = null) => {
    setSelectedPart(parts);
    setIssueFormValues({
      partName: parts ? parts.partName : "",
      partId: parts ? parts.partId : "",
      specification: parts ? parts.specification : "",
      catagory: catagory,
      supplier: parts ? parts.supplier : "",
      quantity: parts ? parts.quantity : "",
      batchNo: parts ? parts.batchNo : "",
      date: parts ? parts.date : "",
      price: parts ? parts.price : "",
      purchasedBy: parts ? parts.purchasedBy : "",
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setConfirmDeleteOpen(false);
  };

  const handlePartSubmit = async () => {
    try {
      console.log("Selected Parts Data:", selectedPart);
      const method = "PUT";
      const url = `${colors.grey[50]}/partsIO/${selectedPart._id}`;
  
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(issueFormValues),
      });
  
      fetchParts(); 
      handleClose(); 
    } catch (error) {
      console.error("Error submitting parts:", error);
    }
  };

  const handleDelete = async () => {
    if (!partToDelete) return;

    try {
      const response = await fetch(`${colors.grey[50]}/deletepartsIO?_id=${partToDelete}`, {
        method: "DELETE",
      });
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
    { field: "catagory", headerName: "Category", flex: 0.7 },
    { field: "partId", headerName: "Part ID", flex: 0.7 },
    { field: "partName", headerName: "Description", flex: 1 },
    { field: "specification", headerName: "Specification", flex: 1.2 },
    { field: "quantity", headerName: "Quantity", flex: 0.5 },
    { field: "IO", headerName: "Inward/Issued", flex: 0.6 },
    { field: "batchNo", headerName: "Batch Number", flex: 0.7 },
    { field: "date", headerName: "Date", flex: 0.7 },
    { field: "supplier", headerName: "Supplier", flex: 1.1 },
    { field: "purchasedBy", headerName: "Purchased By", flex: 1.1 },
    { field: "price", headerName: "Total Price", flex: 0.7 },

    {
      field: "actions",
      headerName: "Actions",
      flex: 1.2,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="warning"
            onClick={() => handleOpen(params.row)}
            style={{ background: "white", color: "black", border: "1px solid #ccc", marginRight: "8px", boxShadow: "none" }}
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
            style={{ background: "black", border: "1px solid #ccc", boxShadow: "none" }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          background: "#aae3d4",
          padding: "1rem",
          minHeight: "calc(100vh - 4.5rem)",
          fontFamily: "Kanit"
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-end"
          mt={"2rem"}
        >
          <Box>
            <Typography fontSize="1.8rem" fontWeight="1000" variant="h2">
              INVENTORY SUMMARY
            </Typography>
          </Box>

          <Box display="flex" gap="0rem">
            
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              sx={{ marginRight: "1rem" }}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
            />
            <Box
              sx={{
                backgroundColor: "#02b384",
                padding: "0rem 1rem",
                borderRadius: "0.3rem",
                color: "white",
                marginLeft: "1rem",
                width: "10rem",
                borderBottom: "1px solid black"
              }}
            >
              <Typography fontSize={"0.7rem"} ml={"0.5rem"}mt={"0.1rem"} mb={"0.2rem"}> Inventory Value: </Typography>
              <Typography variant="h4" fontSize={"1.4rem"}>
                <span style={{ fontWeight: "600", marginLeft: "0.2rem" }}>
                  ₹{totalCost.toFixed(2)}
                </span>
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box m="1rem 0 0 0" height="70vh">
          <DataGrid
            rows={filteredParts}
            columns={columns}
            slots={{ toolbar: GridToolbar }}
            getRowId={(row) => row._id}
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
          />
        </Box>

        {/* Dialog for Add/Edit Parts */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle style={{fontSize: "1.5rem", fontWeight: "bold"}}>Edit Part</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Category"
              type="text"
              fullWidth
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
              variant="outlined"
              value={issueFormValues.specification}
              onChange={(e) =>
                setIssueFormValues({
                  ...issueFormValues,
                  specification: e.target.value,
                })
              }
            />
            <TextField
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
            />
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
            <TextField
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
            />
            <TextField
              margin="dense"
              label="Price"
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
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handlePartSubmit} variant="contained">
              Save
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
            <Button onClick={handleDelete} variant="contained" color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}
