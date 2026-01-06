import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { logout } from "../../redux/userSlice";
import ProfileMenu from "../common/ProfileMenu";
import { useColorMode } from "../common/theme/ColorModeContext";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Navbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  
  // Get theme and color mode
  const theme = useTheme();
  const { mode, toggleColorMode } = useColorMode();
  
  const isBroker = user?.type === "broker";
  const isUser = user?.type === "user";
  const isAdmin = user?.type === "admin";
  const isLoggedIn = !!user?.email;

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [brokerMenuAnchorEl, setBrokerMenuAnchorEl] = useState(null);
  const [adminMenuAnchorEl, setAdminMenuAnchorEl] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  if (["/login", "/signup"].includes(location.pathname)) return null;

  // Logo selection based on theme mode
  const logoSrc = mode === 'dark' ? "/images/logo-dark.png" : "/images/logo.png";

  const goToRecommendations = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/user/preferences/latest",
        {
          withCredentials: true,
        }
      );
      const prefId = res.data.preference?._id;
      if (prefId) {
        navigate(`/matches/${prefId}`);
      } else {
        navigate("/preferences");
      }
    } catch (err) {
      // 401 means session expired - redirect to login
      if (err.response?.status === 401) {
        navigate("/login", {
          state: {
            from: location.pathname,
            message: "Your session has expired. Please log in again.",
          },
        });
      } else if (err.response?.status === 404) {
        // 404 is expected for users without preferences
        navigate("/preferences");
      } else {
        // Other errors - still try to navigate to preferences
        console.error("Could not load recommendations", err);
        navigate("/preferences");
      }
    }
  };

  // Public links (shown when not logged in)
  const publicLinks = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
  ];

  const brokerLinks = [
    { 
      label: "Broker Portal", 
      dropdownItems: [
        { label: "Dashboard", to: "/broker/dashboard" },
        { label: "My Listings", to: "/broker/listings" },
        { label: "Add Listing", to: "/broker/add-listing" },
        { label: "Inquiries", to: "/broker/inquiries" },
        { label: "Tours", to: "/broker/tours" },
        { label: "Analytics", to: "/broker/analytics" },
        { label: "Profile", to: "/broker/profile" },
        { label: "Settings", to: "/broker/settings" }
      ]
    },
  ];

  const adminLinks = [
    { 
      label: "Admin Portal", 
      dropdownItems: [
        { label: "Dashboard", to: "/admin/dashboard" },
        { label: "Manage Brokers", to: "/admin/brokers" },
        { label: "Manage Users", to: "/admin/users" },
        { label: "Review Listings", to: "/admin/listings" },
        { label: "Settings", to: "/admin/settings" }
      ]
    },
  ];

  const userLinks = [
    { label: "Get Matched", to: "/preferences" },
    { label: "My Recommendations", to: null },
    { label: "Saved Listings", to: "/user/saved" },
    { label: "My Tours", to: "/user/tours" },
    { label: "Map View", to: "/map" },
  ];

  // Conditionally build links based on login status
  const allLinks = isLoggedIn
    ? [
        // Logged in: Show Home + role-specific links
        { label: "Home", to: "/" },
        ...(isAdmin ? adminLinks : []),
        ...(isBroker ? brokerLinks : []),
        ...(isUser ? userLinks : []),
      ]
    : [
        // Not logged in: Show public links
        ...publicLinks,
      ];

  const handleLinkClick = (label, to) => {
    if (label === "My Recommendations" || label === "Recommendations") {
      goToRecommendations();
    } else if (to) {
      navigate(to);
    }
  };

  const handleBrokerMenuOpen = (event) => {
    setBrokerMenuAnchorEl(event.currentTarget);
  };

  const handleBrokerMenuClose = () => {
    setBrokerMenuAnchorEl(null);
  };

  const handleBrokerMenuItemClick = (to) => {
    navigate(to);
    handleBrokerMenuClose();
  };

  const handleAdminMenuOpen = (event) => {
    setAdminMenuAnchorEl(event.currentTarget);
  };

  const handleAdminMenuClose = () => {
    setAdminMenuAnchorEl(null);
  };

  const handleAdminMenuItemClick = (to) => {
    navigate(to);
    handleAdminMenuClose();
  };

  const handleToggleTheme = () => {
    setIsSpinning(true);
    toggleColorMode();
    setTimeout(() => setIsSpinning(false), 500);
  };

  // Use the theme's colors
  const navButtonStyle = {
    color: theme.palette.text.primary,
    fontWeight: 500,
    textTransform: "none",
    "&:hover": {
      color: theme.palette.primary.main,
      backgroundColor: "transparent",
    },
  };

  const logoutButtonStyle = {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    textTransform: "none",
    fontWeight: 600,
    px: 3,
    borderRadius: 2,
    "&:hover": {
      backgroundColor: mode === 'light' ? "#e6f9f3" : "rgba(35, 206, 163, 0.1)",
      borderColor: theme.palette.primary.main,
    },
  };

  const activeNavStyle = {
    color: theme.palette.primary.main,
    fontWeight: 600,
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    borderRadius: 0,
  };

  const activeDrawerStyle = {
    backgroundColor: mode === 'light' ? "#e6f9f3" : "rgba(35, 206, 163, 0.1)",
    fontWeight: 600,
    color: theme.palette.primary.main,
  };

  return (
    <AppBar
      position="static"
      elevation={1}
      color="inherit"
      sx={{ py: 1 }}
    >
      <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
        <Box
          component={Link}
          to="/"
          sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}
        >
          <img src={logoSrc} alt="Logo" style={{ height: 40 }} />
        </Box>

        {!isMobile && (
          <Box sx={{ display: "flex", gap: 2 }}>
            {allLinks.map((link) => 
              link.dropdownItems ? (
                <Box key={link.label}>
                  <Button
                    sx={navButtonStyle}
                    endIcon={<ExpandMoreIcon />}
                    onClick={link.label === "Broker Portal" ? handleBrokerMenuOpen : handleAdminMenuOpen}
                  >
                    {link.label}
                  </Button>
                  
                  {/* Broker Portal Menu */}
                  {link.label === "Broker Portal" && (
                    <Menu
                      anchorEl={brokerMenuAnchorEl}
                      open={Boolean(brokerMenuAnchorEl)}
                      onClose={handleBrokerMenuClose}
                      MenuListProps={{ sx: { py: 0 } }}
                    >
                      {link.dropdownItems.map((item) => (
                        <MenuItem 
                          key={item.label} 
                          onClick={() => handleBrokerMenuItemClick(item.to)}
                          sx={{ 
                            py: 1.5, 
                            px: 2,
                            minWidth: 180,
                            ...(location.pathname === item.to || 
                                (item.to === '/broker/add-listing' && location.pathname === '/list-apartment') ? {
                              backgroundColor: 'rgba(35, 206, 163, 0.08)',
                              color: theme.palette.primary.main,
                              fontWeight: 600
                            } : {})
                          }}
                        >
                          {item.label}
                        </MenuItem>
                      ))}
                    </Menu>
                  )}
                  
                  {/* Admin Portal Menu */}
                  {link.label === "Admin Portal" && (
                    <Menu
                      anchorEl={adminMenuAnchorEl}
                      open={Boolean(adminMenuAnchorEl)}
                      onClose={handleAdminMenuClose}
                      MenuListProps={{ sx: { py: 0 } }}
                    >
                      {link.dropdownItems.map((item) => (
                        <MenuItem 
                          key={item.label} 
                          onClick={() => handleAdminMenuItemClick(item.to)}
                          sx={{ 
                            py: 1.5, 
                            px: 2,
                            minWidth: 180,
                            ...(location.pathname === item.to ? {
                              backgroundColor: 'rgba(35, 206, 163, 0.08)',
                              color: theme.palette.primary.main,
                              fontWeight: 600
                            } : {})
                          }}
                        >
                          {item.label}
                        </MenuItem>
                      ))}
                    </Menu>
                  )}
                </Box>
              ) : (
                <Button
                  key={link.label}
                  sx={{
                    ...navButtonStyle,
                    ...(link.to === location.pathname && activeNavStyle),
                  }}
                  onClick={() => handleLinkClick(link.label, link.to)}
                >
                  {link.label}
                </Button>
              )
            )}
          </Box>
        )}

        {!isMobile && (
          <Box display="flex" alignItems="center" gap={1}>
            {/* Dark Mode Toggle */}
            <IconButton
              onClick={handleToggleTheme}
              sx={{
                color: theme.palette.text.primary,
                "&:hover": {
                  backgroundColor: mode === 'light' ? "rgba(0, 0, 0, 0.04)" : "rgba(255, 255, 255, 0.08)",
                },
              }}
            >
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  transformOrigin: "center",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    animation: isSpinning ? "spin 0.5s linear" : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {theme.palette.mode === "dark" ? (
                    <Brightness7Icon fontSize="small" />
                  ) : (
                    <Brightness4Icon fontSize="small" />
                  )}
                </Box>
              </Box>
            </IconButton>
            
            {isLoggedIn ? (
              <>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  Logged in as <strong>{user.email}</strong>
                  {isAdmin && (
                    <Typography component="span" color="error.main" fontWeight="bold" sx={{ ml: 1 }}>
                      (Admin)
                    </Typography>
                  )}
                </Typography>
                <ProfileMenu user={user} />
              </>
            ) : (
              <>
                <Button onClick={() => navigate("/login")} sx={navButtonStyle}>
                  Login
                </Button>
                <Button onClick={() => navigate("/signup")} sx={navButtonStyle}>
                  Signup
                </Button>
              </>
            )}
          </Box>
        )}

        {isMobile && (
          <>
            <IconButton onClick={() => setDrawerOpen(true)} edge="end" color="inherit">
              <MenuIcon />
            </IconButton>
            
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            >
              <Box
                sx={{ width: 250 }}
                role="presentation"
              >
                <List>
                  {/* Home link - show for all users */}
                  <ListItem disablePadding>
                    <ListItemButton
                      selected={location.pathname === "/"}
                      onClick={() => {
                        navigate("/");
                        setDrawerOpen(false);
                      }}
                      sx={location.pathname === "/" ? activeDrawerStyle : {}}
                    >
                      <ListItemText primary="Home" />
                    </ListItemButton>
                  </ListItem>
                  
                  {/* Public links - only show when not logged in */}
                  {!isLoggedIn && publicLinks.filter(link => link.label !== "Home").map(({ label, to }) => (
                    <ListItem key={label} disablePadding>
                      <ListItemButton
                        selected={to === location.pathname}
                        onClick={() => {
                          navigate(to);
                          setDrawerOpen(false);
                        }}
                        sx={to === location.pathname ? activeDrawerStyle : {}}
                      >
                        <ListItemText primary={label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                  
                  {/* Admin Portal Links */}
                  {isAdmin && (
                    <>
                      <ListItem sx={{ pt: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Admin Portal
                        </Typography>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton
                          selected={location.pathname === "/admin/dashboard"}
                          onClick={() => {
                            navigate("/admin/dashboard");
                            setDrawerOpen(false);
                          }}
                          sx={location.pathname === "/admin/dashboard" ? activeDrawerStyle : {}}
                        >
                          <ListItemText primary="Dashboard" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton
                          selected={location.pathname === "/admin/brokers"}
                          onClick={() => {
                            navigate("/admin/brokers");
                            setDrawerOpen(false);
                          }}
                          sx={location.pathname === "/admin/brokers" ? activeDrawerStyle : {}}
                        >
                          <ListItemText primary="Manage Brokers" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton
                          selected={location.pathname === "/admin/users"}
                          onClick={() => {
                            navigate("/admin/users");
                            setDrawerOpen(false);
                          }}
                          sx={location.pathname === "/admin/users" ? activeDrawerStyle : {}}
                        >
                          <ListItemText primary="Manage Users" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton
                          selected={location.pathname === "/admin/listings"}
                          onClick={() => {
                            navigate("/admin/listings");
                            setDrawerOpen(false);
                          }}
                          sx={location.pathname === "/admin/listings" ? activeDrawerStyle : {}}
                        >
                          <ListItemText primary="Review Listings" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton
                          selected={location.pathname === "/admin/settings"}
                          onClick={() => {
                            navigate("/admin/settings");
                            setDrawerOpen(false);
                          }}
                          sx={location.pathname === "/admin/settings" ? activeDrawerStyle : {}}
                        >
                          <ListItemText primary="Settings" />
                        </ListItemButton>
                      </ListItem>
                    </>
                  )}
                  
                  {/* Broker Portal Links */}
                  {isBroker && (
                    <>
                      <ListItem sx={{ pt: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Broker Portal
                        </Typography>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton
                          selected={location.pathname === "/broker/dashboard"}
                          onClick={() => {
                            navigate("/broker/dashboard");
                            setDrawerOpen(false);
                          }}
                          sx={location.pathname === "/broker/dashboard" ? activeDrawerStyle : {}}
                        >
                          <ListItemText primary="Dashboard" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton
                          selected={location.pathname === "/broker/listings"}
                          onClick={() => {
                            navigate("/broker/listings");
                            setDrawerOpen(false);
                          }}
                          sx={location.pathname === "/broker/listings" ? activeDrawerStyle : {}}
                        >
                          <ListItemText primary="My Listings" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton
                          selected={location.pathname === "/broker/add-listing" || location.pathname === "/list-apartment"}
                          onClick={() => {
                            navigate("/broker/add-listing");
                            setDrawerOpen(false);
                          }}
                          sx={(location.pathname === "/broker/add-listing" || location.pathname === "/list-apartment") ? activeDrawerStyle : {}}
                        >
                          <ListItemText primary="Add Listing" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton
                          selected={location.pathname === "/broker/inquiries"}
                          onClick={() => {
                            navigate("/broker/inquiries");
                            setDrawerOpen(false);
                          }}
                          sx={location.pathname === "/broker/inquiries" ? activeDrawerStyle : {}}
                        >
                          <ListItemText primary="Inquiries" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton
                          selected={location.pathname === "/broker/tours"}
                          onClick={() => {
                            navigate("/broker/tours");
                            setDrawerOpen(false);
                          }}
                          sx={location.pathname === "/broker/tours" ? activeDrawerStyle : {}}
                        >
                          <ListItemText primary="Tours" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton
                          selected={location.pathname === "/broker/analytics"}
                          onClick={() => {
                            navigate("/broker/analytics");
                            setDrawerOpen(false);
                          }}
                          sx={location.pathname === "/broker/analytics" ? activeDrawerStyle : {}}
                        >
                          <ListItemText primary="Analytics" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton
                          selected={location.pathname === "/broker/profile"}
                          onClick={() => {
                            navigate("/broker/profile");
                            setDrawerOpen(false);
                          }}
                          sx={location.pathname === "/broker/profile" ? activeDrawerStyle : {}}
                        >
                          <ListItemText primary="Profile" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton
                          selected={location.pathname === "/broker/settings"}
                          onClick={() => {
                            navigate("/broker/settings");
                            setDrawerOpen(false);
                          }}
                          sx={location.pathname === "/broker/settings" ? activeDrawerStyle : {}}
                        >
                          <ListItemText primary="Settings" />
                        </ListItemButton>
                      </ListItem>
                    </>
                  )}
                  
                  {/* Regular User Links */}
                  {isUser && (
                    <>
                      <ListItem disablePadding>
                        <ListItemButton
                          selected={location.pathname === "/preferences"}
                          onClick={() => {
                            navigate("/preferences");
                            setDrawerOpen(false);
                          }}
                          sx={location.pathname === "/preferences" ? activeDrawerStyle : {}}
                        >
                          <ListItemText primary="Get Matched" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => {
                            goToRecommendations();
                            setDrawerOpen(false);
                          }}
                        >
                          <ListItemText primary="My Recommendations" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton
                          selected={location.pathname === "/user/saved"}
                          onClick={() => {
                            navigate("/user/saved");
                            setDrawerOpen(false);
                          }}
                          sx={location.pathname === "/user/saved" ? activeDrawerStyle : {}}
                        >
                          <ListItemText primary="Saved Listings" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton
                          selected={location.pathname === "/user/tours"}
                          onClick={() => {
                            navigate("/user/tours");
                            setDrawerOpen(false);
                          }}
                          sx={location.pathname === "/user/tours" ? activeDrawerStyle : {}}
                        >
                          <ListItemText primary="My Tours" />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton
                          selected={location.pathname === "/map"}
                          onClick={() => {
                            navigate("/map");
                            setDrawerOpen(false);
                          }}
                          sx={location.pathname === "/map" ? activeDrawerStyle : {}}
                        >
                          <ListItemText primary="Map View" />
                        </ListItemButton>
                      </ListItem>
                    </>
                  )}
                </List>
                <Divider />
                <Box px={2} py={1}>
                  {/* Dark Mode Toggle in Mobile Drawer */}
                  <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                      onClick={handleToggleTheme}
                      sx={{
                        borderRadius: 1,
                        "&:hover": {
                          backgroundColor: mode === 'light' ? "rgba(0, 0, 0, 0.04)" : "rgba(255, 255, 255, 0.08)",
                        },
                      }}
                    >
                      <ListItemIcon>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                            transformOrigin: "center",
                          }}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              animation: isSpinning ? "spin 0.5s linear" : "none",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            {theme.palette.mode === "dark" ? (
                              <Brightness7Icon fontSize="small" />
                            ) : (
                              <Brightness4Icon fontSize="small" />
                            )}
                          </Box>
                        </Box>
                      </ListItemIcon>
                      <ListItemText 
                        primary={theme.palette.mode === "dark" ? "Light Mode" : "Dark Mode"} 
                      />
                    </ListItemButton>
                  </ListItem>
                  
                  {isLoggedIn ? (
                    <>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        Logged in as <strong>{user.email}</strong>
                        {isAdmin && (
                          <Typography component="span" color="error.main" fontWeight="bold" sx={{ ml: 1 }}>
                            (Admin)
                          </Typography>
                        )}
                      </Typography>
                      <Button
                        fullWidth
                        onClick={() => {
                          navigate("/profile");
                          setDrawerOpen(false);
                        }}
                        sx={navButtonStyle}
                      >
                        Profile
                      </Button>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={async () => {
                          try {
                            await axios.post(
                              "http://localhost:4000/api/user/logout",
                              {},
                              { withCredentials: true }
                            );
                            dispatch(logout());
                            navigate("/login");
                          } catch (err) {
                            console.error("Logout error", err);
                          }
                        }}
                        sx={logoutButtonStyle}
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        fullWidth
                        onClick={() => {
                          navigate("/login");
                          setDrawerOpen(false);
                        }}
                        sx={navButtonStyle}
                      >
                        Login
                      </Button>
                      <Button
                        fullWidth
                        onClick={() => {
                          navigate("/signup");
                          setDrawerOpen(false);
                        }}
                        sx={navButtonStyle}
                      >
                        Signup
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            </Drawer>
          </>
        )}
      </Toolbar>
      
      {/* Spin animation for theme toggle */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}
      </style>
    </AppBar>
  );
};

export default Navbar;