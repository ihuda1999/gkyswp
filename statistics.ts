/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LostItem } from '../types';

export interface DashboardStats {
  totalCount: number;
  pendingCount: number;
  custodyCount: number;
  claimedCount: number;
  overdueCount: number;
  claimRate: number; // percentage
  overdueRate: number; // percentage
  todayCount: number;
  highValueCount: number;
}

export interface ChartSegment {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  '电子产品': '#3b82f6', // blue
  '数码配件': '#60a5fa', // light blue
  '箱包证件': '#f59e0b', // amber
  '衣物鞋帽': '#ec4899', // pink
  '美妆日化': '#8b5cf6', // purple
  '日常用品': '#10b981', // emerald
  '贵重珠宝': '#ef4444', // red
  '钥匙钥匙扣': '#14b8a6', // teal
  '其他': '#6b7280' // slate
};

export function calculateDashboardStats(items: LostItem[]): DashboardStats {
  const totalCount = items.length;
  const pendingCount = items.filter(i => i.status === 'pending_claim').length;
  const custodyCount = items.filter(i => i.status === 'custody').length;
  const claimedCount = items.filter(i => i.status === 'claimed').length;
  const overdueCount = items.filter(i => i.status === 'overdue').length;

  const claimRate = totalCount > 0 ? Math.round((claimedCount / totalCount) * 100) : 0;
  const overdueRate = totalCount > 0 ? Math.round((overdueCount / totalCount) * 100) : 0;

  // Items created today (or simulated today 2026-06-30 or current system date)
  const today = new Date('2026-06-30');
  const todayCount = items.filter(i => {
    const itemDate = new Date(i.createdAt);
    return itemDate.getFullYear() === today.getFullYear() &&
           itemDate.getMonth() === today.getMonth() &&
           itemDate.getDate() === today.getDate();
  }).length;

  const highValueCount = items.filter(i => i.isHighValue).length;

  return {
    totalCount,
    pendingCount,
    custodyCount,
    claimedCount,
    overdueCount,
    claimRate,
    overdueRate,
    todayCount,
    highValueCount
  };
}

export function getCategoryDistribution(items: LostItem[]): ChartSegment[] {
  const counts: Record<string, number> = {};
  items.forEach(item => {
    counts[item.category] = (counts[item.category] || 0) + 1;
  });

  const total = items.length;
  if (total === 0) return [];

  return Object.entries(counts).map(([name, count]) => ({
    name,
    count,
    percentage: Math.round((count / total) * 100),
    color: CATEGORY_COLORS[name] || '#6b7280'
  })).sort((a, b) => b.count - a.count);
}

export function getZoneDistribution(items: LostItem[]): ChartSegment[] {
  const counts: Record<string, number> = {};
  items.forEach(item => {
    const zoneName = item.foundLocation.zone.split(' ')[0]; // E.g. "A区"
    counts[zoneName] = (counts[zoneName] || 0) + 1;
  });

  const total = items.length;
  if (total === 0) return [];

  const zoneColors: Record<string, string> = {
    'A区': '#2563eb',
    'B区': '#3b82f6',
    'C区': '#10b981',
    'D区': '#f59e0b',
    '户外露台': '#8b5cf6'
  };

  return Object.entries(counts).map(([name, count]) => ({
    name,
    count,
    percentage: Math.round((count / total) * 100),
    color: zoneColors[name] || '#6b7280'
  })).sort((a, b) => b.count - a.count);
}

export function exportItemsToCSV(items: LostItem[]) {
  // Define CSV headers
  const headers = [
    '物品编号',
    '物品名称',
    '类别',
    '状态',
    '发现时间',
    '发现位置',
    '发现人',
    '是否贵重物品',
    '店长审核状态',
    '失主姓名',
    '失主电话',
    '认领时间'
  ];

  const rows = items.map(item => {
    const statusMap: Record<string, string> = {
      'pending_claim': '待认领',
      'custody': '保管中',
      'claimed': '已领取',
      'overdue': '逾期处理'
    };

    return [
      item.id,
      item.name.replace(/,/g, '，'), // escape comma
      item.category,
      statusMap[item.status] || item.status,
      item.foundTime,
      `"${item.foundLocation.zone} ${item.foundLocation.table}"`,
      item.finderName,
      item.isHighValue ? '是' : '否',
      item.isHighValue ? (item.managerReviewed ? '已审核' : '待审核') : '不适用',
      item.claimant ? item.claimant.name : '',
      item.claimant ? item.claimant.phone : '',
      item.claimant ? item.claimant.claimTime : ''
    ];
  });

  // UTF-8 BOM to prevent Chinese character gibberish in Excel
  const BOM = '\uFEFF';
  const csvContent = BOM + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  
  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  link.setAttribute('download', `顾客遗失物品登记报表_${dateStr}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
