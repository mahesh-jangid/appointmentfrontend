export interface WorkingHours {
  start: string;  // Format: "HH:mm"
  end: string;    // Format: "HH:mm"
}

export interface BreakPeriod {
  start: string;  // Format: "HH:mm"
  end: string;    // Format: "HH:mm"
}

export interface DailySchedule {
  workingHours: WorkingHours;
  breaks: BreakPeriod[];
}

export interface Doctor {
  _id: string;
  name: string;
  schedule: {
    [key: string]: DailySchedule;  // key is day name: "Monday", "Tuesday", etc.
  };
  slotDuration: number;  // in minutes
}