// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import Box from '@mui/material/Box';
// import Drawer from '@mui/material/Drawer';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import ScienceIcon from '@mui/icons-material/Science';
// import TableChartIcon from '@mui/icons-material/TableChart';
// import WarningIcon from '@mui/icons-material/Warning';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// // Import pages
// import Dashboard from './pages/Dashboard';
// import QualityPrediction from './pages/QualityPrediction';
// import RTMView from './pages/RTMView';
// import CoverageGaps from './pages/CoverageGaps';
// import Inventory from './pages/Inventory';

// const drawerWidth = 240;
// const theme = createTheme({
//   palette: {
//     mode: 'light',
//     primary: {
//       main: '#1976d2',
//     },
//     secondary: {
//       main: '#dc004e',
//     },
//   },
// });

// function App() {
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   const menuItems = [
//     { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
//     { text: 'Inventory', icon: <ShoppingCartIcon />, path: '/inventory' },
//     { text: 'Quality Prediction', icon: <ScienceIcon />, path: '/quality' },
//     { text: 'RTM', icon: <TableChartIcon />, path: '/rtm' },
//     { text: 'Coverage Gaps', icon: <WarningIcon />, path: '/gaps' },
//   ];

//   const drawer = (
//     <div>
//       <Toolbar>
//         <Typography variant="h6" noWrap component="div">
//           NextGen QA 
//         </Typography>
//       </Toolbar>
//       <List>
//         {menuItems.map((item) => (
//           <ListItem key={item.text} disablePadding>
//             <ListItemButton component={NavLink} to={item.path} end={item.path === '/'}>
//               <ListItemIcon>{item.icon}</ListItemIcon>
//               <ListItemText primary={item.text} />
//             </ListItemButton>
//           </ListItem>
//         ))}
//       </List>
//     </div>
//   );

//   return (
//     <ThemeProvider theme={theme}>
//       <Router>
//         <Box sx={{ display: 'flex' }}>
//           <CssBaseline />
          
//           {/* Mobile drawer */}
//           <Box
//             component="nav"
//             sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
//           >
//             <Drawer
//               variant="temporary"
//               open={mobileOpen}
//               onClose={handleDrawerToggle}
//               ModalProps={{ keepMounted: true }}
//               sx={{
//                 display: { xs: 'block', sm: 'none' },
//                 '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
//               }}
//             >
//               {drawer}
//             </Drawer>
//             <Drawer
//               variant="permanent"
//               sx={{
//                 display: { xs: 'none', sm: 'block' },
//                 '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
//               }}
//               open
//             >
//               {drawer}
//             </Drawer>
//           </Box>

//           {/* Main content */}
//           <Box
//             component="main"
//             sx={{
//               flexGrow: 1,
//               p: 3,
//               width: { sm: `calc(100% - ${drawerWidth}px)` },
//             }}
//           >
//             <Toolbar />
//             <Routes>
//               <Route path="/" element={<Dashboard />} />
//               <Route path="/inventory" element={<Inventory />} />
//               <Route path="/quality" element={<QualityPrediction />} />
//               <Route path="/rtm" element={<RTMView />} />
//               <Route path="/gaps" element={<CoverageGaps />} />
//             </Routes>
//           </Box>
//         </Box>
//       </Router>
//     </ThemeProvider>
//   );
// }

// export default App;


import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ScienceIcon from '@mui/icons-material/Science';
import TableChartIcon from '@mui/icons-material/TableChart';
import WarningIcon from '@mui/icons-material/Warning';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AssessmentIcon from '@mui/icons-material/Assessment';

// Import pages
import Dashboard from './pages/Dashboard';
import QualityPrediction from './pages/QualityPrediction';
import RTMView from './pages/RTMView';
import CoverageGaps from './pages/CoverageGaps';
import Inventory from './pages/Inventory';

const drawerWidth = 280;

// Styled components for sidebar
const SidebarHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
    pointerEvents: 'none',
  },
}));

