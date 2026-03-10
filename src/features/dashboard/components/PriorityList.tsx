import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  Divider,
} from '@mui/material';
import {
  ErrorOutline as CriticalIcon,
  WarningAmber as HighIcon,
  InfoOutlined as MediumIcon,
  LowPriority as LowIcon,
  Build as BuilderIcon,
  TrendingUp as SimIcon,
  RocketLaunch as LaunchIcon,
  Settings as OpsIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { DashboardPriorityItem, PriorityItemSeverity, PriorityItemSource } from '../types';

const SEVERITY_CONFIG: Record<
  PriorityItemSeverity,
  { icon: React.ReactNode; color: string; bg: string; label: string }
> = {
  critical: {
    icon: <CriticalIcon sx={{ fontSize: 14 }} />,
    color: '#DC2626',
    bg: 'rgba(220,38,38,0.08)',
    label: 'Critical',
  },
  high: {
    icon: <HighIcon sx={{ fontSize: 14 }} />,
    color: '#D97706',
    bg: 'rgba(217,119,6,0.08)',
    label: 'High',
  },
  medium: {
    icon: <MediumIcon sx={{ fontSize: 14 }} />,
    color: '#2563EB',
    bg: 'rgba(37,99,235,0.08)',
    label: 'Medium',
  },
  low: {
    icon: <LowIcon sx={{ fontSize: 14 }} />,
    color: '#6B7280',
    bg: 'rgba(107,114,128,0.08)',
    label: 'Low',
  },
};

const SOURCE_ICONS: Record<PriorityItemSource, React.ReactNode> = {
  builder: <BuilderIcon sx={{ fontSize: 12 }} />,
  simulation: <SimIcon sx={{ fontSize: 12 }} />,
  launch: <LaunchIcon sx={{ fontSize: 12 }} />,
  operations: <OpsIcon sx={{ fontSize: 12 }} />,
};

const SOURCE_LABELS: Record<PriorityItemSource, string> = {
  builder: 'Builder',
  simulation: 'Simulator',
  launch: 'Launch',
  operations: 'Operations',
};

interface PriorityItemRowProps {
  item: DashboardPriorityItem;
}

const PriorityItemRow: React.FC<PriorityItemRowProps> = ({ item }) => {
  const navigate = useNavigate();
  const severity = SEVERITY_CONFIG[item.severity];

  return (
    <ListItem
      sx={{
        px: 2,
        py: 1.25,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 0.5,
        borderLeft: '3px solid',
        borderColor: severity.color,
        bgcolor: severity.bg,
      }}
      disableGutters
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" width="100%" gap={1}>
        <Box display="flex" alignItems="center" gap={0.75} flex={1} minWidth={0}>
          <Box color={severity.color} display="flex" alignItems="center" flexShrink={0}>
            {severity.icon}
          </Box>
          <Typography variant="body2" fontWeight={600} noWrap={false} lineHeight={1.3}>
            {item.title}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={0.5} flexShrink={0}>
          <Box color="text.disabled" display="flex" alignItems="center">
            {SOURCE_ICONS[item.source]}
          </Box>
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>
            {SOURCE_LABELS[item.source]}
          </Typography>
        </Box>
      </Box>

      <Typography variant="caption" color="text.secondary" display="block" pl={2.5}>
        {item.description}
      </Typography>

      {item.actionPath && (
        <Box pl={2.5}>
          <Button
            size="small"
            endIcon={<ArrowIcon sx={{ fontSize: 12 }} />}
            onClick={() => navigate(item.actionPath!)}
            sx={{ fontSize: '0.7rem', p: 0, minWidth: 0, height: 'auto', fontWeight: 600, color: severity.color }}
          >
            {item.actionLabel ?? 'View'}
          </Button>
        </Box>
      )}
    </ListItem>
  );
};

interface PriorityListProps {
  items: DashboardPriorityItem[];
}

const PriorityList: React.FC<PriorityListProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <Card variant="outlined">
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              width={28}
              height={28}
              borderRadius={1}
              bgcolor="rgba(5,150,105,0.1)"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <CriticalIcon sx={{ fontSize: 14, color: 'success.main' }} />
            </Box>
            <Typography variant="body2" color="text.secondary">
              No critical items requiring attention right now.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ overflow: 'hidden' }}>
      <List disablePadding>
        {items.map((item, idx) => (
          <React.Fragment key={item.id}>
            {idx > 0 && <Divider />}
            <PriorityItemRow item={item} />
          </React.Fragment>
        ))}
      </List>
    </Card>
  );
};

export default PriorityList;
