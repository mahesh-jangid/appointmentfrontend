import { useState, type ChangeEvent } from 'react';
import {
  TextField,
  Button,
  Alert,
  CircularProgress,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import type { Dayjs } from 'dayjs';

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

interface AppointmentFormProps {
  doctor: Doctor;
}

interface TimeSlot {
  start: string;
  end: string;
}

const AppointmentForm = ({ doctor }: AppointmentFormProps) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [patientName, setPatientName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchAvailableSlots = async (date: Dayjs) => {
    try {
      setLoading(true);
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/doctors/available-slots?doctorId=${doctor._id}&date=${date.format('YYYY-MM-DD')}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch available slots');
      }
      const data = await response.json();
      setAvailableSlots(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    if (date) {
      fetchAvailableSlots(date);
    } else {
      setAvailableSlots([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !selectedDate) return;

    try {
      setLoading(true);
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/appointments`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId: doctor._id,
          patientName,
          date: selectedDate.format('YYYY-MM-DD'),
          startTime: selectedSlot.start,
          endTime: selectedSlot.end,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.suggestedSlot) {
          setError(
            `Slot already booked. Next available slot: ${data.suggestedSlot.start} - ${data.suggestedSlot.end}`
          );
        } else {
          throw new Error(data.message || 'Failed to book appointment');
        }
        return;
      }

      setSuccessMessage('Appointment booked successfully!');
      setPatientName('');
      setSelectedDate(null);
      setSelectedSlot(null);
      setAvailableSlots([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Stack spacing={3}>
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" onClose={() => setSuccessMessage(null)}>
            {successMessage}
          </Alert>
        )}

        <TextField
          label="Patient Name"
          value={patientName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPatientName(e.target.value)}
          required
          fullWidth
          variant="outlined"
        />

        <DatePicker
          label="Appointment Date"
          value={selectedDate}
          onChange={handleDateChange}
          disablePast
          format="DD/MM/YYYY"
          slotProps={{
            textField: {
              required: true,
              fullWidth: true,
            },
          }}
        />

        {loading ? (
          <Box display="flex" justifyContent="center" py={2}>
            <CircularProgress />
          </Box>
        ) : (
          selectedDate && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Available Slots
              </Typography>
              <Box
                sx={{
                  maxHeight: '250px',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: '#f1f1f1',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#888',
                    borderRadius: '4px',
                    '&:hover': {
                      backgroundColor: '#666',
                    },
                  },
                  p: 1,
                  mb: 1,
                }}
              >
                <ToggleButtonGroup
                  value={selectedSlot ? `${selectedSlot.start}-${selectedSlot.end}` : null}
                  exclusive
                  orientation="vertical"
                  onChange={(_: React.MouseEvent<HTMLElement>, newValue: string | null) => {
                    if (newValue) {
                      const [start, end] = newValue.split('-');
                      setSelectedSlot({ start, end });
                    } else {
                      setSelectedSlot(null);
                    }
                  }}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: 'repeat(2, 1fr)', // 2 columns on mobile
                      sm: 'repeat(3, 1fr)', // 3 columns on tablet
                      md: 'repeat(4, 1fr)', // 4 columns on desktop
                    },
                    gap: 1,
                    width: '100%'
                  }}
                >
                  {availableSlots.map((slot, index) => (
                    <ToggleButton
                      key={index}
                      value={`${slot.start}-${slot.end}`}
                      sx={{
                        p: 1.5,
                        borderRadius: '8px !important',
                        border: '1px solid',
                        borderColor: 'divider',
                        '&.Mui-selected': {
                          bgcolor: 'primary.main',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          },
                        },
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {slot.start} - {slot.end}
                      </Typography>
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>
              {availableSlots.length > 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
                  Scroll to see more time slots
                </Typography>
              )}
            </Box>
          )
        )}

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={!selectedSlot || loading}
          sx={{ mt: 2 }}
        >
          {loading ? 'Booking...' : 'Book Appointment'}
        </Button>
      </Stack>
    </Box>
  );
};

export default AppointmentForm;