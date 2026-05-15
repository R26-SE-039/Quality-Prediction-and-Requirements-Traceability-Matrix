// import React from 'react';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';

// function RTMView() {
//   const sampleRTMData = [
//     { req_id: 'REQ_001', test_id: 'TEST_001', similarity: 0.92, status: 'covered' },
//     { req_id: 'REQ_002', test_id: 'TEST_002', similarity: 0.85, status: 'covered' },
//     { req_id: 'REQ_003', test_id: 'TEST_003', similarity: 0.72, status: 'partial' },
//   ];

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom>
//         Requirements Traceability Matrix
//       </Typography>

//       <Card>
//         <CardContent>
//           <Typography variant="h6" gutterBottom>
//             RTM Links
//           </Typography>
          
//           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//             <thead>
//               <tr style={{ borderBottom: '2px solid #ddd' }}>
//                 <th style={{ padding: '12px', textAlign: 'left' }}>Requirement ID</th>
//                 <th style={{ padding: '12px', textAlign: 'left' }}>Test Case ID</th>
//                 <th style={{ padding: '12px', textAlign: 'left' }}>Similarity</th>
//                 <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {sampleRTMData.map((link, index) => (
//                 <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
//                   <td style={{ padding: '12px' }}>{link.req_id}</td>
//                   <td style={{ padding: '12px' }}>{link.test_id}</td>
//                   <td style={{ padding: '12px' }}>{(link.similarity * 100).toFixed(1)}%</td>
//                   <td style={{ padding: '12px' }}>
//                     <span style={{
//                       padding: '4px 8px',
//                       borderRadius: '4px',
//                       backgroundColor: link.status === 'covered' ? '#e8f5e9' : '#fff3e0',
//                       color: link.status === 'covered' ? '#2e7d32' : '#ef6c00'
//                     }}>
//                       {link.status.toUpperCase()}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <Typography variant="body2" color="textSecondary" sx={{ mt: 3 }}>
//             Note: This is a sample view. Connect to backend API for live RTM data.
//           </Typography>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// }

// export default RTMView;



