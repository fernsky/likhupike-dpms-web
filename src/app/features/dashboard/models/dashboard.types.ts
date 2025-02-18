import { SystemHealthStatus } from '@app/core/services/security/security.types';

export interface DashboardSystemStats {
  usersOnline: number;
  totalTransactions: number;
  activeProfiles: number;
  systemLoad: number;
}

export interface ActivityResponse {
  activities: Array<{
    id: string;
    type: string;
    timestamp: Date;
    details: Record<string, any>;
  }>;
  totalCount: number;
}

export interface QuickActionResult {
  success: boolean;
  actionId: string;
  result: any;
  timestamp: Date;
}

export interface SystemHealthCheckResponse extends SystemHealthStatus {
  status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
  timestamp: Date;
  issues: Array<{
    id: string;
    component: string;
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    timestamp: Date;
    status: 'ACTIVE' | 'RESOLVED' | 'IN_PROGRESS';
  }>;
  metrics: {
    performance: {
      cpu: number;
      memory: number;
      latency: number;
    };
    security: {
      activeThreats: number;
      lastScanTimestamp: Date;
      vulnerabilitiesFound: number;
    };
    availability: {
      uptime: number;
      lastDowntime?: Date;
      serviceStatus: Record<string, 'UP' | 'DOWN' | 'DEGRADED'>;
    };
  };
}
