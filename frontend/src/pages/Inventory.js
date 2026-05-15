// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   CardMedia,
//   CardActions,
//   Button,
//   Chip,
//   LinearProgress,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   ToggleButtonGroup,
//   ToggleButton,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions
// } from '@mui/material';
// import RefreshIcon from '@mui/icons-material/Refresh';
// import ViewListIcon from '@mui/icons-material/ViewList';
// import GridViewIcon from '@mui/icons-material/GridView';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
// import CategoryIcon from '@mui/icons-material/Category';
// import WarningIcon from '@mui/icons-material/Warning';

// const API_BASE_URL = 'http://localhost:8004';

// function Inventory() {
//   const [inventory, setInventory] = useState([]);
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
//   const [categoryFilter, setCategoryFilter] = useState('all');
//   const [error, setError] = useState(null);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [detailsOpen, setDetailsOpen] = useState(false);
//   const [imageErrors, setImageErrors] = useState({});

//   useEffect(() => {
//     fetchInventory();
//     fetchStats();
//   }, []);

//   const fetchInventory = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await fetch(`${API_BASE_URL}/inventory`);
//       const result = await response.json();
      
//       if (result.success) {
//         setInventory(result.data);
//       } else {
//         setError('Failed to load inventory');
//       }
//     } catch (err) {
//       setError('Unable to connect to backend. Make sure the server is running on port 8004.');
//       console.error('Error fetching inventory:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchStats = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/inventory/stats`);
//       const result = await response.json();
      
//       if (result.success) {
//         setStats(result.statistics);
//       }
//     } catch (err) {
//       console.error('Error fetching stats:', err);
//     }
//   };

//   const handleViewModeChange = (event, newMode) => {
//     if (newMode !== null) {
//       setViewMode(newMode);
//     }
//   };

//   const handleCategoryChange = (event) => {
//     setCategoryFilter(event.target.value);
//   };

//   const handleViewDetails = (item) => {
//     setSelectedItem(item);
//     setDetailsOpen(true);
//   };

//   const handleCloseDetails = () => {
//     setDetailsOpen(false);
//     setSelectedItem(null);
//   };

//   const handleImageError = (itemId) => {
//     setImageErrors(prev => ({
//       ...prev,
//       [itemId]: true
//     }));
//   };

//   const getProductImage = (item) => {
//     if (imageErrors[item.id]) {
//       return null; // Return null to show fallback UI
//     }
//     return item.image;
//   };

//   const filteredInventory = categoryFilter === 'all' 
//     ? inventory 
//     : inventory.filter(item => item.category === categoryFilter);

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD'
//     }).format(price);
//   };

//   const getStockColor = (stock) => {
//     if (stock < 30) return 'error';
//     if (stock < 60) return 'warning';
//     return 'success';
//   };

//   const getStockLabel = (stock) => {
//     if (stock < 30) return 'Low Stock';
//     if (stock < 60) return 'Medium Stock';
//     return 'In Stock';
//   };

//   if (loading) {
//     return (
//       <Box sx={{ width: '100%', mt: 4 }}>
//         <LinearProgress />
//         <Typography variant="h6" align="center" sx={{ mt: 2 }}>
//           Loading inventory...
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box>
//       {/* Header */}
//       <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
//         <Box>
//           <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#1a237e' }}>
//             Product Inventory
//           </Typography>
//           <Typography variant="body1" color="textSecondary">
//             Manage and monitor your product catalog
//           </Typography>
//         </Box>
        
//         <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
//           <FormControl size="small" sx={{ minWidth: 150 }}>
//             <InputLabel>Category</InputLabel>
//             <Select
//               value={categoryFilter}
//               label="Category"
//               onChange={handleCategoryChange}
//             >
//               <MenuItem value="all">All Categories</MenuItem>
//               <MenuItem value="clothing">Clothing</MenuItem>
//               <MenuItem value="accessories">Accessories</MenuItem>
//             </Select>
//           </FormControl>

//           <ToggleButtonGroup
//             value={viewMode}
//             exclusive
//             onChange={handleViewModeChange}
//             size="small"
//           >
//             <ToggleButton value="grid">
//               <GridViewIcon />
//             </ToggleButton>
//             <ToggleButton value="table">
//               <ViewListIcon />
//             </ToggleButton>
//           </ToggleButtonGroup>