import React, { useState, useRef } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import LinkIcon from '@mui/icons-material/Link';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function RTMView() {
  const [rtmData] = useState([
    { req_id: 'REQ_001', test_id: 'TEST_001', test_description: 'User login with valid credentials - verifies successful authentication', similarity: 0.92, status: 'covered', priority: 'high' },
    { req_id: 'REQ_002', test_id: 'TEST_002', test_description: 'Payment processing with credit card validation and transaction logging', similarity: 0.85, status: 'covered', priority: 'medium' },
    { req_id: 'REQ_003', test_id: 'TEST_003', test_description: 'Product search functionality with filtering and sorting options', similarity: 0.72, status: 'partial', priority: 'high' },
    { req_id: 'REQ_004', test_id: 'TEST_004', test_description: 'Shopping cart operations - add, remove, and update item quantities', similarity: 0.45, status: 'uncovered', priority: 'critical' },
    { req_id: 'REQ_005', test_id: 'TEST_005', test_description: 'Order history retrieval with date filtering and invoice download', similarity: 0.88, status: 'covered', priority: 'low' },
  ]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'covered': return { bg: '#e8f5e9', color: '#2e7d32', label: 'COVERED' };
      case 'partial': return { bg: '#fff3e0', color: '#ef6c00', label: 'PARTIAL' };
      default: return { bg: '#ffebee', color: '#c62828', label: 'UNCOVERED' };
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'critical': return '#f44336';
      case 'high': return '#ff9800';
      case 'medium': return '#2196f3';
      default: return '#9e9e9e';
    }
  };

  const stats = {
    total: rtmData.length,
    covered: rtmData.filter(r => r.status === 'covered').length,
    partial: rtmData.filter(r => r.status === 'partial').length,
    uncovered: rtmData.filter(r => r.status === 'uncovered').length,
    avgSimilarity: (rtmData.reduce((sum, r) => sum + r.similarity, 0) / rtmData.length * 100).toFixed(1)
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(26, 35, 126);
    doc.text('Requirements Traceability Matrix', pageWidth / 2, 20, { align: 'center' });
    
    // Subtitle
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, pageWidth / 2, 28, { align: 'center' });
    
    // Summary Statistics
    doc.setFontSize(14);
    doc.setTextColor(26, 35, 126);
    doc.text('Coverage Summary', 14, 40);
    
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    const summaryY = 48;
    doc.text(`Total Links: ${stats.total}`, 14, summaryY);
    doc.text(`Covered: ${stats.covered}`, 14, summaryY + 7);
    doc.text(`Partial: ${stats.partial}`, 14, summaryY + 14);
    doc.text(`Uncovered: ${stats.uncovered}`, 14, summaryY + 21);
    doc.text(`Overall Coverage: ${((stats.covered / stats.total) * 100).toFixed(1)}%`, 14, summaryY + 28);
    doc.text(`Average Similarity: ${stats.avgSimilarity}%`, 14, summaryY + 35);
    
    // Coverage Progress Bar (visual representation)
    const coveragePercent = (stats.covered / stats.total) * 100;
    doc.setFillColor(224, 224, 224);
    doc.rect(14, summaryY + 42, 180, 8, 'F');
    doc.setFillColor(76, 175, 80);
    doc.rect(14, summaryY + 42, (coveragePercent / 100) * 180, 8, 'F');
    
    // RTM Table
    const tableColumn = ['Requirement ID', 'Test Case ID', 'Test Description', 'Similarity', 'Priority', 'Status'];
    const tableRows = rtmData.map(link => [
      link.req_id,
      link.test_id,
      link.test_description,
      `${(link.similarity * 100).toFixed(1)}%`,
      link.priority.toUpperCase(),
      link.status.toUpperCase()
    ]);
    
    // Use autoTable with explicit import
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: summaryY + 55,
      theme: 'grid',
      headStyles: {
        fillColor: [26, 35, 126],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        textColor: [50, 50, 50],
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { fontStyle: 'bold', fillColor: [227, 242, 253], textColor: [25, 118, 210] },
        2: { cellWidth: 60, fontSize: 8 },
        3: { fontStyle: 'bold' },
        5: {
          cellWidth: 30,
          fontStyle: 'bold'
        }
      },
      didParseCell: function(data) {
        // Color code status column
        if (data.column.index === 5 && data.section === 'body') {
          const status = data.cell.raw;
          if (status === 'COVERED') {
            data.cell.styles.textColor = [46, 125, 50];
            data.cell.styles.fillColor = [232, 245, 233];
          } else if (status === 'PARTIAL') {
            data.cell.styles.textColor = [239, 108, 0];
            data.cell.styles.fillColor = [255, 243, 224];
          } else if (status === 'UNCOVERED') {
            data.cell.styles.textColor = [198, 40, 40];
            data.cell.styles.fillColor = [255, 235, 238];
          }
        }
        // Color code priority column
        if (data.column.index === 4 && data.section === 'body') {
          const priority = data.cell.raw;
          if (priority === 'CRITICAL') {
            data.cell.styles.textColor = [244, 67, 54];
          } else if (priority === 'HIGH') {
            data.cell.styles.textColor = [255, 152, 0];
          } else if (priority === 'MEDIUM') {
            data.cell.styles.textColor = [33, 150, 243];
          }
        }
      },
      margin: { top: 20, left: 14, right: 14 }
    });
    
    // Footer on each page
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} of ${pageCount} | NextGen QA - RTM Report`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
    
    // Save the PDF
    doc.save(`RTM_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <Box>
      {/* Header with Download Button */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#1a237e' }}>
            Requirements Traceability Matrix
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Visualize and manage test coverage across requirements
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          color="error"
          startIcon={<PictureAsPdfIcon />}
          onClick={downloadPDF}
          size="large"
          sx={{
            boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(244, 67, 54, 0.4)',
            }
          }}
        >
          Download PDF Report
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <CardContent>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Total Links
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {stats.total}
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
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Covered
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {stats.covered}
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
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Partial Coverage
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {stats.partial}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f44336 0%, #e57373 100%)',
            color: 'white',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <CardContent>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Uncovered
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {stats.uncovered}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Coverage Summary */}
      <Card sx={{ mb: 4, bgcolor: '#f8f9fa' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AssessmentIcon sx={{ color: '#667eea', mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Coverage Overview
            </Typography>
          </Box>
          <Typography variant="body2" gutterBottom>
            Overall Coverage: {((stats.covered / stats.total) * 100).toFixed(1)}%
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={(stats.covered / stats.total) * 100} 
            sx={{ 
              height: 10, 
              borderRadius: 5,
              bgcolor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#4caf50',
                borderRadius: 5
              }
            }}
          />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Average Similarity Score: <strong>{stats.avgSimilarity}%</strong>
          </Typography>
        </CardContent>
      </Card>

      {/* RTM Table */}
      <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LinkIcon sx={{ color: '#667eea', mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Traceability Matrix
            </Typography>
          </Box>
          
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Requirement ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Test Case ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Test Case Description</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Similarity Score</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Priority</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rtmData.map((link, index) => {
                  const statusStyle = getStatusColor(link.status);
                  return (
                    <TableRow key={index} sx={{ '&:hover': { bgcolor: '#fafafa' } }}>
                      <TableCell>
                        <Chip 
                          label={link.req_id} 
                          size="small"
                          sx={{ 
                            bgcolor: '#e3f2fd',
                            color: '#1976d2',
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="500">
                          {link.test_id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {link.test_description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ minWidth: 100 }}>
                          <Typography variant="body2">
                            {(link.similarity * 100).toFixed(1)}%
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={link.similarity * 100} 
                            sx={{ 
                              height: 6, 
                              borderRadius: 3,
                              bgcolor: '#e0e0e0',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: link.similarity > 0.7 ? '#4caf50' : link.similarity > 0.5 ? '#ff9800' : '#f44336',
                                borderRadius: 3
                              }
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={link.priority.toUpperCase()} 
                          size="small"
                          sx={{ 
                            bgcolor: `${getPriorityColor(link.priority)}20`,
                            color: getPriorityColor(link.priority),
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={statusStyle.label} 
                          size="small"
                          sx={{ 
                            bgcolor: statusStyle.bg,
                            color: statusStyle.color,
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="body2" color="textSecondary" sx={{ mt: 3, fontStyle: 'italic' }}>
            💡 Tip: Click on any row to view detailed traceability information
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default RTMView;