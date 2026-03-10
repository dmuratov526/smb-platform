import { Navigate, RouteObject } from 'react-router-dom';
import ProtectedLayout from './ProtectedLayout';
import BusinessBuilderPage from '../features/businessBuilder/BusinessBuilderPage';
import BusinessSimulatorPage from '../features/businessSimulator/BusinessSimulatorPage';
import LaunchPlannerPage from '../features/launchPlanner/LaunchPlannerPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import BusinessesPage from '../features/businesses/BusinessesPage';
import FinancePage from '../features/finance/FinancePage';
import OperationsPage from '../features/operations/OperationsPage';
import MarketingPage from '../features/marketing/MarketingPage';
import TeamPage from '../features/team/TeamPage';
import AnalyticsPage from '../features/analytics/AnalyticsPage';
import AIAssistantPage from '../features/ai-assistant/AIAssistantPage';
import SettingsPage from '../features/settings/SettingsPage';
import UserSelectPage from '../features/session/UserSelectPage';
import OnboardingPage from '../features/onboarding/OnboardingPage';

const routes: RouteObject[] = [
  { path: '/select-user', element: <UserSelectPage /> },
  { path: '/onboarding', element: <OnboardingPage /> },
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <Navigate to="/builder" replace /> },
      { path: 'builder', element: <BusinessBuilderPage /> },
      { path: 'simulator', element: <BusinessSimulatorPage /> },
      { path: 'planner', element: <LaunchPlannerPage /> },
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
