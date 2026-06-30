/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LostItem, SystemNotification } from './types';

export const ITEM_CATEGORIES = [
  '电子产品',
  '数码配件',
  '箱包证件',
  '衣物鞋帽',
  '美妆日化',
  '日常用品',
  '贵重珠宝',
  '钥匙钥匙扣',
  '其他'
];

export const STORE_ZONES = [
  'B区',
  '1楼',
  '2楼',
  '3楼',
  '臻选包间',
  '新区',
  '露台北',
  '露台南'
];

export const ZONE_TABLES: Record<string, string[]> = {
  'B区': ['B01', 'B02', 'B03', 'B05', 'B06', 'B07', 'B08', 'B09', 'B10', 'B11', '立春', '惊蛰', '春风', '谷雨', '立夏', '小满', '芒种', '夏至', '白露', '秋分', '霜降', '立冬', '立秋', '冬至', '小雪', '大雪'],
  '1楼': [
    '101', '102', '103', '105', '106', '107', '116', '117', '118', '119',
    ...Array.from({length: 31}, (_, i) => `${201 + i}`).filter(t => !['204', '214', '224'].includes(t))
  ],
  '2楼': [],
  '3楼': [
    ...Array.from({length: 41}, (_, i) => `${301 + i}`).filter(t => !['304', '314', '324', '334'].includes(t))
  ],
  '臻选包间': [],
  '新区': ['子夜', '凤鸣', '黎明', '破晓', '朝食', '隅中', '日正', '日央', '日入', '日夕', '夕食', '人定'],
  '露台北': [
    ...Array.from({length: 21}, (_, i) => `${801 + i}`).filter(t => !['804', '814'].includes(t))
  ],
  '露台南': [
    ...Array.from({length: 28}, (_, i) => `${701 + i}`).filter(t => !['704', '714', '724'].includes(t))
  ]
};

// Presets for demo photos
export const PHOTO_PRESETS = [
  {
    name: '手机/数码',
    overall: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop&q=60',
    detail: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400&auto=format&fit=crop&q=60'
  },
  {
    name: '皮包/钱包',
    overall: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&auto=format&fit=crop&q=60',
    detail: 'https://images.unsplash.com/photo-1627124718133-cb412dd7d863?w=400&auto=format&fit=crop&q=60'
  },
  {
    name: '钥匙/挂饰',
    overall: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&auto=format&fit=crop&q=60',
    detail: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&auto=format&fit=crop&q=60'
  },
  {
    name: '伞具/日常',
    overall: 'https://images.unsplash.com/photo-1532296113170-e5b97de55125?w=400&auto=format&fit=crop&q=60',
    detail: 'https://images.unsplash.com/photo-1521193089946-7aa29d1fe73a?w=400&auto=format&fit=crop&q=60'
  },
  {
    name: '首饰/珠宝',
    overall: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&auto=format&fit=crop&q=60',
    detail: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&auto=format&fit=crop&q=60'
  },
  {
    name: '衣服/外套',
    overall: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&auto=format&fit=crop&q=60',
    detail: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=400&auto=format&fit=crop&q=60'
  }
];

