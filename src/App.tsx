import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  CssBaseline,
  Container,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import DoctorList from './components/DoctorList';
import PersonIcon from '@mui/icons-material/Person';
import AppointmentForm from "./components/AppointmentForm";
import './App.css';

interface Doctor {
  _id: string;
  name: string;
  workingDays: string[];
  workingHours: {
    start: string;
    end: string;
  };
  slotDuration: number;
  breaks: {
    day: string;
    start: string;
    end: string;
  }[];
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <Container 
          maxWidth={false} 
          sx={{ 
            maxWidth: '1400px',
            px: { xs: 2, sm: 3, md: 4 } 
          }}
        >
          <Box sx={{ py: 4 }}>
            <Typography
              variant="h3"
              component="h1"
              align="center"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                mb: 6
              }}
            >
              Appointment Scheduler
            </Typography>

            <Box
              sx={{
                maxWidth: '1200px',
                mx: 'auto',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 4
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  flex: 1,
                  backgroundColor: 'background.paper',
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: 6,
                  }
                }}
              >
                <Box
                  sx={{
                    p: 3,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText'
                  }}
                >
                  <Typography variant="h5" component="h2" fontWeight="500">
                    Select a Doctor
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 3,
                    height: '400px',
                    overflowY: 'auto'
                  }}
                >
                  <DoctorList onSelectDoctor={setSelectedDoctor} />
                </Box>
              </Paper>
              
              <Paper
                elevation={3}
                sx={{
                  flex: 1,
                  backgroundColor: 'background.paper',
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: 6,
                  }
                }}
              >
                <Box
                  sx={{
                    p: 3,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText'
                  }}
                >
                  <Typography variant="h5" component="h2" fontWeight="500">
                    Book Appointment
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 3,
                    height: '400px',
                    overflowY: 'auto'
                  }}
                >
                  {selectedDoctor ? (
                    <AppointmentForm doctor={selectedDoctor} />
                  ) : (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      height="100%"
                    >
                      <Typography
                        color="text.secondary"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <PersonIcon /> Please select a doctor first
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Box>
          </Box>
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
