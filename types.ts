
export enum ReportCategory {
  SANITATION = 'Sanitation',
  ROADS = 'Roads',
  LIGHTING = 'Lighting',
  OTHER = 'Other',
}

export enum ReportStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
}

export interface Report {
  id: string;
  title: string;
  category: ReportCategory;
  description: string;
  photo?: string; // base64 string
  latitude: number;
  longitude: number;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
  userName: string;
}

export enum UserRole {
  CITIZEN = 'citizen',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type Page = 'home' | 'report' | 'my-reports' | 'admin' | 'login' | 'signup';
