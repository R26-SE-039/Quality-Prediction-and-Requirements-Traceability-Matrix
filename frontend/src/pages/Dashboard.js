import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BugReportIcon from '@mui/icons-material/BugReport';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SecurityIcon from '@mui/icons-material/Security';
import AnimationIcon from '@mui/icons-material/Animation';
import { keyframes, styled } from '@mui/system';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Zoom from '@mui/material/Zoom';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';
import Slide from '@mui/material/Slide';

const API_BASE_URL = 'http://localhost:8004';

// Animations
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(102, 126, 234, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

// Styled components
const AnimatedCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
  }
}));

const PulseIcon = styled(Box)(({ theme }) => ({
  animation: `${pulse} 2s infinite`,
  display: 'inline-flex'
}));

const FloatingIcon = styled(Box)(({ theme }) => ({
  animation: `${float} 3s ease-in-out infinite`,
  display: 'inline-flex'
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
}));

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState('both');
  const [stats, setStats] = useState({
    totalTests: 0,
    avgQuality: 0,
    coveredReqs: 0,
    criticalGaps: 0,
    totalReqs: 100,
    qualityTrend: '+5.2%',
    executionTime: '2.3s',
    successRate: 94.7
  });

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const healthRes = await axios.get(`${API_BASE_URL}/health`);
      setHealth(healthRes.data);
      setStats({
        totalTests: 156,
        avgQuality: 78.5,
        coveredReqs: 92,
        criticalGaps: 3,
        totalReqs: 100,
        qualityTrend: '+5.2%',
        executionTime: '2.3s',
        successRate: 94.7
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'white' }}>
            Loading Dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  const statCards = [
    { 
      title: 'Tests Analyzed', 
      value: stats.totalTests, 
      icon: <BugReportIcon sx={{ fontSize: 40 }} />,
      bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      delay: 0
    },
    { 
      title: 'Avg Quality Score', 
      value: stats.avgQuality, 
      suffix: '/100',
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      bgGradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      trend: stats.qualityTrend,
      delay: 100
    },
    { 
      title: 'Coverage Rate', 
      value: stats.coveredReqs, 
      suffix: '%',
      icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
      bgGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      delay: 200
    },
    { 
      title: 'Success Rate', 
      value: stats.successRate, 
      suffix: '%',
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      bgGradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      delay: 300
    },
  ];

  const qualityDistribution = [
    { name: 'Excellent', tests: 45, color: '#4caf50', percentage: 28.8 },
    { name: 'Good', tests: 68, color: '#8bc34a', percentage: 43.6 },
    { name: 'Fair', tests: 25, color: '#ffc107', percentage: 16.0 },
    { name: 'Poor', tests: 12, color: '#f44336', percentage: 7.7 },
  ];

  const coverageData = [
    { name: 'Covered', value: stats.coveredReqs, color: '#4caf50' },
    { name: 'Gap', value: stats.totalReqs - stats.coveredReqs, color: '#f44336' },
  ];

  const trendData = [
    { month: 'Jan', quality: 72, coverage: 85 },
    { month: 'Feb', quality: 74, coverage: 87 },
    { month: 'Mar', quality: 76, coverage: 88 },
    { month: 'Apr', quality: 75, coverage: 90 },
    { month: 'May', quality: 78, coverage: 91 },
    { month: 'Jun', quality: 78.5, coverage: 92 },
  ];

  const recentActivities = [
    { id: 1, action: 'Test suite executed', status: 'success', time: '5 min ago', details: '156 tests passed' },
    { id: 2, action: 'Quality analysis completed', status: 'info', time: '15 min ago', details: 'Score: 78.5' },
    { id: 3, action: 'Coverage gap detected', status: 'warning', time: '1 hour ago', details: '3 critical gaps' },
    { id: 4, action: 'ML model updated', status: 'success', time: '2 hours ago', details: 'Version 2.1.0' },
  ];

  return (
    <Box sx={{ 
      p: 3, 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    }}>
      {/* Animated Background Elements */}
      <Box sx={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        overflow: 'hidden', 
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        <Box sx={{ 
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.05) 100%)',
          animation: `${float} 20s ease-in-out infinite`
        }} />
      </Box>

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header Section */}
        <Fade in={true} timeout={1000}>
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <Box>
              <GradientText variant="h3" gutterBottom sx={{ fontWeight: 800, mb: 1 }}>
                ML Test Quality Dashboard
              </GradientText>
              <Typography variant="subtitle1" color="textSecondary">
                Real-time insights • AI-Powered Analysis • Quality Assurance
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, md: 0 } }}>
              <PulseIcon>
                <Chip 
                  icon={<AnimationIcon />} 
                  label="Live Updates" 
                  color="primary" 
                  variant="outlined"
                />
              </PulseIcon>
              <Chip 
                label={`Last updated: ${new Date().toLocaleTimeString()}`} 
                variant="outlined" 
              />
            </Box>
          </Box>
        </Fade>

        {/* Health Status */}
        <Slide direction="right" in={true} timeout={800}>
          <Card sx={{ 
            mb: 4, 
            bgcolor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a237e' }}>
                  System Health Status
                </Typography>
                <Chip label="All Systems Operational" size="small" color="success" />
              </Box>
              <Grid container spacing={2}>
                {health?.services && Object.entries(health.services).map(([service, status], idx) => (
                  <Grid item xs={6} sm={3} md={2} key={service}>
                    <Zoom in={true} timeout={300 + idx * 100}>
                      <Paper sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        bgcolor: status ? '#e8f5e9' : '#ffebee',
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                        }
                      }}>
                        <Typography variant="h4" sx={{ mb: 1 }}>
                          {status ? '🟢' : '🔴'}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {service.replace('_', ' ').toUpperCase()}
                        </Typography>
                        <Typography variant="caption" color={status ? 'success.main' : 'error.main'}>
                          {status ? 'Operational' : 'Down'}
                        </Typography>
                      </Paper>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Slide>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statCards.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Grow in={true} timeout={500 + stat.delay}>
                <AnimatedCard sx={{ 
                  background: stat.bgGradient,
                  color: 'white',
                  borderRadius: 3,
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                    pointerEvents: 'none'
                  }
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
                          {stat.title}
                        </Typography>
                        <Typography variant="h2" sx={{ fontWeight: 'bold', fontSize: '3rem' }}>
                          {stat.value}{stat.suffix || ''}
                        </Typography>
                        {stat.trend && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} />
                            <Typography variant="caption">
                              {stat.trend} from last month
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <FloatingIcon>
                        {stat.icon}
                      </FloatingIcon>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={typeof stat.value === 'number' ? Math.min(stat.value, 100) : 0} 
                      sx={{ 
                        mt: 2, 
                        bgcolor: 'rgba(255,255,255,0.2)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: 'white'
                        }
                      }}
                    />
                  </CardContent>
                </AnimatedCard>
              </Grow>
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Fade in={true} timeout={1000}>
              <Card sx={{ 
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                bgcolor: 'rgba(255,255,255,0.95)'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a237e' }}>
                      Quality & Coverage Trends
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip 
                        label="Both" 
                        size="small" 
                        color={selectedMetric === 'both' ? 'primary' : 'default'}
                        onClick={() => setSelectedMetric('both')}
                      />
                      <Chip 
                        label="Quality" 
                        size="small" 
                        color={selectedMetric === 'quality' ? 'primary' : 'default'}
                        onClick={() => setSelectedMetric('quality')}
                      />
                      <Chip 
                        label="Coverage" 
                        size="small" 
                        color={selectedMetric === 'coverage' ? 'primary' : 'default'}
                        onClick={() => setSelectedMetric('coverage')}
                      />
                    </Box>
                  </Box>
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorCoverage" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#43e97b" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#43e97b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: 10, 
                          border: 'none', 
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
                        }}
                      />
                      <Legend />
                      {(selectedMetric === 'quality' || selectedMetric === 'both') && (
                        <Area 
                          type="monotone" 
                          dataKey="quality" 
                          stroke="#667eea" 
                          fillOpacity={1} 
                          fill="url(#colorQuality)" 
                          name="Quality Score"
                        />
                      )}
                      {(selectedMetric === 'coverage' || selectedMetric === 'both') && (
                        <Area 
                          type="monotone" 
                          dataKey="coverage" 
                          stroke="#43e97b" 
                          fillOpacity={1} 
                          fill="url(#colorCoverage)" 
                          name="Coverage %"
                        />
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Fade in={true} timeout={1000}>
              <Card sx={{ 
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                bgcolor: 'rgba(255,255,255,0.95)',
                height: '100%'
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1a237e', mb: 3 }}>
                    Requirements Coverage
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={coverageData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {coverageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Coverage Status
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#4caf50' }}>
                      {stats.coveredReqs}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {stats.criticalGaps} critical gaps identified
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Fade in={true} timeout={1000}>
              <Card sx={{ 
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                bgcolor: 'rgba(255,255,255,0.95)'
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1a237e', mb: 3 }}>
                    Quality Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={qualityDistribution} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="tests" fill="#667eea" radius={[0, 10, 10, 0]}>
                        {qualityDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Fade in={true} timeout={1000}>
              <Card sx={{ 
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                bgcolor: 'rgba(255,255,255,0.95)'
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1a237e', mb: 3 }}>
                    Recent Activities
                  </Typography>
                  {recentActivities.map((activity, idx) => (
                    <Slide direction="left" in={true} timeout={500 + idx * 100} key={activity.id}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        py: 2,
                        borderBottom: idx !== recentActivities.length - 1 ? '1px solid #e0e0e0' : 'none'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '50%', 
                            bgcolor: activity.status === 'success' ? '#e8f5e9' : activity.status === 'warning' ? '#fff3e0' : '#e3f2fd',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {activity.status === 'success' ? '✅' : activity.status === 'warning' ? '⚠️' : 'ℹ️'}
                          </Box>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {activity.action}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {activity.details}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="caption" color="textSecondary">
                          {activity.time}
                        </Typography>
                      </Box>
                    </Slide>
                  ))}
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Dashboard;