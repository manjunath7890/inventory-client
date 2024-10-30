import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, useTheme, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MemoryIcon from '@mui/icons-material/Memory';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import SettingsIcon from '@mui/icons-material/Settings';
import CategoryIcon from '@mui/icons-material/Category';
import { tokens } from "../../theme";

export default function Dashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [parts, setParts] = useState({});
  const [open, setOpen] = useState(false);
  const [issueFormValues, setIssueFormValues] = useState({
    partName: "",
    partId: "",
    specification: "",
    catagory: "",
    quantity: 0,
    batchNo: "",
    supplier: "",
    IO: "",
    purchasedBy: "",
    price: "",
    date: new Date().toISOString().slice(0, 10),
  });
  

  const handleOpen = () => {

      setIssueFormValues({
        partName: "",
        partId: "",
        specification: "",
        catagory: "",
        supplier: "",
        quantity: 0,
        batchNo: "",
        IO: "inward",
        price: "",
        purchasedBy: "",
        date: new Date().toISOString().slice(0, 10),
      });

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInwardSubmit = async () => {
    try {

      const postUrl = `${colors.grey[50]}/partsIO`;
      const response = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(issueFormValues),
      });
      if (!response.ok) throw new Error("Error posting issue details.");
  
      const getUrl = `${colors.grey[50]}/getpartsby-part-id?partId=${issueFormValues.partId}`;
      const getResponse = await fetch(getUrl);
      if (!getResponse.ok) throw new Error("Error fetching part details.");
      const data = await getResponse.json();
  
      const updatedQuantity = Number(data.quantity) + Number(issueFormValues.quantity);
      if (updatedQuantity < 0) {
        console.error("Cannot issue more parts than available.");
        return; 
      }
  
      const updateUrl = `${colors.grey[50]}/parts/${issueFormValues.partId}`;
      const updateResponse = await fetch(updateUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: updatedQuantity }),
      });
      if (!updateResponse.ok) throw new Error("Error updating part quantity.");
  
      handleClose();
    } catch (error) {
      console.error("Error in handleInwardSubmit:", error);
    }
  };
  

  const categories = [
    {
      name: "Electronics",
      id: "electronics",
      icon: <MemoryIcon fontSize="1rem" style={{ color: "white" }} />,
    },
    {
      name: "Electrical",
      id: "electrical",
      icon: <ElectricalServicesIcon fontSize="10rem" style={{ color: "white" }} />,
    },
    {
      name: "Mechanical",
      id: "mechanical",
      icon: <SettingsIcon fontSize="10rem" style={{ color: "white" }} />,
    },
    {
      name: "Plastic",
      id: "plastic",
      icon: <CategoryIcon fontSize="10rem" style={{ color: "white" }} />,
    },
  ];


  const handleCategoryClick = (categoryID) => {
    navigate(`/parts?category=${categoryID}`);
  };

  const handleBomClick = (categoryID) => {
    navigate(`/bill-of-materials?category=${categoryID}`);
  };

  return (
    <Box
      sx={{
        padding: 4,
        background: "#aae3d4",
        minHeight: "calc(100vh - 4.5rem)",
      }}
    >
      <Box display={"flex"} justifyContent={"space-between"} mb={"1rem"}>
        <Typography
          fontSize={"1.8rem"}
          fontWeight={"1000"}
          variant="h2"
          mb={"0.5rem"}
        >
          DASHBOARD
        </Typography>

        <Box display={"flex"}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleCategoryClick("tools")}
            style={{
              color: "black",
              background: "#88c7b6",
              boxShadow: "none",
              fontSize: "0.9rem",
              borderRadius: "0.2rem",
              padding: "0 2rem",
              marginRight: "1rem",
              fontWeight: "bold",
              border: "0px solid #555",
            }}
          >
            Tools
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpen()}
            style={{
              color: "black",
              boxShadow: "none",
              fontSize: "0.9rem",
              background: "#02b384",
              borderRadius: "0.2rem",
              padding: "0 2rem",
              fontWeight: "bold",
            }}
          >
            Inward Parts
          </Button>
        </Box>
      </Box>
      <Typography
        fontSize={"1.3rem"}
        fontWeight={"600"}
        ml={"1rem"}
        mb={"1rem"}
        variant="h2"
      >
        Inventory List
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
          gap: 4,
        }}
      >
        {categories.map((category, index) => (
          <Paper
            key={index}
            elevation={3}
            sx={{
              width: "23%",
              height: "10rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "2rem",
              backgroundColor: "#02b384",
              boxShadow: "0px 3px 12px rgba(0, 0, 0, 0.25)",
              cursor: "pointer",
              "&:hover": {
                transform: "scale(1.05)",
                transition: "transform 0.3s ease-in-out",
              },
            }}
            onClick={() => handleCategoryClick(category.id)}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "white",
                padding: "0.3rem",
                borderRadius: "0.5rem",
              }}
            >
              {React.cloneElement(category.icon, {
                style: { color: "#02b384", fontSize: "2rem" },
              })}
            </Box>
            <Typography variant="h4" color="white" fontWeight={"600"}>
              {category.name}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Typography
        fontSize={"1.3rem"}
        fontWeight={"600"}
        mb={"1rem"}
        ml={"1rem"}
        mt={"3rem"}
        variant="h2"
      >
        Bill of Materials
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
          gap: 4,
        }}
      >
        {categories.map((category, index) => (
          <Paper
            key={index}
            elevation={3}
            sx={{
              width: "23%",
              height: "10rem",
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#02b384",
              boxShadow: "0px 3px 12px rgba(0, 0, 0, 0.25)",
              cursor: "pointer",
              "&:hover": {
                transform: "scale(1.05)",
                transition: "transform 0.3s ease-in-out",
              },
            }}
            onClick={() => handleBomClick(category.id)}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "white",
                padding: "0.3rem",
                borderRadius: "0.5rem",
              }}
            >
              {React.cloneElement(category.icon, {
                style: { color: "#02b384", fontSize: "2rem" },
              })}
            </Box>
            <Typography variant="h4" color="white" fontWeight={"bold"}>
              {category.name}
            </Typography>
          </Paper>
        ))}
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
          Inward Parts
        </DialogTitle>
        <DialogContent>
          <Select
            fullWidth
            variant="outlined"
            displayEmpty
            value={issueFormValues.catagory}
            onChange={(e) =>
              setIssueFormValues({
                ...issueFormValues,
                catagory: e.target.value,
              })
            }
            renderValue={
              issueFormValues.catagory !== ""
                ? undefined
                : () => <span style={{ color: "#aaa" }}>Select Category</span>
            }
          >
            <MenuItem value="" disabled>
              Select Category
            </MenuItem>
            <MenuItem value="electronics">Electronics</MenuItem>
            <MenuItem value="electrical">Electrical</MenuItem>
            <MenuItem value="mechanical">Mechanical</MenuItem>
            <MenuItem value="plastic">Plastic</MenuItem>
          </Select>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleInwardSubmit} variant="contained">
            {" "}
            Inward
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