//           <IconButton onClick={fetchInventory} color="primary">
//             <RefreshIcon />
//           </IconButton>
//         </Box>
//       </Box>

//       {/* Statistics Cards */}
//       {stats && (
//         <Grid container spacing={3} sx={{ mb: 4 }}>
//           <Grid item xs={12} sm={6} md={3}>
//             <Card sx={{ 
//               background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//               color: 'white',
//               boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
//             }}>
//               <CardContent>
//                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                   <ShoppingCartIcon sx={{ mr: 1 }} />
//                   <Typography variant="body2" sx={{ opacity: 0.9 }}>
//                     Total Products
//                   </Typography>
//                 </Box>
//                 <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
//                   {stats.total_items}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>

//           <Grid item xs={12} sm={6} md={3}>
//             <Card sx={{ 
//               background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
//               color: 'white',
//               boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
//             }}>
//               <CardContent>
//                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                   <AttachMoneyIcon sx={{ mr: 1 }} />
//                   <Typography variant="body2" sx={{ opacity: 0.9 }}>
//                     Inventory Value
//                   </Typography>
//                 </Box>
//                 <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
//                   ${stats.total_inventory_value.toLocaleString()}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>

//           <Grid item xs={12} sm={6} md={3}>
//             <Card sx={{ 
//               background: 'linear-gradient(135deg, #2196f3 0%, #03a9f4 100%)',
//               color: 'white',
//               boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
//             }}>
//               <CardContent>
//                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                   <CategoryIcon sx={{ mr: 1 }} />
//                   <Typography variant="body2" sx={{ opacity: 0.9 }}>
//                     Categories
//                   </Typography>
//                 </Box>
//                 <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
//                   {stats.categories.length}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>

//           <Grid item xs={12} sm={6} md={3}>
//             <Card sx={{ 
//               background: 'linear-gradient(135deg, #ff9800 0%, #ffc107 100%)',
//               color: 'white',
//               boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
//             }}>
//               <CardContent>
//                 <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                   <WarningIcon sx={{ mr: 1 }} />
//                   <Typography variant="body2" sx={{ opacity: 0.9 }}>
//                     Low Stock Items
//                   </Typography>
//                 </Box>
//                 <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
//                   {stats.low_stock_count}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       )}

//       {/* Error Message */}
//       {error && (
//         <Paper sx={{ p: 3, mb: 3, bgcolor: 'error.light', color: 'error.contrastText' }}>
//           <Typography variant="body1">{error}</Typography>
//         </Paper>
//       )}

//       {/* Inventory Grid View */}
//       {viewMode === 'grid' && (
//         <Grid container spacing={3}>
//           {filteredInventory.map((item) => (
//             <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
//               <Card sx={{ 
//                 height: '100%', 
//                 display: 'flex', 
//                 flexDirection: 'column',
//                 transition: 'transform 0.2s',
//                 '&:hover': {
//                   transform: 'translateY(-4px)',
//                   boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
//                 }
//               }}>
//                 {imageErrors[item.id] ? (
//                   <Box
//                     sx={{
//                       height: 200,
//                       bgcolor: '#e0e0e0',
//                       display: 'flex',
//                       flexDirection: 'column',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       gap: 1
//                     }}
//                   >
//                     <Typography variant="h4">📦</Typography>
//                     <Typography variant="caption" sx={{ color: '#666', px: 2, textAlign: 'center' }}>
//                       {item.name}
//                     </Typography>
//                   </Box>
//                 ) : (
//                   <CardMedia
//                     component="img"
//                     height="200"
//                     image={getProductImage(item)}
//                     alt={item.name}
//                     sx={{ objectFit: 'cover', bgcolor: '#e0e0e0' }}
//                     onError={() => {
//                       if (!imageErrors[item.id]) {
//                         handleImageError(item.id);
//                       }
//                     }}
//                   />
//                 )}
//                 <CardContent sx={{ flexGrow: 1 }}>
//                   <Typography variant="h6" gutterBottom noWrap>
//                     {item.name}
//                   </Typography>
//                   <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
//                     {item.description}
//                   </Typography>
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//                     <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
//                       {formatPrice(item.price)}
//                     </Typography>
//                     <Chip
//                       label={getStockLabel(item.stock)}
//                       color={getStockColor(item.stock)}
//                       size="small"
//                     />
//                   </Box>
//                   <Typography variant="caption" color="textSecondary">
//                     Stock: {item.stock} units
//                   </Typography>
//                 </CardContent>
//                 <CardActions>
//                   <Button size="small" fullWidth variant="contained" color="primary" onClick={() => handleViewDetails(item)}>
//                     View Details
//                   </Button>
//                 </CardActions>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}

