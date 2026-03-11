import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  BusinessCenter as BuilderIcon,
  BarChart as SimulatorIcon,
  RocketLaunch as PlannerIcon,
  Dashboard as DashboardIcon,
  Store as BusinessesIcon,
  AccountBalance as FinanceIcon,
  Settings as OperationsIcon,
  Campaign as MarketingIcon,
  Group as TeamIcon,
  Insights as AnalyticsIcon,
  SmartToy as AIIcon,
  Tune as SettingsIcon,
  MapOutlined as JourneyIcon,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';

const SIDEBAR_WIDTH = 260;
const SIDEBAR_BG = '#0F172A';
const TEXT_MUTED = '#94A3B8';
const TEXT_ACTIVE = '#F8FAFC';
const DIVIDER_COLOR = alpha('#94A3B8', 0.12);

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
  badgeColor?: 'primary' | 'secondary' | 'success' | 'warning';
  isPrimary?: boolean;
}

interface NavSection {
  sectionLabel?: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    items: [
      {
        label: 'Business Journey',
        icon: <JourneyIcon fontSize="small" />,
        path: '/journey',
        badge: 'New',
        badgeColor: 'success',
        isPrimary: true,
      },
    ],
  },
  {
    sectionLabel: 'Core Platform',
    items: [
      {
        label: 'Business Builder',
        icon: <BuilderIcon fontSize="small" />,
        path: '/builder',
        badge: 'Core',
        badgeColor: 'secondary',
        isPrimary: true,
      },
      {
        label: 'Business Simulator',
        icon: <SimulatorIcon fontSize="small" />,
        path: '/simulator',
        badge: 'Core',
        badgeColor: 'secondary',
        isPrimary: true,
      },
      {
        label: 'Launch Planner',
        icon: <PlannerIcon fontSize="small" />,
        path: '/planner',
      },
    ],
  },
  {
    sectionLabel: 'Overview',
    items: [
      {
        label: 'Dashboard',
        icon: <DashboardIcon fontSize="small" />,
        path: '/dashboard',
      },
      {
        label: 'Businesses',
        icon: <BusinessesIcon fontSize="small" />,
        path: '/businesses',
      },
    ],
  },
  {
    sectionLabel: 'Operations',
    items: [
      { label: 'Finance', icon: <FinanceIcon fontSize="small" />, path: '/finance' },
      { label: 'Operations', icon: <OperationsIcon fontSize="small" />, path: '/operations' },
      { label: 'Marketing', icon: <MarketingIcon fontSize="small" />, path: '/marketing' },
      { label: 'Team', icon: <TeamIcon fontSize="small" />, path: '/team' },
    ],
  },
  {
    sectionLabel: 'Insights',
    items: [
      { label: 'Analytics', icon: <AnalyticsIcon fontSize="small" />, path: '/analytics' },
      { label: 'AI Assistant', icon: <AIIcon fontSize="small" />, path: '/ai-assistant' },
    ],
  },
  {
    items: [
      { label: 'Settings', icon: <SettingsIcon fontSize="small" />, path: '/settings' },
    ],
  },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          background: SIDEBAR_BG,
          borderRight: 'none',
          overflowX: 'hidden',
        },
      }}
    >
      <Box
        px={2.5}
        py={2.5}
        display="flex"
        alignItems="center"
        gap={1.5}
        borderBottom={`1px solid ${DIVIDER_COLOR}`}
      >
        <Box
          width={32}
          height={32}
          borderRadius={1.5}
          bgcolor={theme.palette.primary.main}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="caption" fontWeight={700} color="#fff" fontSize="0.75rem">
            SMB
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="subtitle2"
            fontWeight={700}
            sx={{ color: TEXT_ACTIVE, letterSpacing: '-0.01em', lineHeight: 1.2 }}
          >
            SMB Platform
          </Typography>
          <Typography variant="caption" sx={{ color: TEXT_MUTED, fontSize: '0.7rem' }}>
            Business OS
          </Typography>
        </Box>
      </Box>

      <Box sx={{ overflowY: 'auto', overflowX: 'hidden', flex: 1, py: 1 }}>
        {navSections.map((section, sectionIndex) => (
          <Box key={sectionIndex}>
            {section.sectionLabel && (
              <Typography
                variant="overline"
                sx={{
                  color: alpha(TEXT_MUTED, 0.6),
                  fontSize: '0.65rem',
                  letterSpacing: '0.1em',
                  px: 2.5,
                  pt: 2,
                  pb: 0.5,
                  display: 'block',
                }}
              >
                {section.sectionLabel}
              </Typography>
            )}
            {!section.sectionLabel && sectionIndex > 0 && (
              <Divider sx={{ borderColor: DIVIDER_COLOR, mx: 2, my: 1 }} />
            )}
            <List disablePadding dense>
              {section.items.map((item) => {
                const active = isActive(item.path);
                const isJourney = item.path === '/journey';

                if (isJourney) {
                  return (
                    <ListItem key={item.path} disablePadding sx={{ px: 1.5, mb: 0.5, mt: 0.5 }}>
                      <ListItemButton
                        onClick={() => navigate(item.path)}
                        sx={{
                          borderRadius: 2,
                          py: 1,
                          px: 1.5,
                          background: active
                            ? 'linear-gradient(135deg, #6366F1, #8B5CF6)'
                            : `linear-gradient(135deg, ${alpha('#6366F1', 0.22)}, ${alpha('#8B5CF6', 0.18)})`,
                          border: `1px solid ${active ? 'transparent' : alpha('#6366F1', 0.35)}`,
                          boxShadow: active
                            ? '0 0 16px rgba(99,102,241,0.4)'
                            : '0 0 8px rgba(99,102,241,0.15)',
                          transition: 'all 0.2s',
                          '&:hover': {
                            background: active
                              ? 'linear-gradient(135deg, #7C3AED, #6366F1)'
                              : `linear-gradient(135deg, ${alpha('#6366F1', 0.3)}, ${alpha('#8B5CF6', 0.25)})`,
                            boxShadow: '0 0 20px rgba(99,102,241,0.45)',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 32, color: active ? '#fff' : '#A5B4FC' }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.label}
                          primaryTypographyProps={{
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            color: active ? '#fff' : '#C4B5FD',
                            noWrap: true,
                          }}
                        />
                        <Chip
                          label={item.badge}
                          size="small"
                          sx={{
                            height: 16,
                            fontSize: '0.55rem',
                            fontWeight: 700,
                            bgcolor: active ? 'rgba(255,255,255,0.25)' : alpha('#10B981', 0.25),
                            color: active ? '#fff' : '#6EE7B7',
                            border: `1px solid ${active ? 'rgba(255,255,255,0.3)' : alpha('#10B981', 0.4)}`,
                            '& .MuiChip-label': { px: 0.6 },
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                }

                return (
                  <ListItem key={item.path} disablePadding sx={{ px: 1.5, mb: 0.25 }}>
                    <Tooltip title={item.label} placement="right" disableHoverListener>
                      <ListItemButton
                        onClick={() => navigate(item.path)}
                        sx={{
                          borderRadius: 1.5,
                          py: 0.85,
                          px: 1.5,
                          background: active
                            ? alpha('#6366F1', item.isPrimary ? 0.2 : 0.12)
                            : 'transparent',
                          '&:hover': {
                            background: active
                              ? alpha('#6366F1', item.isPrimary ? 0.25 : 0.16)
                              : alpha('#94A3B8', 0.08),
                          },
                          transition: 'background 0.15s',
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 32,
                            color: active
                              ? item.isPrimary
                                ? '#A5B4FC'
                                : '#93C5FD'
                              : TEXT_MUTED,
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.label}
                          primaryTypographyProps={{
                            fontSize: '0.875rem',
                            fontWeight: active ? 600 : 400,
                            color: active ? TEXT_ACTIVE : TEXT_MUTED,
                            noWrap: true,
                          }}
                        />
                        {item.badge && (
                          <Chip
                            label={item.badge}
                            size="small"
                            color={item.badgeColor ?? 'default'}
                            sx={{
                              height: 18,
                              fontSize: '0.6rem',
                              fontWeight: 600,
                              ml: 0.5,
                              '& .MuiChip-label': { px: 0.75 },
                            }}
                          />
                        )}
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>
    </Drawer>
  );
};

export default Sidebar;