const LogoIcon = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  background: 'rgba(255,255,255,0.2)',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(1.5),
  backdropFilter: 'blur(10px)',
}));

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: 'none',
  color: 'inherit',
  display: 'block',
  margin: '4px 8px',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  '& .MuiListItemButton-root': {
    borderRadius: '12px',
    padding: '10px 16px',
    transition: 'all 0.3s ease',
  },
  '&:hover .MuiListItemButton-root': {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    transform: 'translateX(5px)',
  },
  '&.active .MuiListItemButton-root': {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    '& .MuiListItemIcon-root': {
      color: 'white',
    },
  },
  '& .MuiListItemIcon-root': {
    minWidth: 40,
    transition: 'all 0.3s ease',
  },
}));

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#667eea',
      },
      secondary: {
        main: '#764ba2',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f7fa',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
    },
  });

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Test Inventory', icon: <ShoppingCartIcon />, path: '/inventory' },
    { text: 'Quality Prediction', icon: <ScienceIcon />, path: '/quality' },
    { text: 'RTM Matrix', icon: <TableChartIcon />, path: '/rtm' },
    { text: 'Coverage Gaps', icon: <WarningIcon />, path: '/gaps' },
  ];

  const drawer = (
    <div>
      <SidebarHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <LogoIcon>
            <AssessmentIcon sx={{ fontSize: 24 }} />
          </LogoIcon>
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #fff 0%, #e0e0e0 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '0.5px'
            }}
          >
            NextGen QA
          </Typography>
        </Box>
        <IconButton 
          onClick={() => setDarkMode(!darkMode)} 
          sx={{ 
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            }
          }}
        >
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </SidebarHeader>
      
      <Box sx={{ mt: 2 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <StyledNavLink to={item.path} end={item.path === '/'}>
                <ListItemButton>
                  <ListItemIcon sx={{ color: darkMode ? '#b0b0b0' : '#667eea' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{
                      sx: { fontWeight: 500, fontSize: '0.95rem' }
                    }}
                  />
                </ListItemButton>
              </StyledNavLink>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Footer Section */}
      <Box sx={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        p: 2,
        borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        textAlign: 'center'
      }}>
        <Typography variant="caption" color="textSecondary">
          © 2026 NextGen QA
        </Typography>
        <Box sx={{ mt: 1, display: 'flex', gap: 1, justifyContent: 'center' }}>
          <Box sx={{ 
            width: 8, 
            height: 8, 
            borderRadius: '50%', 
            bgcolor: '#4caf50',
            display: 'inline-block',
            animation: 'pulse 2s infinite'
          }} />
          <Typography variant="caption" color="textSecondary">
            System Online
          </Typography>
        </Box>
      </Box>
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <CssBaseline />
          
          {/* Mobile drawer */}
          <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          >
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{ keepMounted: true }}
              sx={{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': { 
                  boxSizing: 'border-box', 
                  width: drawerWidth,
                  background: darkMode ? '#1a1a1a' : '#ffffff',
                  borderRight: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                },
              }}
            >
              {drawer}
            </Drawer>
            <Drawer
              variant="permanent"
              sx={{
                display: { xs: 'none', sm: 'block' },
                '& .MuiDrawer-paper': { 
                  boxSizing: 'border-box', 
                  width: drawerWidth,
                  background: darkMode ? '#1a1a1a' : '#ffffff',
                  borderRight: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  boxShadow: darkMode ? 'none' : '2px 0 8px rgba(0,0,0,0.05)',
                },
              }}
              open
            >
              {drawer}
            </Drawer>
          </Box>

          {/* Main content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              background: darkMode ? '#121212' : '#f5f7fa',
              minHeight: '100vh',
            }}
          >
            <Toolbar sx={{ 
              display: { xs: 'flex', sm: 'none' },
              justifyContent: 'space-between',
              mb: 2
            }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                NextGen QA
              </Typography>
              <IconButton onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Toolbar>
            
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/quality" element={<QualityPrediction />} />
              <Route path="/rtm" element={<RTMView />} />
              <Route path="/gaps" element={<CoverageGaps />} />
            </Routes>
          </Box>
        </Box>
      </Router>

      {/* Global styles for animations */}
      <style>
        {`
          @keyframes pulse {
            0% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.5;
              transform: scale(1.2);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
    </ThemeProvider>
  );
}

export default App;