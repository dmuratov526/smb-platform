import { Navigate, RouteObject } from 'react-router-dom';
import AppShell from '../layout/AppShell';
import BuilderPage from '../features/builder/BuilderPage';
import SimulatorPage from '../features/simulator/SimulatorPage';
import PlannerPage from '../features/planner/PlannerPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import BusinessesPage from '../features/businesses/BusinessesPage';
import FinancePage from '../features/finance/FinancePage';
import OperationsPage from '../features/operations/OperationsPage';
import MarketingPage from '../features/marketing/MarketingPage';
import TeamPage from '../features/team/TeamPage';
import AnalyticsPage from '../features/analytics/AnalyticsPage';
import AIAssistantPage from '../features/ai-assistant/AIAssistantPage';
import SettingsPage from '../features/settings/SettingsPage';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/builder" replace /> },
      { path: 'builder', element: <BuilderPage /> },
      { path: 'simulator', element: <SimulatorPage /> },
      { path: 'planner', element: <PlannerPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'businesses', element: <BusinessesPage /> },
      { path: 'finance', element: <FinancePage /> },
      { path: 'operations', element: <OperationsPage /> },
      { path: 'marketing', element: <MarketingPage /> },
      { path: 'team', element: <TeamPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'ai-assistant', element: <AIAssistantPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
];

export default routes;
