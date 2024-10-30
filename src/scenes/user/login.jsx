import { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";

const Login = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      if (email === "altenersolutions@gmail.com" && password === "password") {
        navigate("/dashboard");
      } else {
        setError("Incorrect Email or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred during login.");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      p={2}
      bgcolor="#aae3d4" // Page background color
    >
      <Paper
        // elevation={3}
        style={{
          padding: "2rem",
          maxWidth: "400px",
          width: "100%",
          // backgroundColor: "#02b384", // Login box background color
        }}
      >
        <Typography
          variant="h2"
          gutterBottom
          align="center"
          fontWeight="bold"
        >
          Login
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          margin="normal"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            marginBottom: "0.5rem",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                // borderColor: "#000",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#000",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#000",
            },
          }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            marginBottom: "1rem",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                // borderColor: "#000",
              }
            },
            "& .MuiInputLabel-root": {
              color: "#000",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#000",
            },
          }}
        />
        {error && (
          <Typography
            color="#f00"
            align="center"
            style={{ marginBottom: "1rem" }}
          >
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          fullWidth
          style={{ padding: "0.75rem", fontSize: "1rem" }}
        >
          Login
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
