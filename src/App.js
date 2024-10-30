import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, tokens, useMode } from "./theme";
import Users from "./scenes/user/users";
import Login from "./scenes/user/login";
import Parts from "./scenes/parts/PartsTable";
import PartsIO from "./scenes/partsIO/partsIO";
import Dashboard from "./scenes/dashboard/Dashboard";
import Bom from "./scenes/bom/Bom";

function App() {
  const [theme, colorMode] = useMode();
  const colors = tokens(theme.palette.mode);

  const location = useLocation();


  // Determine if the current route is the login page
  const isLoginPage = location.pathname === "/";

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <main className="content">
            {/* Render Topbar only if user is logged in and not on the login page */}
            {!isLoginPage && <Topbar />}
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/parts" element={<Parts />} />
              <Route path="/bill-of-materials" element={<Bom />} />
              <Route path="/summary" element={<PartsIO />} />
              <Route path="/users" element={<Users />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
