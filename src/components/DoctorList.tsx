import { useState, useEffect } from 'react';
import {
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  Typography,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

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

interface DoctorListProps {
  onSelectDoctor: (doctor: Doctor) => void;
}

const DoctorList = ({ onSelectDoctor }: DoctorListProps) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/doctors`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
        const data = await response.json();
        setDoctors(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedId(doctor._id);
    onSelectDoctor(doctor);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        icon={<ErrorIcon />}
        sx={{ mt: 2 }}
      >
        {error}
      </Alert>
    );
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {doctors.map((doctor, index) => (
        <Box key={doctor._id} sx={{ mb: index < doctors.length - 1 ? 2 : 0 }}>
          <Paper
            elevation={selectedId === doctor._id ? 3 : 1}
            sx={{
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4,
              },
            }}
          >
            <ListItemButton
              selected={selectedId === doctor._id}
              onClick={() => handleSelectDoctor(doctor)}
              sx={{
                borderRadius: 1,
                p: 2,
                '&.Mui-selected': {
                  backgroundColor: 'primary.soft',
                  '&:hover': {
                    backgroundColor: 'primary.soft',
                  },
                },
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: selectedId === doctor._id ? 'primary.main' : 'primary.light',
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  <PersonIcon sx={{ fontSize: 32 }} />
                </Avatar>
              </ListItemAvatar>
              <Box sx={{ ml: 2, flex: 1 }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontWeight: 500,
                    color: selectedId === doctor._id ? 'primary.main' : 'text.primary',
                    transition: 'color 0.3s ease-in-out'
                  }}
                >
                  {doctor.name}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1
                    }}
                  >
                    <ScheduleIcon sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />
                    {doctor.workingHours.start} - {doctor.workingHours.end}
                  </Typography>
                  <Box sx={{
                    display: 'flex',
                    gap: 0.5,
                    flexWrap: 'wrap'
                  }}>
                    {doctor.workingDays.map((day) => (
                      <Chip
                        key={day}
                        label={day.substring(0, 3)}
                        size="small"
                        color={selectedId === doctor._id ? "primary" : "default"}
                        variant={selectedId === doctor._id ? "filled" : "outlined"}
                        sx={{
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            </ListItemButton>
          </Paper>
        </Box>
      ))}
    </List>
  );
};

export default DoctorList;