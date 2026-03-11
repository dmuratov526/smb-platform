import type { ReactNode } from 'react';

export type InsightType = 'risk' | 'action' | 'financial' | 'opportunity' | 'launch' | 'ops';
export type InsightSeverity = 'critical' | 'high' | 'medium' | 'low' | 'positive' | 'neutral';

export interface CommandInsightItem {
  text: string;
  meta?: string;
  severity?: InsightSeverity;
}

export interface CommandInsight {
  id: string;
  type: InsightType;
  title: string;
  subtitle: string;
  items: CommandInsightItem[];
  actionLabel?: string;
  actionPath?: string;
  accentColor: string;
  icon?: ReactNode;
  span?: 1 | 2;
  isAITagged?: boolean;
}

export interface AIResponseState {
  status: 'idle' | 'thinking' | 'complete';
  prompt?: string;
  responseText?: string;
  routeLabel?: string;
  routePath?: string;
  focusInsightType?: InsightType;
}

export interface WorkspaceConfig {
  label: string;
  path: string;
  color: string;
  desc: string;
}