//       {/* Inventory Table View */}
//       {viewMode === 'table' && (
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow sx={{ bgcolor: '#f5f5f5' }}>
//                 <TableCell sx={{ fontWeight: 600 }}>Product Name</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>Stock</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
//                 <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredInventory.map((item) => (
//                 <TableRow key={item.id} hover>
//                   <TableCell>
//                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                       {imageErrors[item.id] ? (
//                         <Box
//                           sx={{
//                             width: 50,
//                             height: 50,
//                             mr: 2,
//                             bgcolor: '#e0e0e0',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             borderRadius: 1,
//                             fontSize: '20px'
//                           }}
//                         >
//                           📦
//                         </Box>
//                       ) : (
//                         <Box
//                           component="img"
//                           src={getProductImage(item)}
//                           alt={item.name}
//                           sx={{ width: 50, height: 50, mr: 2, objectFit: 'cover', bgcolor: '#e0e0e0', borderRadius: 1 }}
//                           onError={() => {
//                             if (!imageErrors[item.id]) {
//                               handleImageError(item.id);
//                             }
//                           }}
//                         />
//                       )}
//                       <Box>
//                         <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                           {item.name}
//                         </Typography>
//                         <Typography variant="caption" color="textSecondary" noWrap sx={{ maxWidth: 300 }}>
//                           {item.description}
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </TableCell>
//                   <TableCell sx={{ textTransform: 'capitalize' }}>{item.category}</TableCell>
//                   <TableCell>
//                     <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
//                       {formatPrice(item.price)}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>{item.stock}</TableCell>
//                   <TableCell>
//                     <Chip
//                       label={getStockLabel(item.stock)}
//                       color={getStockColor(item.stock)}
//                       size="small"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Button size="small" variant="outlined" color="primary" onClick={() => handleViewDetails(item)}>
//                       View
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}

//       {/* Product Details Dialog */}
//       <Dialog 
//         open={detailsOpen} 
//         onClose={handleCloseDetails}
//         maxWidth="md"
//         fullWidth
//       >
//         {selectedItem && (
//           <>
//             <DialogTitle sx={{ fontWeight: 600, color: '#1a237e' }}>
//               {selectedItem.name}
//             </DialogTitle>
//             <DialogContent dividers>
//               <Grid container spacing={3}>
//                 <Grid item xs={12} md={5}>
//                   {imageErrors[selectedItem.id] ? (
//                     <Box
//                       sx={{
//                         width: '100%',
//                         height: 400,
//                         bgcolor: '#e0e0e0',
//                         display: 'flex',
//                         flexDirection: 'column',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         gap: 2,
//                         borderRadius: 1
//                       }}
//                     >
//                       <Typography variant="h1">📦</Typography>
//                       <Typography variant="h6" sx={{ color: '#666' }}>
//                         {selectedItem.name}
//                       </Typography>
//                     </Box>
//                   ) : (
//                     <Box
//                       component="img"
//                       src={getProductImage(selectedItem)}
//                       alt={selectedItem.name}
//                       onError={() => {
//                         if (!imageErrors[selectedItem.id]) {
//                           handleImageError(selectedItem.id);
//                         }
//                       }}
//                       sx={{
//                         width: '100%',
//                         maxHeight: 400,
//                         objectFit: 'cover',
//                         bgcolor: '#e0e0e0',
//                         borderRadius: 1
//                       }}
//                     />
//                   )}
//                 </Grid>
//                 <Grid item xs={12} md={7}>
//                   <Box sx={{ mb: 3 }}>
//                     <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary' }}>
//                       Description
//                     </Typography>
//                     <Typography variant="body1">
//                       {selectedItem.description}
//                     </Typography>
//                   </Box>
                  
//                   <Box sx={{ mb: 3 }}>
//                     <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary' }}>
//                       Price
//                     </Typography>
//                     <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
//                       {formatPrice(selectedItem.price)}
//                     </Typography>
//                   </Box>
                  
