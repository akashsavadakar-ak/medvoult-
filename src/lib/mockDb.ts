
import { generateId } from './utils';

export type Role = 'patient' | 'doctor';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  onboarded: boolean;
  // Role specific fields
  age?: string;
  gender?: string;
  bloodGroup?: string;
  address?: string;
  degree?: string;
  sharingEnabled?: boolean;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  fileURL: string; // Data URL for local demo
  fileName: string;
  type: 'prescription' | 'report';
  createdAt: number;
}

const USERS_KEY = 'medvault_users';
const RECORDS_KEY = 'medvault_records';
const AUTH_KEY = 'medvault_auth';

export const mockDb = {
  // Auth
  getUsers: (): User[] => JSON.parse(localStorage.getItem(USERS_KEY) || '[]'),
  
  saveUser: (user: User) => {
    const users = mockDb.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getUserByEmail: (email: string): User | undefined => {
    return mockDb.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  getUserById: (id: string): User | undefined => {
    return mockDb.getUsers().find(u => u.id === id);
  },

  // Auth State
  getCurrentUser: (): User | null => {
    const userId = localStorage.getItem(AUTH_KEY);
    if (!userId) return null;
    return mockDb.getUserById(userId) || null;
  },

  login: (userId: string) => {
    localStorage.setItem(AUTH_KEY, userId);
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
  },

  // Records
  getRecords: (): MedicalRecord[] => JSON.parse(localStorage.getItem(RECORDS_KEY) || '[]'),

  getRecordsByPatientId: (patientId: string): MedicalRecord[] => {
    return mockDb.getRecords()
      .filter(r => r.patientId === patientId)
      .sort((a, b) => b.createdAt - a.createdAt);
  },

  addRecord: (record: Omit<MedicalRecord, 'id' | 'createdAt'>) => {
    const records = mockDb.getRecords();
    const newRecord: MedicalRecord = {
      ...record,
      id: generateId(),
      createdAt: Date.now(),
    };
    records.push(newRecord);
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
    return newRecord;
  },

  updateUserSharing: (userId: string, enabled: boolean) => {
    const user = mockDb.getUserById(userId);
    if (user) {
      user.sharingEnabled = enabled;
      mockDb.saveUser(user);
    }
  }
};
