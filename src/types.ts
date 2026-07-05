export type Role = 'admin' | 'requester' | 'supervisor' | 'storekeeper' | 'purchaser';

export interface User {
  id: number;
  username: string;
  name: string;
  role: Role;
  department?: string;
}

export interface RequestItem {
  id: number;
  itemName: string;
  unit: string;
  reqQty: number;
  supQty: number;
  whQty: number;
  buyQty: number;
  purchasedQty?: number;
  deliveredQty?: number;
  totalDelivered?: number;
  description?: string;
  supComment?: string;
}

export interface RequestLog {
  id: number;
  user: string;
  date: string;
  action: string;
  icon: string;
  comment?: string;
}

export type RequestStatus = 'registered' | 'pending_supervisor' | 'approved_supervisor' | 'warehouse_check' | 'purchase_list' | 'delivered_to_wh' | 'completed' | 'rejected' | 'pending_delivery' | 'partial_purchase' | 'partial_delivery' | 'pending_purchase';

export interface Request {
  id: number;
  requesterId: number;
  date: string;
  status: RequestStatus;
  items: RequestItem[];
  logs: RequestLog[];
}
