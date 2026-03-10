import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Button,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import PageHeader from '../../shared/components/PageHeader';

interface ProcessItem {
  id: string;
  name: string;
  category: string;
  status: 'operational' | 'needs_attention' | 'paused';
  completionRate: number;
  owner: string;
}

const mockProcesses: ProcessItem[] = [
  { id: 'p1', name: 'Daily Opening Checklist', category: 'Daily Ops', status: 'operational', completionRate: 94, owner: 'Jordan Lee' },
  { id: 'p2', name: 'Inventory Reorder Workflow', category: 'Supply Chain', status: 'operational', completionRate: 88, owner: 'Sam Rivera' },
  { id: 'p3', name: 'Equipment Maintenance Schedule', category: 'Maintenance', status: 'needs_attention', completionRate: 60, owner: 'Jordan Lee' },
  { id: 'p4', name: 'Supplier Invoice Processing', category: 'Finance', status: 'operational', completionRate: 100, owner: 'Taylor Brooks' },
  { id: 'p5', name: 'Staff Scheduling', category: 'HR', status: 'operational', completionRate: 100, owner: 'Jordan Lee' },
  { id: 'p6', name: 'End-of-Day Cash Reconciliation', category: 'Finance', status: 'needs_attention', completionRate: 72, owner: 'Taylor Brooks' },
];

const statusChip: Record<ProcessItem['status'], { label: string; color: 'success' | 'warning' | 'default' }> = {
  operational: { label: 'Operational', color: 'success' },
  needs_attention: { label: 'Needs Attention', color: 'warning' },
  paused: { label: 'Paused', color: 'default' },
};

const OperationsPage: React.FC = () => {
  const operational = mockProcesses.filter((p) => p.status === 'operational').length;
  const needsAttention = mockProcesses.filter((p) => p.status === 'needs_attention').length;

  return (
    <Box>
      <PageHeader
        title="Operations"
        description="Monitor and manage internal business processes and workflows."
        actions={
          <Button variant="contained" size="small" startIcon={<AddIcon />}>
            Add Process
          </Button>
        }
      />

      <Grid container spacing={2.5} mb={3}>
        {[
          { label: 'Total Processes', value: mockProcesses.length, color: 'text.primary' },
          { label: 'Operational', value: operational, color: 'success.main' },
          { label: 'Needs Attention', value: needsAttention, color: 'warning.main' },
          {
            label: 'Avg Completion',
            value: `${Math.round(mockProcesses.reduce((a, p) => a + p.completionRate, 0) / mockProcesses.length)}%`,
            color: 'primary.main',
          },
        ].map((stat) => (
          <Grid item xs={6} sm={3} key={stat.label}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing="0.06em">
                  {stat.label}
                </Typography>
                <Typography variant="h4" fontWeight={700} mt={0.5} color={stat.color}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card>
        <CardContent sx={{ pb: '16px !important' }}>
          <Typography variant="subtitle2" fontWeight={600} mb={2}>
            Active Processes
          </Typography>
          <List disablePadding>
            {mockProcesses.map((process, idx) => (
              <ListItem
                key={process.id}
                disablePadding
                sx={{
                  py: 1.5,
                  px: 0,
                  borderTop: idx > 0 ? '1px solid' : 'none',
                  borderColor: 'divider',
                  alignItems: 'flex-start',
                  gap: 2,
                }}
              >
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      <Typography variant="body2" fontWeight={600}>
                        {process.name}
                      </Typography>
                      <Chip
                        label={statusChip[process.status].label}
                        size="small"
                        color={statusChip[process.status].color}
                        sx={{ height: 18, fontSize: '0.65rem', '& .MuiChip-label': { px: 0.75 } }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Box display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography variant="caption" color="text.secondary">
                          {process.category} · {process.owner}
                        </Typography>
                        <Typography variant="caption" fontWeight={600} color="text.secondary">
                          {process.completionRate}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={process.completionRate}
                        color={process.status === 'needs_attention' ? 'warning' : 'success'}
                        sx={{ height: 4 }}
                      />
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OperationsPage;
