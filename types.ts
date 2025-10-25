
export enum ClaimStatus {
  Pending = 'قيد المراجعة',
  Approved = 'مقبول',
  Rejected = 'مرفوض',
  RevisionNeeded = 'يحتاج تعديل',
  Invoiced = 'تمت الفوترة',
}

export enum TicketStatus {
  Open = 'مفتوحة',
  InProgress = 'تحت الإجراء',
  Solved = 'تم الحل',
}

export enum TicketPriority {
  Normal = 'عادي',
  Urgent = 'عاجل',
}

export interface Comment {
  author: string;
  text: string;
  timestamp: Date;
}

export interface WarrantyClaim {
  id: string;
  vehicleVIN: string;
  branch: string;
  issue: string;
  technicalReport: string;
  photos: File[];
  videos: File[];
  status: ClaimStatus;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
}

export interface SupportTicket {
  id: string;
  branch: string;
  issue: string;
  technicalReport: string;
  photos: File[];
  videos: File[];
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  comments: Comment[];
}

export type ViewType = 'warranty' | 'support' | 'analytics';
