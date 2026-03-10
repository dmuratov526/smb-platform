import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Group as TeamIcon,
  Category as CategoryIcon,
  FlagOutlined as StageIcon,
} from '@mui/icons-material';
import { Business } from '../../../types';

interface BusinessOverviewHeaderProps {
  business: Business;
}

const INDUSTRY_LABELS: Record<string, string> = {
  food_service: 'Food & Beverage',
  retail: 'Retail',
  services: 'Services',
  manufacturing: 'Manufacturing',
  workshop: 'Workshop',
  digital: 'Digital / Agency',
  other: 'Other',
};

const STAGE_LABELS: Record<string, string> = {
  idea: 'Idea Stage',
  early: 'Early Stage',
  operating: 'Operational',
};

const STATUS_COLOR: Record<string, 'success' | 'warning' | 'default' | 'error'> = {
  active: 'success',
  draft: 'warning',
  paused: 'default',
  archived: 'error',
};

const InfoPill: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
    <Box sx={{ fontSize: 14, display: 'flex', alignItems: 'center' }}>{icon}</Box>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
  </Box>
);

const BusinessOverviewHeader: React.FC<BusinessOverviewHeaderProps> = ({ business }) => {
  const industry = INDUSTRY_LABELS[business.industry] ?? business.industry;
  const stage = business.stage ? STAGE_LABELS[business.stage] ?? business.stage : null;
  const statusColor = STATUS_COLOR[business.status] ?? 'default';

  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={2} flexWrap="wrap">
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              width={48}
              height={48}
              borderRadius={2}
              bgcolor={business.logoColor}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
            >
              <Typography variant="h6" fontWeight={700} color="white" lineHeight={1}>
                {business.name.charAt(0)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
                {business.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={0.25}>
                {business.description}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={1} flexShrink={0} flexWrap="wrap">
            <Chip
              label={business.status}
              size="small"
              color={statusColor}
              sx={{ textTransform: 'capitalize', fontWeight: 600, fontSize: '0.7rem' }}
            />
            {stage && (
              <Chip
                label={stage}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 500, fontSize: '0.7rem' }}
              />
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" flexWrap="wrap" gap={2.5}>
          <InfoPill
            icon={<CategoryIcon sx={{ fontSize: 14 }} />}
            label={industry}
          />
          {business.location && (
            <InfoPill
              icon={<LocationIcon sx={{ fontSize: 14 }} />}
              label={business.location}
            />
          )}
          {business.teamSize && (
            <InfoPill
              icon={<TeamIcon sx={{ fontSize: 14 }} />}
              label={`Team: ${business.teamSize}`}
            />
          )}
          {stage && (
            <InfoPill
              icon={<StageIcon sx={{ fontSize: 14 }} />}
              label={`Stage: ${stage}`}
            />
          )}
          <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
            <Typography variant="caption" color="text.disabled">
              Created {new Date(business.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BusinessOverviewHeader;
