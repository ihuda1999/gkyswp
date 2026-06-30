/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ItemStatus = 'pending_claim' | 'custody' | 'claimed' | 'overdue';

export interface LocationInfo {
  zone: string;
  table: string;
}

export interface ClaimantInfo {
  name: string;
  phone: string;
  idCard: string;
  signPhoto: string; // Base64 signature image
  claimTime: string;
}

export interface Log {
  id: string;
  operatorRole: 'manager' | 'leader' | 'receptionist';
  operatorName: string;
  time: string;
  action: string;
  fromStatus: ItemStatus | 'none';
  toStatus: ItemStatus;
  remarks: string;
}

export interface Handover {
  id: string;
  fromRole: 'manager' | 'leader' | 'receptionist';
  toRole: 'manager' | 'leader' | 'receptionist';
  senderName: string;
  receiverName: string;
  time: string;
  remarks: string;
  photo?: string;
}

export interface LostItem {
  id: string; // LF-YYYYMMDD-XXX
  name: string;
  category: string;
  foundTime: string;
  foundLocation: LocationInfo;
  description: string;
  overallPhoto: string; // Image placeholder URL or Base64
  detailPhoto: string;  // Image placeholder URL or Base64
  finderName: string;
  status: ItemStatus;
  isHighValue: boolean; // >= 500 RMB
  managerReviewed?: boolean;
  managerReviewer?: string;
  createdAt: string;
  claimant: ClaimantInfo | null;
  matchedFeatures: string[]; // Minimum 3 items
  logs: Log[];
  handovers: Handover[];
}

export interface SystemNotification {
  id: string;
  title: string;
  content: string;
  time: string;
  isRead: boolean;
  type: 'new_report' | 'handover' | 'claim' | 'overdue_alert';
  itemId: string;
}

export type UserRole = 'manager' | 'leader' | 'receptionist';

export interface UserProfile {
  role: UserRole;
  name: string;
  avatar: string;
}
