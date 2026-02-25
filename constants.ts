
import { ReportCategory, ReportStatus } from './types';

export const REPORT_CATEGORIES: ReportCategory[] = [
  ReportCategory.SANITATION,
  ReportCategory.ROADS,
  ReportCategory.LIGHTING,
  ReportCategory.OTHER,
];

export const REPORT_STATUSES: ReportStatus[] = [
  ReportStatus.PENDING,
  ReportStatus.IN_PROGRESS,
  ReportStatus.RESOLVED,
];