//                   <Grid container spacing={2} sx={{ mb: 3 }}>
//                     <Grid item xs={6}>
//                       <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
//                         Category
//                       </Typography>
//                       <Typography variant="body1" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
//                         {selectedItem.category}
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
//                         Stock Status
//                       </Typography>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <Typography variant="body1" sx={{ fontWeight: 600 }}>
//                           {selectedItem.stock} units
//                         </Typography>
//                         <Chip
//                           label={getStockLabel(selectedItem.stock)}
//                           color={getStockColor(selectedItem.stock)}
//                           size="small"
//                         />
//                       </Box>
//                     </Grid>
//                   </Grid>
                  
//                   <Box>
//                     <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
//                       Product ID
//                     </Typography>
//                     <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
//                       #{selectedItem.id}
//                     </Typography>
//                   </Box>
//                 </Grid>
//               </Grid>
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={handleCloseDetails} variant="outlined">
//                 Close
//               </Button>
//             </DialogActions>
//           </>
//         )}
//       </Dialog>

//       {/* Footer Info */}
//       <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
//         <Typography variant="caption" color="textSecondary">
//           Data Source: Sauce Labs Sample Inventory | Backend API: http://localhost:8004/inventory
//         </Typography>
//       </Box>
//     </Box>
//   );
// }

// export default Inventory;


import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ViewListIcon from '@mui/icons-material/ViewList';
import GridViewIcon from '@mui/icons-material/GridView';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import WarningIcon from '@mui/icons-material/Warning';

const API_BASE_URL = 'http://localhost:8004';

