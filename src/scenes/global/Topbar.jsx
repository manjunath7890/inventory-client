import { Box, IconButton, Typography, useTheme, Tooltip } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SummarizeIcon from '@mui/icons-material/Summarize';
import SearchIcon from "@mui/icons-material/Search";
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from "react-router-dom";

const Topbar = ({role}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={2}
      color={'#000'}
      // borderBottom={`1px solid #111`}
      style={{background: '#02b384'}}
    >
      {/* Brand Name */}
      <Box display="flex" alignItems="center">
        <Typography
          variant="h6"
          sx={{
            textDecoration: 'none',
            color: '#000',
            fontWeight: '500',
            marginRight: '1rem',
            fontSize: '1rem'
          }}
        >
          Inventory Management
        </Typography>
      </Box>

      {/* Navigation Icons */}
      <Box display="flex" alignItems="center">
        {(role === 'admin' || role === 'master admin') ?
        <Tooltip title="Users" arrow>
          <IconButton component={Link} to="/users" color="inherit" style={{ marginRight: '1rem' }}>
            <PersonOutlinedIcon />
            <Typography variant="body2" sx={{ marginLeft: 0.5 }}>
              Users
            </Typography>
          </IconButton>
        </Tooltip> : <> </>}
        <Tooltip title="Dashboard" arrow>
          <IconButton component={Link} to="/dashboard" color="inherit" style={{ marginRight: '1rem' }}>
            <DashboardIcon />
            <Typography variant="body2" sx={{ marginLeft: 0.5 }}>
              Dashboard
            </Typography>
          </IconButton>
        </Tooltip>
        <Tooltip title="Summary" arrow>
          <IconButton component={Link} to="/summary" color="inherit" style={{ marginRight: '1rem' }}>
            <SummarizeIcon />
            <Typography variant="body2" sx={{ marginLeft: 0.5 }}>
              Summary
            </Typography>
          </IconButton>
        </Tooltip>
        {/* <Tooltip title="Logout" arrow>
          <IconButton component="a" href="/" color="inherit">
            <LogoutIcon />
            <Typography variant="body2" sx={{ marginLeft: 0.5 }}>
              Logout
            </Typography>s
          </IconButton>
        </Tooltip> */}
      </Box>
    </Box>
  );
};

export default Topbar;
