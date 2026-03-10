import React from 'react';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Divider,
  InputAdornment,
} from '@mui/material';
import {
  LightbulbOutlined as IdeaIcon,
  RocketLaunchOutlined as EarlyIcon,
  StoreOutlined as OperatingIcon,
  LocationOnOutlined as LocationIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { updateBasics } from '../../../app/onboardingSlice';
import { BusinessStage } from '../../../types';
import { categoryGroups, getCategoriesByGroup } from '../config/categories';

const stageOptions: { value: BusinessStage; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'idea',
    label: 'Idea Stage',
    description: 'Still exploring and validating the concept',
    icon: <IdeaIcon fontSize="small" />,
  },
  {
    value: 'early',
    label: 'Early Stage',
    description: 'Building, testing, or pre-revenue',
    icon: <EarlyIcon fontSize="small" />,
  },
  {
    value: 'operating',
    label: 'Operating',
    description: 'Already running with customers or revenue',
    icon: <OperatingIcon fontSize="small" />,
  },
];

const StepBasics: React.FC = () => {
  const dispatch = useAppDispatch();
  const draft = useAppSelector((s) => s.onboarding.draft);

  const handleChange = (field: string, value: string) => {
    dispatch(updateBasics({ [field]: value } as Parameters<typeof updateBasics>[0]));
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Grid container spacing={2.5}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Business Name"
            value={draft.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g. Brewed Awakening, Apex Solutions"
            required
            variant="outlined"
            helperText="Choose a name that reflects your brand identity"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Business Description"
            value={draft.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Briefly describe your business concept, what you do, and who you serve..."
            helperText="A clear one or two sentence summary of your business"
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel>Business Category</InputLabel>
            <Select
              value={draft.category}
              label="Business Category"
              onChange={(e) => handleChange('category', e.target.value)}
            >
              {categoryGroups.map((group) => {
                const groupCategories = getCategoriesByGroup(group);
                return [
                  <MenuItem
                    key={`group-${group}`}
                    disabled
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'text.disabled',
                      py: 0.5,
                      mt: 0.5,
                    }}
                  >
                    {group}
                  </MenuItem>,
                  ...groupCategories.map((cat) => (
                    <MenuItem key={cat.key} value={cat.key} sx={{ pl: 3 }}>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {cat.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {cat.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  )),
                ];
              })}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Divider />

      <Box>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          What stage is this business at?
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          This helps us tailor the setup experience to where you are in your journey.
        </Typography>
        <Box display="flex" gap={1.5} flexWrap="wrap">
          {stageOptions.map((opt) => {
            const isSelected = draft.stage === opt.value;
            return (
              <Box
                key={opt.value}
                onClick={() => handleChange('stage', opt.value)}
                sx={{
                  flex: '1 1 160px',
                  border: '1.5px solid',
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  borderRadius: 2,
                  p: 2,
                  cursor: 'pointer',
                  bgcolor: isSelected ? 'primary.main' : 'background.paper',
                  color: isSelected ? 'primary.contrastText' : 'text.primary',
                  transition: 'all 0.15s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: isSelected ? 'primary.dark' : 'action.hover',
                  },
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                  {opt.icon}
                  <Typography variant="subtitle2" fontWeight={600}>
                    {opt.label}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  sx={{ color: isSelected ? 'rgba(255,255,255,0.8)' : 'text.secondary' }}
                >
                  {opt.description}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Divider />

      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Location (optional)"
            value={draft.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="e.g. Austin, TX or Remote"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Initial Team Size</InputLabel>
            <Select
              value={draft.teamSize}
              label="Initial Team Size"
              onChange={(e) => handleChange('teamSize', e.target.value)}
            >
              <MenuItem value="solo">Just me (solo founder)</MenuItem>
              <MenuItem value="2_3">2–3 people</MenuItem>
              <MenuItem value="4_10">4–10 people</MenuItem>
              <MenuItem value="11_25">11–25 people</MenuItem>
              <MenuItem value="25_plus">25+ people</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StepBasics;