// Product images mapping - direct working image URLs for each product
const getProductImageUrl = (productName) => {
  // Create a mapping object with exact product names
  const imageMap = {
    'Sauce Labs Backpack': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
    'Sauce Labs Bike Light': 'https://images.unsplash.com/photo-1552332381-f1165a6d18c8?w=400&h=300&fit=crop',
    'Sauce Labs Bolt T-Shirt': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
    'Sauce Labs Fleece Jacket': 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=300&fit=crop',
    'Sauce Labs Onesie': 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=300&fit=crop',
    'Test.allTheThings() T-Shirt': 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=400&h=300&fit=crop',
    'Sauce Labs Water Bottle': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop',
    'Sauce Labs Laptop Bag': 'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=400&h=300&fit=crop'
  };
  
  // Special handling for Bike Light - using a more reliable image URL
  if (productName === 'Sauce Labs Bike Light') {
    return 'https://m.media-amazon.com/images/I/61l5mNvHXFL._AC_SL1500_.jpg';
  }
  
  // Return the mapped image or a default placeholder
  return imageMap[productName] || 'https://placehold.co/400x300/e0e0e0/666666?text=Product+Image';
};

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    fetchInventory();
    fetchStats();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/inventory`);
      const result = await response.json();
      
      if (result.success) {
        setInventory(result.data);
      } else {
        setError('Failed to load inventory');
      }
    } catch (err) {
      setError('Unable to connect to backend. Make sure the server is running on port 8004.');
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/stats`);
      const result = await response.json();
      
      if (result.success) {
        setStats(result.statistics);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleCategoryChange = (event) => {
    setCategoryFilter(event.target.value);
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedItem(null);
  };

  const handleImageError = (productName) => {
    setImageErrors(prev => ({
      ...prev,
      [productName]: true
    }));
  };

  const getImageUrl = (productName) => {
    if (imageErrors[productName]) {
      return null;
    }
    return getProductImageUrl(productName);
  };

  const filteredInventory = categoryFilter === 'all' 
    ? inventory 
    : inventory.filter(item => item.category === categoryFilter);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getStockColor = (stock) => {
    if (stock < 30) return 'error';
    if (stock < 60) return 'warning';
    return 'success';
  };

  const getStockLabel = (stock) => {
    if (stock < 30) return 'Low Stock';
    if (stock < 60) return 'Medium Stock';
    return 'In Stock';
  };

  // Custom image component with fallback
  const ProductImage = ({ productName, alt, sx }) => {
    const imageUrl = getImageUrl(productName);
    
    if (!imageUrl) {
      return (
        <Box sx={{ ...sx, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#e0e0e0' }}>
          <Typography variant="h2">🚲</Typography>
        </Box>
      );
    }
    
    return (
      <Box
        component="img"
        src={imageUrl}
        alt={alt}
        sx={sx}
        onError={() => handleImageError(productName)}
      />
    );
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <LinearProgress />
        <Typography variant="h6" align="center" sx={{ mt: 2 }}>
          Loading inventory...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#1a237e' }}>
            Product Inventory
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage and monitor your product catalog
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={handleCategoryChange}
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="clothing">Clothing</MenuItem>
              <MenuItem value="accessories">Accessories</MenuItem>
            </Select>
          </FormControl>

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            size="small"
          >
            <ToggleButton value="grid">
              <GridViewIcon />
            </ToggleButton>
            <ToggleButton value="table">
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>

          <IconButton onClick={fetchInventory} color="primary">
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Statistics Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ShoppingCartIcon sx={{ mr: 1 }} />
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Products
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {stats.total_items}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AttachMoneyIcon sx={{ mr: 1 }} />
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Inventory Value
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  ${stats.total_inventory_value.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #2196f3 0%, #03a9f4 100%)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CategoryIcon sx={{ mr: 1 }} />
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Categories
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {stats.categories.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #ff9800 0%, #ffc107 100%)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <WarningIcon sx={{ mr: 1 }} />
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Low Stock Items
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {stats.low_stock_count}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Error Message */}
      {error && (
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'error.light', color: 'error.contrastText' }}>
          <Typography variant="body1">{error}</Typography>
        </Paper>
      )}

      {/* Inventory Grid View */}
      {viewMode === 'grid' && (
        <Grid container spacing={3}>
          {filteredInventory.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                }
              }}>
                <ProductImage
                  productName={item.name}
                  alt={item.name}
                  sx={{ 
                    height: 200,
                    width: '100%',
                    objectFit: 'cover',
                    bgcolor: '#f5f5f5'
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom noWrap>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {item.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                      {formatPrice(item.price)}
                    </Typography>
                    <Chip
                      label={getStockLabel(item.stock)}
                      color={getStockColor(item.stock)}
                      size="small"
                    />
                  </Box>
                  <Typography variant="caption" color="textSecondary">
                    Stock: {item.stock} units
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" fullWidth variant="contained" color="primary" onClick={() => handleViewDetails(item)}>
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Inventory Table View */}
      {viewMode === 'table' && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600 }}>Product Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Stock</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ProductImage
                        productName={item.name}
                        alt={item.name}
                        sx={{ 
                          width: 50, 
                          height: 50, 
                          mr: 2, 
                          objectFit: 'cover', 
                          bgcolor: '#f5f5f5', 
                          borderRadius: 1 
                        }}
                      />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" noWrap sx={{ maxWidth: 300 }}>
                          {item.description}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{item.category}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {formatPrice(item.price)}
                    </Typography>
                  </TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStockLabel(item.stock)}
                      color={getStockColor(item.stock)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined" color="primary" onClick={() => handleViewDetails(item)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Product Details Dialog */}
      <Dialog 
        open={detailsOpen} 
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        {selectedItem && (
          <>
            <DialogTitle sx={{ fontWeight: 600, color: '#1a237e' }}>
              {selectedItem.name}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                  <ProductImage
                    productName={selectedItem.name}
                    alt={selectedItem.name}
                    sx={{
                      width: '100%',
                      maxHeight: 400,
                      objectFit: 'cover',
                      bgcolor: '#f5f5f5',
                      borderRadius: 1
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={7}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary' }}>
                      Description
                    </Typography>
                    <Typography variant="body1">
                      {selectedItem.description}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary' }}>
                      Price
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {formatPrice(selectedItem.price)}
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                        Category
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                        {selectedItem.category}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                        Stock Status
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {selectedItem.stock} units
                        </Typography>
                        <Chip
                          label={getStockLabel(selectedItem.stock)}
                          color={getStockColor(selectedItem.stock)}
                          size="small"
                        />
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                      Product ID
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      #{selectedItem.id}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetails} variant="outlined">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Footer Info */}
      <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="caption" color="textSecondary">
          Data Source: Sauce Labs Sample Inventory | Backend API: http://localhost:8004/inventory
        </Typography>
      </Box>
    </Box>
  );
}

export default Inventory;