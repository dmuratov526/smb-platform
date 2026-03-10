import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Button,
  Switch,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
} from '@mui/material';
import PageHeader from '../../shared/components/PageHeader';

const SettingsPage: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [alertNotifications, setAlertNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  return (
    <Box>
      <PageHeader
        title="Settings"
        description="Manage workspace preferences and account configuration."
        actions={
          <Button variant="contained" size="small">
            Save Changes
          </Button>
        }
      />

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 2.5 }}>
            <CardContent>
              <Typography variant="subtitle2" fontWeight={700} mb={2}>
                Profile
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField label="Full Name" defaultValue="Jamie Doe" size="small" fullWidth />
                <TextField label="Email" defaultValue="jamie@smbplatform.io" size="small" fullWidth />
                <TextField label="Role" defaultValue="Business Owner" size="small" fullWidth />
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="subtitle2" fontWeight={700} mb={2}>
                Notifications
              </Typography>
              <List disablePadding>
                {[
                  { label: 'Email notifications', sub: 'Receive alerts and updates by email', checked: emailNotifications, onChange: setEmailNotifications },
                  { label: 'In-app alerts', sub: 'Show alerts inside the platform', checked: alertNotifications, onChange: setAlertNotifications },
                  { label: 'Weekly digest', sub: 'Summary of business performance each week', checked: weeklyDigest, onChange: setWeeklyDigest },
                ].map((item, idx) => (
                  <React.Fragment key={item.label}>
                    {idx > 0 && <Divider />}
                    <ListItem disablePadding sx={{ py: 1.25 }}>
                      <ListItemText
                        primary={<Typography variant="body2" fontWeight={500}>{item.label}</Typography>}
                        secondary={<Typography variant="caption" color="text.secondary">{item.sub}</Typography>}
                      />
                      <ListItemSecondaryAction>
                        <Switch
                          checked={item.checked}
                          onChange={(e) => item.onChange(e.target.checked)}
                          size="small"
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 2.5 }}>
            <CardContent>
              <Typography variant="subtitle2" fontWeight={700} mb={2}>
                Workspace
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField label="Workspace Name" defaultValue="My SMB Workspace" size="small" fullWidth />
                <TextField
                  label="Default Currency"
                  defaultValue="USD — US Dollar"
                  size="small"
                  fullWidth
                  select
                  SelectProps={{ native: true }}
                >
                  <option>USD — US Dollar</option>
                  <option>EUR — Euro</option>
                  <option>GBP — British Pound</option>
                  <option>CAD — Canadian Dollar</option>
                </TextField>
                <TextField
                  label="Fiscal Year Start"
                  defaultValue="January"
                  size="small"
                  fullWidth
                  select
                  SelectProps={{ native: true }}
                >
                  <option>January</option>
                  <option>April</option>
                  <option>July</option>
                  <option>October</option>
                </TextField>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="subtitle2" fontWeight={700} mb={2}>
                Plan & Billing
              </Typography>
              <Box
                p={2}
                borderRadius={2}
                bgcolor="primary.main"
                color="primary.contrastText"
                mb={2}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>
                      Prototype Plan
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.85 }}>
                      Full access · No billing
                    </Typography>
                  </Box>
                  <Chip
                    label="Active"
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600 }}
                  />
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                This is the frontend prototype. Billing and subscription management will be available in a future release.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsPage;
