import { EntityState } from '@ngrx/entity';

export const DASHBOARD_FEATURE_KEY = 'dashboard';

export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalProfiles: number;
  pendingApprovals: number;
  systemUptime: string;
  lastBackup: Date;
  storageUsed: string;
  storageLimit: string;
}

export interface RecentActivity {
  id: string;
  type:
    | 'PROFILE_UPDATE'
    | 'DOCUMENT_UPLOAD'
    | 'APPROVAL_REQUEST'
    | 'SYSTEM_ALERT';
  timestamp: Date;
  description: string;
  userId: string;
  userFullName: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  permitted: boolean;
  requiresApproval: boolean;
}

export interface DashboardState {
  systemStats: SystemStats | null;
  recentActivities: {
    items: RecentActivity[];
    totalCount: number;
  };
  quickActions: {
    items: QuickAction[];
  };
  systemHealth: {
    status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
    issues: string[];
    lastChecked: Date;
    metrics: any; // Replace 'any' with proper metrics type if available
  };
  loading: {
    systemStats: boolean;
    recentActivities: boolean;
    quickActions: boolean;
    systemHealth: boolean;
  };
  error: {
    systemStats: string | null;
    recentActivities: string | null;
    quickActions: string | null;
    systemHealth: string | null;
  };
  ui: {
    sidenavOpen: boolean;
    currentView: string;
  };
}

export const initialDashboardState: DashboardState = {
  systemStats: null,
  recentActivities: {
    items: [],
    totalCount: 0,
  },
  quickActions: {
    items: [],
  },
  systemHealth: {
    status: 'HEALTHY',
    issues: [],
    lastChecked: new Date(),
    metrics: {},
  },
  loading: {
    systemStats: false,
    recentActivities: false,
    quickActions: false,
    systemHealth: false,
  },
  error: {
    systemStats: null,
    recentActivities: null,
    quickActions: null,
    systemHealth: null,
  },
  ui: {
    sidenavOpen: true,
    currentView: 'dashboard',
  },
};