export const INITIAL_LOST_ITEMS: LostItem[] = [
  {
    id: 'LF-20260628-001',
    name: '华为 Mate XT 三折叠手机',
    category: '电子产品',
    foundTime: '2026-06-28 19:30',
    foundLocation: { zone: 'C区 (景观包厢)', table: 'C06' },
    description: '红色素皮版本三折叠，屏幕折痕完好，装有深蓝色原装保护壳，锁屏壁纸是一张猫咪照片。',
    overallPhoto: PHOTO_PRESETS[0].overall,
    detailPhoto: PHOTO_PRESETS[0].detail,
    finderName: '李管理员 (管理员)',
    status: 'custody',
    isHighValue: true,
    managerReviewed: true,
    managerReviewer: '李店长',
    createdAt: '2026-06-28T19:45:00.000Z',
    claimant: null,
    matchedFeatures: [],
    logs: [
      {
        id: 'L-001',
        operatorRole: 'manager',
        operatorName: '李管理员',
        time: '2026-06-28 19:45',
        action: '登记上报',
        fromStatus: 'none',
        toStatus: 'pending_claim',
        remarks: '在清台时发现遗留在沙发夹缝中，金额极高，已开启双人核验。'
      },
      {
        id: 'L-002',
        operatorRole: 'manager',
        operatorName: '李店长',
        time: '2026-06-28 20:00',
        action: '店长复核',
        fromStatus: 'pending_claim',
        toStatus: 'pending_claim',
        remarks: '确认为贵重物品，店长李明已复核并批准入库，放入前台防盗保险箱。'
      },
      {
        id: 'L-003',
        operatorRole: 'leader',
        operatorName: '张领班',
        time: '2026-06-28 20:10',
        action: '交接确认',
        fromStatus: 'pending_claim',
        toStatus: 'custody',
        remarks: '服务员交接至前台保管，已存入保险柜。'
      }
    ],
    handovers: [
      {
        id: 'H-001',
        fromRole: 'leader',
        toRole: 'leader',
        senderName: '王小明',
        receiverName: '张领班',
        time: '2026-06-28 20:05',
        remarks: '已当面点清手机及外壳，无明显外观划伤。'
      },
      {
        id: 'H-002',
        fromRole: 'leader',
        toRole: 'receptionist',
        senderName: '张领班',
        receiverName: '赵前台',
        time: '2026-06-28 20:10',
        remarks: '手机锁屏完好，已放入1号贵重物品保险箱。'
      }
    ]
  },
  {
    id: 'LF-20260629-002',
    name: 'Gucci 黑色牛皮钥匙包',
    category: '箱包证件',
    foundTime: '2026-06-29 12:15',
    foundLocation: { zone: 'A区 (大厅卡座)', table: 'A03' },
    description: '黑色Gucci印花，金色五金，里面包含3把钥匙（1把车钥匙，2把家用钥匙）和1张小区门禁卡。',
    overallPhoto: PHOTO_PRESETS[1].overall,
    detailPhoto: PHOTO_PRESETS[1].detail,
    finderName: '赵前台 (前台)',
    status: 'pending_claim',
    isHighValue: true,
    managerReviewed: false,
    createdAt: '2026-06-29T12:30:00.000Z',
    claimant: null,
    matchedFeatures: [],
    logs: [
      {
        id: 'L-004',
        operatorRole: 'receptionist',
        operatorName: '赵前台',
        time: '2026-06-29 12:30',
        action: '登记上报',
        fromStatus: 'none',
        toStatus: 'pending_claim',
        remarks: '中午退台在A03桌底捡到，内含豪车钥匙，判定为贵重物品，等待店长复核。'
      }
    ],
    handovers: []
  },
  {
    id: 'LF-20260625-003',
    name: 'Apple AirPods Pro 蓝牙耳机',
    category: '电子产品',
    foundTime: '2026-06-25 21:00',
    foundLocation: { zone: 'B区 (普通散台)', table: 'B12' },
    description: '白色AirPods Pro二代，充电盒背面贴有橙色小狐狸贴纸，左耳塞防尘网有轻微红墨水痕迹。',
    overallPhoto: PHOTO_PRESETS[4].overall,
    detailPhoto: PHOTO_PRESETS[4].detail,
    finderName: '赵前台 (前台)',
    status: 'claimed',
    isHighValue: false,
    createdAt: '2026-06-25T21:15:00.000Z',
    claimant: {
      name: '陈大文',
      phone: '13812345678',
      idCard: '4401061995********',
      signPhoto: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="80"><text x="20" y="50" font-family="cursive" font-size="28" fill="black">陈大文</text></svg>',
      claimTime: '2026-06-26 14:30'
    },
    matchedFeatures: [
      '耳机套上的橙色小狐狸贴纸完全一致',
      '左耳塞腔体的微量红色墨水标记一致',
      '现场用其iPhone手机成功配对蓝牙并显示名称“大文的AirPods Pro”'
    ],
    logs: [
      {
        id: 'L-005',
        operatorRole: 'receptionist',
        operatorName: '赵前台',
        time: '2026-06-25 21:15',
        action: '登记上报',
        fromStatus: 'none',
        toStatus: 'pending_claim',
        remarks: '打扫B12桌底时拾获。'
      },
      {
        id: 'L-006',
        operatorRole: 'leader',
        operatorName: '张领班',
        time: '2026-06-25 21:45',
        action: '交接确认',
        fromStatus: 'pending_claim',
        toStatus: 'custody',
        remarks: '交接至前台常温柜。'
      },
      {
        id: 'L-007',
        operatorRole: 'receptionist',
        operatorName: '赵前台',
        time: '2026-06-26 14:30',
        action: '核销领回',
        fromStatus: 'custody',
        toStatus: 'claimed',
        remarks: '失主陈大文前来领回，三项特征比对完全符合。'
      }
    ],
    handovers: [
      {
        id: 'H-003',
        fromRole: 'leader',
        toRole: 'leader',
        senderName: '王小明',
        receiverName: '张领班',
        time: '2026-06-25 21:30',
        remarks: '已交接，充电盒尚有50%电量。'
      }
    ]
  },
  {
    id: 'LF-20260515-004',
    name: '天堂牌黑色防紫外线折叠伞',
    category: '日常用品',
    foundTime: '2026-05-15 14:00',
    foundLocation: { zone: 'D区 (吧台及通道)', table: 'D区通道雨伞架' },
    description: '黑色天堂牌折叠伞，把手处挂绳断裂，伞面上有一个约2厘米长的黄色小泥点。',
    overallPhoto: PHOTO_PRESETS[3].overall,
    detailPhoto: PHOTO_PRESETS[3].detail,
    finderName: '赵前台 (前台)',
    status: 'overdue',
    isHighValue: false,
    createdAt: '2026-05-15T14:10:00.000Z',
    claimant: null,
    matchedFeatures: [],
    logs: [
      {
        id: 'L-008',
        operatorRole: 'receptionist',
        operatorName: '赵前台',
        time: '2026-05-15 14:15',
        action: '前台登记',
        fromStatus: 'none',
        toStatus: 'custody',
        remarks: '在雨伞架处无人认领，已前台入库。'
      },
      {
        id: 'L-009',
        operatorRole: 'receptionist',
        operatorName: '赵前台',
        time: '2026-06-20 10:00',
        action: '逾期销账',
        fromStatus: 'custody',
        toStatus: 'overdue',
        remarks: '物品保管已超30天逾期限制，根据门店规范进行环保报废/捐赠处理。'
      }
    ],
    handovers: []
  }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'N-001',
    title: '新遗失物品待复核 (贵重物品)',
    content: '服务员刘美美上报了「Gucci 黑色牛皮钥匙包」(价值判定高)，请领班/店长及时前往系统完成复核和交接保管。',
    time: '2026-06-29 12:30',
    isRead: false,
    type: 'new_report',
    itemId: 'LF-20260629-002'
  },
  {
    id: 'N-002',
    title: '物品交接提醒',
    content: '服务员王小明发起了「华为 Mate XT 三折叠手机」的交接，请领班张领班点击确认接收。',
    time: '2026-06-28 20:05',
    isRead: true,
    type: 'handover',
    itemId: 'LF-20260628-001'
  },
  {
    id: 'N-003',
    title: '逾期预警提醒',
    content: '暂存雨伞架处的「天堂牌黑色防紫外线折叠伞」还有7天将达到30天保管上限，请注意跟进。',
    time: '2026-06-13 09:00',
    isRead: true,
    type: 'overdue_alert',
    itemId: 'LF-20260515-004'
  }
];
