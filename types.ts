export type ViewState = 'HOME' | 'CONTACT' | 'FOLLOWUP' | 'OBJECTIONS' | 'GOALS' | 'DAILY_POST';

export interface UserGoals {
  dailyContacts: number;
  dailyFollowUps: number;
  monthlyIncome: string;
}

export interface DailyProgress {
  contactsMade: number;
  followUpsMade: number;
  lastUpdated: string; // ISO Date string to check for daily reset
}

export const DEFAULT_GOALS: UserGoals = {
  dailyContacts: 5,
  dailyFollowUps: 3,
  monthlyIncome: "1000",
};

export const DEFAULT_PROGRESS: DailyProgress = {
  contactsMade: 0,
  followUpsMade: 0,
  lastUpdated: new Date().toISOString().split('T')[0],
};