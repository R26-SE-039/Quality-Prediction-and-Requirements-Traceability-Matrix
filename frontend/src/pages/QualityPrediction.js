import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  Paper,
  CircularProgress,
  Chip,
  LinearProgress,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip,
  Divider,
  Fade,
  Grow,
  Zoom,
  Slide,
  keyframes,
  Tabs,
  Tab
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SpeedIcon from '@mui/icons-material/Speed';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoIcon from '@mui/icons-material/Info';
import StarIcon from '@mui/icons-material/Star';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/material/styles';

const API_BASE_URL = '/api';

// Animations
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4);
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
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0px);
  }
`;

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.12)'
  }
}));

const FloatingIcon = styled(Box)(({ theme }) => ({
  animation: `${float} 3s ease-in-out infinite`
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
}));

const ScoreCircle = styled(Box)(({ theme, score }) => ({
  width: 180,
  height: 180,
  borderRadius: '50%',
  background: `conic-gradient(
    ${score >= 70 ? '#4caf50' : score >= 40 ? '#ff9800' : '#f44336'} ${score * 3.6}deg,
    #e0e0e0 ${score * 3.6}deg
  )`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  margin: '0 auto',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: '50%',
    backgroundColor: 'white',
  }
}));

const ScoreContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  textAlign: 'center'
}));

function QualityPrediction() {
  const [testCase, setTestCase] = useState({
    id: 'TEST_001',
    assertion_count: 5,
    has_boundary_values: true,
    has_negative_test: true,
    step_count: 8,
    has_error_handling: true,
    cyclomatic_complexity: 4.5,
    has_setup_teardown: true,
    historical_pass_rate: 0.85
  });

  const [prediction, setPrediction] = useState({
    quality_score: 82.5,
    is_accepted: true,
    sub_scores: {
      assertion_strength: 25,
      code_coverage: 16,
      boundary_testing: 12,
      error_handling: 14,
      mutation_resistance: 15.5
    },
    recommendation: 'This test case demonstrates good quality with strong assertion coverage and comprehensive boundary testing. Consider adding more error handling scenarios to achieve excellent rating.',
    features: {
      assertion_count: 5,
      step_count: 8,
      cyclomatic_complexity: 4.5,
      historical_pass_rate: 0.85
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [animateResults, setAnimateResults] = useState(true);
  const [inputMethod, setInputMethod] = useState(0); // 0 = file upload, 1 = manual
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (response.ok) {
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
      }
    } catch (err) {
      setBackendStatus('offline');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTestCase(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value)
    }));
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setTestCase(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const resetForm = () => {
    setTestCase({
      id: 'TEST_001',
      assertion_count: 5,
      has_boundary_values: true,
      has_negative_test: true,
      step_count: 8,
      has_error_handling: true,
      cyclomatic_complexity: 4.5,
      has_setup_teardown: true,
      historical_pass_rate: 0.85
    });
    setPrediction({
      quality_score: 82.5,
      is_accepted: true,
      sub_scores: {
        assertion_strength: 25,
        code_coverage: 16,
        boundary_testing: 12,
        error_handling: 14,
        mutation_resistance: 15.5
      },
      recommendation: 'This test case demonstrates good quality with strong assertion coverage and comprehensive boundary testing. Consider adding more error handling scenarios to achieve excellent rating.',
      features: {
        assertion_count: 5,
        step_count: 8,
        cyclomatic_complexity: 4.5,
        historical_pass_rate: 0.85
      }
    });
    setError(null);
    setUploadedFileName(null);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileLoading(true);
    setError(null);
    setUploadedFileName(file.name);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/quality/predict-file`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to process file');
      }

      const result = await response.json();
      
      if (result.success) {
        if (result.prediction) {
          setPrediction(result.prediction);
        } else if (result.predictions && result.predictions.length > 0) {
          setPrediction(result.predictions[0]);
        }
        if (result.test_case) {
          setTestCase(result.test_case);
        } else if (result.test_cases && result.test_cases.length > 0) {
          setTestCase(result.test_cases[0]);
        }
        setAnimateResults(false);
        setTimeout(() => setAnimateResults(true), 100);
      } else {
        setError('File processing failed');
      }
    } catch (err) {
      setError(`Failed to process file: ${err.message}`);
      setUploadedFileName(null);
    } finally {
      setFileLoading(false);
    }
  };

  const predictQuality = async () => {
    setLoading(true);
    setError(null);
    setAnimateResults(false);
    
    try {
      console.log('Sending prediction request to:', `${API_BASE_URL}/quality/predict`);
      console.log('Test case data:', testCase);
      
      const response = await fetch(`${API_BASE_URL}/quality/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase)
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to predict quality');
        } else {
          const errorText = await response.text();
          throw new Error(`Server error: ${response.status} - ${errorText}`);
        }
      }

      const result = await response.json();
      console.log('Prediction result:', result);
      
      if (result.success) {
        setPrediction(result.prediction);
        setTimeout(() => setAnimateResults(true), 100);
      } else {
        setError('Prediction failed');
      }
    } catch (err) {
      setError(`Failed to connect to backend: ${err.message}`);
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#4caf50';
    if (score >= 40) return '#ff9800';
    return '#f44336';
  };

  const getScoreLabel = (score) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };

  return (
    <Box sx={{ 
      p: 3, 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    }}>
      {/* Animated Background */}
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
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <Box>
                <GradientText variant="h3" gutterBottom sx={{ fontWeight: 800, mb: 1 }}>
                  Test Quality Prediction
                </GradientText>
                <Typography variant="subtitle1" color="textSecondary">
                  AI-Powered Test Quality Analysis • Machine Learning Predictions
                </Typography>
              </Box>
              <Tooltip title="Refresh Backend Status">
                <IconButton onClick={checkBackendHealth} sx={{ animation: backendStatus === 'online' ? `${pulse} 2s infinite` : 'none' }}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Fade>

        {/* Error Alert */}
        {error && (
          <Slide direction="down" in={true}>
            <Alert 
              severity="error" 
              sx={{ mb: 3 }} 
              onClose={() => setError(null)}
              action={
                <Button color="inherit" size="small" onClick={checkBackendHealth}>
                  Check Connection
                </Button>
              }
            >
              <Typography variant="subtitle2" gutterBottom>
                Connection Error
              </Typography>
              <Typography variant="body2">{error}</Typography>
            </Alert>
          </Slide>
        )}

        <Grid container spacing={3}>
          {/* Input Section */}
          <Grid item xs={12} md={6}>
            <Grow in={true} timeout={800}>
              <StyledCard sx={{ 
                borderRadius: 3,
                backdropFilter: 'blur(10px)',
                bgcolor: 'rgba(255,255,255,0.95)'
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <AssessmentIcon sx={{ mr: 1, color: '#667eea' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a237e' }}>
                      Test Case Input
                    </Typography>
                  </Box>

                  {/* Input Method Tabs */}
                  <Tabs
                    value={inputMethod}
                    onChange={(e, newValue) => setInputMethod(newValue)}
                    centered
                    sx={{ mb: 3 }}
                  >
                    <Tab label="Upload File" icon={<UploadFileIcon />} />
                    <Tab label="Manual Input" icon={<EditIcon />} />
                  </Tabs>

                  {/* File Upload Tab */}
                  {inputMethod === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <input
                        accept=".json,.csv,.xlsx,.xls"
                        style={{ display: 'none' }}
                        id="test-case-file"
                        type="file"
                        onChange={handleFileUpload}
                      />
                      <label htmlFor="test-case-file">
                        <Button
                          variant="contained"
                          component="span"
                          size="large"
                          disabled={fileLoading}
                          startIcon={fileLoading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                          sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '1rem',
                            px: 4,
                            py: 1.5,
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 5px 15px rgba(102,126,234,0.4)'
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {fileLoading ? 'Processing File...' : 'Upload Test Case'}
                        </Button>
                      </label>
                      
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          Supported formats: JSON, CSV, Excel
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          File should contain: assertion_count, step_count, cyclomatic_complexity, historical_pass_rate, has_boundary_values, has_negative_test, has_error_handling, has_setup_teardown
                        </Typography>
                      </Box>

                      {uploadedFileName && (
                        <Fade in={true}>
                          <Paper sx={{ mt: 2, p: 2, bgcolor: '#e8f5e9', borderRadius: 2 }}>
                            <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                              ✓ Uploaded: {uploadedFileName}
                            </Typography>
                          </Paper>
                        </Fade>
                      )}
                    </Box>
                  )}

                  {/* Manual Input Tab */}
                  {inputMethod === 1 && (

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Test ID"
                        name="id"
                        value={testCase.id}
                        onChange={handleInputChange}
                        size="small"
                        variant="outlined"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Assertion Count"
                        name="assertion_count"
                        value={testCase.assertion_count}
                        onChange={handleInputChange}
                        size="small"
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Step Count"
                        name="step_count"
                        value={testCase.step_count}
                        onChange={handleInputChange}
                        size="small"
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Cyclomatic Complexity"
                        name="cyclomatic_complexity"
                        value={testCase.cyclomatic_complexity}
                        onChange={handleInputChange}
                        size="small"
                        inputProps={{ step: 0.1, min: 0 }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Historical Pass Rate"
                        name="historical_pass_rate"
                        value={testCase.historical_pass_rate}
                        onChange={handleInputChange}
                        size="small"
                        inputProps={{ step: 0.01, min: 0, max: 1 }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }}>
                        <Chip label="Quality Indicators" size="small" />
                      </Divider>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 1, bgcolor: '#f8f9fa' }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={testCase.has_boundary_values}
                              onChange={handleSwitchChange}
                              name="has_boundary_values"
                              color="primary"
                            />
                          }
                          label="Boundary Values"
                        />
                      </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 1, bgcolor: '#f8f9fa' }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={testCase.has_negative_test}
                              onChange={handleSwitchChange}
                              name="has_negative_test"
                              color="primary"
                            />
                          }
                          label="Negative Testing"
                        />
                      </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 1, bgcolor: '#f8f9fa' }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={testCase.has_error_handling}
                              onChange={handleSwitchChange}
                              name="has_error_handling"
                              color="primary"
                            />
                          }
                          label="Error Handling"
                        />
                      </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Paper sx={{ p: 1, bgcolor: '#f8f9fa' }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={testCase.has_setup_teardown}
                              onChange={handleSwitchChange}
                              name="has_setup_teardown"
                              color="primary"
                            />
                          }
                          label="Setup/Teardown"
                        />
                      </Paper>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button
                          variant="contained"
                          onClick={predictQuality}
                          disabled={loading || backendStatus === 'offline'}
                          fullWidth
                          size="large"
                          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
                          sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '1rem',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 5px 15px rgba(102,126,234,0.4)'
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {loading ? 'Analyzing Test Case...' : 'Predict Quality'}
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={resetForm}
                          size="large"
                          sx={{ borderRadius: 2, textTransform: 'none' }}
                        >
                          Reset
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                  )}
                </CardContent>
              </StyledCard>
            </Grow>
          </Grid>

          {/* Results */}
          <Grid item xs={12} md={6}>
            {loading && (
              <Fade in={true}>
                <Card sx={{ 
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
                      <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        Analyzing Test Quality
                      </Typography>
                      <Typography variant="body2" align="center" sx={{ opacity: 0.9 }}>
                        Our ML model is processing your test case features
                      </Typography>
                      <Box sx={{ mt: 3, width: '100%' }}>
                        <LinearProgress sx={{ bgcolor: 'rgba(255,255,255,0.2)', '& .MuiLinearProgress-bar': { bgcolor: 'white' } }} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            )}

            {!loading && prediction && (
              <Zoom in={animateResults} timeout={500}>
                <Card sx={{ 
                  borderRadius: 3,
                  backdropFilter: 'blur(10px)',
                  bgcolor: 'rgba(255,255,255,0.95)',
                  overflow: 'visible'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <FloatingIcon>
                        <AssessmentIcon sx={{ mr: 1, color: '#667eea', fontSize: 32 }} />
                      </FloatingIcon>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a237e' }}>
                        Quality Prediction Results
                      </Typography>
                    </Box>

                    {/* Main Score with Circular Gauge */}
                    <Box sx={{ mb: 4 }}>
                      <ScoreCircle score={prediction.quality_score}>
                        <ScoreContent>
                          <Typography variant="h2" sx={{ 
                            fontWeight: 'bold',
                            color: getScoreColor(prediction.quality_score),
                            fontSize: '3rem'
                          }}>
                            {prediction.quality_score}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Quality Score
                          </Typography>
                          <Chip
                            size="small"
                            label={getScoreLabel(prediction.quality_score)}
                            sx={{ 
                              mt: 1,
                              bgcolor: getScoreColor(prediction.quality_score) + '20',
                              color: getScoreColor(prediction.quality_score),
                              fontWeight: 'bold'
                            }}
                          />
                        </ScoreContent>
                      </ScoreCircle>
                    </Box>

                    {/* Decision Chip */}
                    <Grow in={true} timeout={800}>
                      <Paper 
                        sx={{ 
                          p: 2, 
                          mb: 3, 
                          bgcolor: prediction.is_accepted ? '#e8f5e9' : '#ffebee',
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {prediction.is_accepted ? (
                            <ThumbUpIcon sx={{ color: '#4caf50' }} />
                          ) : (
                            <ThumbDownIcon sx={{ color: '#f44336' }} />
                          )}
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Decision: {prediction.is_accepted ? 'ACCEPTED' : 'REJECTED'}
                          </Typography>
                        </Box>
                        <Chip
                          icon={prediction.is_accepted ? <CheckCircleIcon /> : <WarningIcon />}
                          label={prediction.is_accepted ? 'Pass' : 'Fail'}
                          color={prediction.is_accepted ? 'success' : 'error'}
                          size="small"
                        />
                      </Paper>
                    </Grow>

                    {/* Sub-Scores */}
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2, color: '#1a237e' }}>
                      Detailed Metrics
                    </Typography>
                    
                    {Object.entries(prediction.sub_scores).map(([key, value], idx) => {
                      const maxValue = key === 'assertion_strength' ? 30 : 
                                      key === 'code_coverage' ? 20 :
                                      key === 'boundary_testing' ? 15 :
                                      key === 'error_handling' ? 15 : 20;
                      const percentage = (value / maxValue) * 100;
                      const scoreColor = percentage >= 70 ? '#4caf50' : percentage >= 40 ? '#ff9800' : '#f44336';
                      
                      return (
                        <Grow in={true} timeout={500 + idx * 100} key={key}>
                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2" sx={{ textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {key.replace(/_/g, ' ')}
                                <Tooltip title={`Score: ${value}/${maxValue}`}>
                                  <InfoIcon sx={{ fontSize: 14, color: '#999' }} />
                                </Tooltip>
                              </Typography>
                              <Typography variant="body2" fontWeight="bold" sx={{ color: scoreColor }}>
                                {value} / {maxValue}
                              </Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={percentage} 
                              sx={{ 
                                height: 10, 
                                borderRadius: 5,
                                bgcolor: '#e0e0e0',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: scoreColor,
                                  borderRadius: 5,
                                  transition: 'transform 1s ease-in-out'
                                }
                              }}
                            />
                          </Box>
                        </Grow>
                      );
                    })}

                    {/* Recommendation */}
                    <Fade in={true} timeout={1000}>
                      <Alert 
                        severity={prediction.is_accepted ? 'success' : 'warning'}
                        sx={{ mt: 3, borderRadius: 2 }}
                        icon={prediction.is_accepted ? <TrendingUpIcon /> : <WarningIcon />}
                      >
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                          AI Recommendation:
                        </Typography>
                        <Typography variant="body2">
                          {prediction.recommendation}
                        </Typography>
                      </Alert>
                    </Fade>

                    {/* Features Used */}
                    <Fade in={true} timeout={1200}>
                      <Paper sx={{ p: 2, mt: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SpeedIcon sx={{ fontSize: 16 }} />
                          Analyzed Features
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="textSecondary">
                              Assertions: <strong>{prediction.features.assertion_count}</strong>
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="textSecondary">
                              Steps: <strong>{prediction.features.step_count}</strong>
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="textSecondary">
                              Complexity: <strong>{prediction.features.cyclomatic_complexity}</strong>
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="textSecondary">
                              Pass Rate: <strong>{(prediction.features.historical_pass_rate * 100).toFixed(0)}%</strong>
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Fade>

                    {/* Rating Stars */}
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i} 
                          sx={{ 
                            color: i < Math.floor(prediction.quality_score / 20) ? '#ffc107' : '#e0e0e0',
                            fontSize: 20
                          }} 
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Zoom>
            )}

            {!loading && !prediction && !error && (
              <Fade in={true}>
                <Card sx={{ 
                  borderRadius: 3,
                  bgcolor: 'rgba(255,255,255,0.95)',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 400
                }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <FloatingIcon>
                      <AssessmentIcon sx={{ fontSize: 80, color: '#667eea', mb: 2, opacity: 0.5 }} />
                    </FloatingIcon>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      Ready to Analyze
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Fill in the test case details and click "Predict Quality" to get AI-powered analysis
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default QualityPrediction;