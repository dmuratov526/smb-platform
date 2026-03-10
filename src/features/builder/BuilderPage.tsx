import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Tabs,
  Tab,
  Chip,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Save as SaveIcon,
  ContentCopy as DuplicateIcon,
  SmartToy as AIIcon,
  AutoAwesome as SparkleIcon,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import PageHeader from '../../shared/components/PageHeader';
import { useAppSelector } from '../../app/hooks';
import { mockBusinessConfigurations } from '../../mock/businesses';
import { mockBusinesses } from '../../mock/businesses';

const industryLabel: Record<string, string> = {
  food_service: 'Food & Beverage',
  retail: 'Retail',
  services: 'Services',
  digital: 'Digital / Agency',
  manufacturing: 'Manufacturing',
  workshop: 'Workshop',
  other: 'Other',
};

const TABS = [
  'Profile',
  'Revenue Streams',
  'Cost Categories',
  'Staffing',
  'Marketing',
  'Operations',
];

const AIHint: React.FC<{ text: string }> = ({ text }) => (
  <Alert
    icon={<SparkleIcon fontSize="small" />}
    severity="info"
    sx={{ mb: 2, '& .MuiAlert-message': { fontSize: '0.85rem' } }}
  >
    {text}
  </Alert>
);

const BuilderPage: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const { activeBusinessId } = useAppSelector((s) => s.business);

  const business = mockBusinesses.find((b) => b.id === activeBusinessId);
  const config = mockBusinessConfigurations.find((c) => c.businessId === activeBusinessId);

  const totalRevenue = config?.revenueStreams.reduce((a, r) => a + r.monthlyAmount, 0) ?? 0;
  const totalCosts = config?.costCategories.reduce((a, c) => a + c.monthlyAmount, 0) ?? 0;
  const totalPayroll = config?.employees.reduce((a, e) => a + e.monthlyCost, 0) ?? 0;
  const totalMarketing = config?.marketingChannels.reduce((a, m) => a + m.monthlyBudget, 0) ?? 0;
  const configuredSections = [
    !!business,
    (config?.revenueStreams.length ?? 0) > 0,
    (config?.costCategories.length ?? 0) > 0,
    (config?.employees.length ?? 0) > 0,
    (config?.marketingChannels.length ?? 0) > 0,
    true,
  ];
  const completeness = Math.round((configuredSections.filter(Boolean).length / TABS.length) * 100);

  return (
    <Box>
      <PageHeader
        title="Business Builder"
        description="Design, configure, and structure your business model."
        actions={
          <Box display="flex" gap={1}>
            <Button size="small" variant="outlined" startIcon={<DuplicateIcon />}>
              Duplicate
            </Button>
            <Button size="small" variant="contained" startIcon={<SaveIcon />}>
              Save
            </Button>
          </Box>
        }
      />

      {/* Completion banner */}
      <Card
        sx={{
          mb: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.08)} 0%, ${alpha(theme.palette.primary.main, 0.06)} 100%)`,
          border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
          boxShadow: 'none',
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="subtitle2" fontWeight={600}>
                Configuration Completeness
              </Typography>
              <Chip
                label={`${completeness}%`}
                size="small"
                color={completeness === 100 ? 'success' : completeness >= 60 ? 'primary' : 'warning'}
                sx={{ fontWeight: 700 }}
              />
            </Box>
            <Button size="small" startIcon={<AIIcon />} color="secondary" variant="outlined">
              AI Assist
            </Button>
          </Box>
          <LinearProgress
            variant="determinate"
            value={completeness}
            color={completeness === 100 ? 'success' : 'secondary'}
            sx={{ height: 6, mb: 1 }}
          />
          <Box display="flex" gap={1} flexWrap="wrap">
            {TABS.map((tab, idx) => (
              <Chip
                key={tab}
                label={tab}
                size="small"
                variant={configuredSections[idx] ? 'filled' : 'outlined'}
                color={configuredSections[idx] ? 'success' : 'default'}
                onClick={() => setActiveTab(idx)}
                sx={{ height: 20, fontSize: '0.65rem', cursor: 'pointer', '& .MuiChip-label': { px: 1 } }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Tab navigation */}
      <Card>
        <Box borderBottom="1px solid" borderColor="divider">
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {TABS.map((tab, idx) => (
              <Tab
                key={tab}
                label={
                  <Box display="flex" alignItems="center" gap={0.75}>
                    {tab}
                    {configuredSections[idx] && (
                      <Box
                        width={6}
                        height={6}
                        borderRadius="50%"
                        bgcolor="success.main"
                        flexShrink={0}
                      />
                    )}
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>

        <CardContent>
          {/* Profile Tab */}
          {activeTab === 0 && (
            <Box>
              <AIHint text="Complete your business profile to help the AI assistant generate relevant recommendations and templates." />
              {business ? (
                <Grid container spacing={2.5}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Business Name"
                      defaultValue={business.name}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Industry"
                      defaultValue={industryLabel[business.industry] ?? business.industry}
                      fullWidth
                      size="small"
                      select
                      SelectProps={{ native: true }}
                    >
                      {Object.entries(industryLabel).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Location"
                      defaultValue={business.location}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Initial Budget"
                      defaultValue={config?.initialBudget ?? ''}
                      fullWidth
                      size="small"
                      InputProps={{ startAdornment: <Typography color="text.secondary" mr={0.5}>$</Typography> }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Target Monthly Revenue"
                      defaultValue={config?.targetMonthlyRevenue ?? ''}
                      fullWidth
                      size="small"
                      InputProps={{ startAdornment: <Typography color="text.secondary" mr={0.5}>$</Typography> }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Status"
                      defaultValue={business.status}
                      fullWidth
                      size="small"
                      select
                      SelectProps={{ native: true }}
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="archived">Archived</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Description"
                      defaultValue={business.description}
                      fullWidth
                      size="small"
                      multiline
                      rows={3}
                    />
                  </Grid>
                </Grid>
              ) : (
                <Typography color="text.secondary">No business selected.</Typography>
              )}
            </Box>
          )}

          {/* Revenue Streams Tab */}
          {activeTab === 1 && (
            <Box>
              <AIHint text="Define all the ways your business earns money. Include both product sales and service fees. The simulator uses these to project revenue scenarios." />
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total monthly revenue capacity
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="primary.main">
                    ${totalRevenue.toLocaleString()} / month
                  </Typography>
                </Box>
                <Button size="small" variant="outlined" startIcon={<AddIcon />}>
                  Add Stream
                </Button>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Monthly Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {config?.revenueStreams.map((rev) => (
                      <TableRow key={rev.id} hover>
                        <TableCell><Typography variant="body2" fontWeight={500}>{rev.name}</Typography></TableCell>
                        <TableCell>
                          <Chip label={rev.type} size="small" variant="outlined" sx={{ textTransform: 'capitalize', height: 20, fontSize: '0.65rem' }} />
                        </TableCell>
                        <TableCell><Typography variant="body2" color="text.secondary">{rev.description ?? '—'}</Typography></TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600} color="success.main">
                            ${rev.monthlyAmount.toLocaleString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {!config?.revenueStreams.length && (
                <Box py={4} textAlign="center">
                  <Typography variant="body2" color="text.secondary">No revenue streams configured yet.</Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Cost Categories Tab */}
          {activeTab === 2 && (
            <Box>
              <AIHint text="Categorize your costs into fixed (always occur) and variable (scale with activity). This drives break-even and profitability calculations in the simulator." />
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Total monthly costs</Typography>
                  <Typography variant="h6" fontWeight={700} color="error.main">
                    ${totalCosts.toLocaleString()} / month
                  </Typography>
                </Box>
                <Box display="flex" gap={1}>
                  <Chip label={`Fixed: $${config?.costCategories.filter(c => c.type === 'fixed').reduce((a, c) => a + c.monthlyAmount, 0).toLocaleString()}`} size="small" color="default" />
                  <Chip label={`Variable: $${config?.costCategories.filter(c => c.type === 'variable').reduce((a, c) => a + c.monthlyAmount, 0).toLocaleString()}`} size="small" color="default" />
                  <Button size="small" variant="outlined" startIcon={<AddIcon />}>Add Cost</Button>
                </Box>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Monthly Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {config?.costCategories.map((cost) => (
                      <TableRow key={cost.id} hover>
                        <TableCell><Typography variant="body2" fontWeight={500}>{cost.name}</Typography></TableCell>
                        <TableCell>
                          <Chip
                            label={cost.type}
                            size="small"
                            color={cost.type === 'fixed' ? 'default' : 'warning'}
                            variant="outlined"
                            sx={{ textTransform: 'capitalize', height: 20, fontSize: '0.65rem' }}
                          />
                        </TableCell>
                        <TableCell><Typography variant="body2" color="text.secondary">{cost.description ?? '—'}</Typography></TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>${cost.monthlyAmount.toLocaleString()}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Staffing Tab */}
          {activeTab === 3 && (
            <Box>
              <AIHint text="Define your team structure. Staff costs are the largest cost driver for most SMBs. Use this to model headcount and payroll assumptions." />
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Monthly payroll</Typography>
                  <Typography variant="h6" fontWeight={700}>${totalPayroll.toLocaleString()} / month</Typography>
                </Box>
                <Button size="small" variant="outlined" startIcon={<AddIcon />}>Add Employee</Button>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Monthly Cost</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {config?.employees.map((emp) => (
                      <TableRow key={emp.id} hover>
                        <TableCell><Typography variant="body2" fontWeight={500}>{emp.name}</Typography></TableCell>
                        <TableCell><Typography variant="body2" color="text.secondary">{emp.role}</Typography></TableCell>
                        <TableCell>
                          <Chip
                            label={emp.type.replace('_', '-')}
                            size="small"
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.65rem', textTransform: 'capitalize' }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>${emp.monthlyCost.toLocaleString()}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Marketing Tab */}
          {activeTab === 4 && (
            <Box>
              <AIHint text="Set your marketing channel mix. Budget allocation across channels feeds into the simulator's customer acquisition and revenue modeling." />
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Monthly marketing budget</Typography>
                  <Typography variant="h6" fontWeight={700}>${totalMarketing.toLocaleString()} / month</Typography>
                </Box>
                <Button size="small" variant="outlined" startIcon={<AddIcon />}>Add Channel</Button>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Channel</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Monthly Budget</TableCell>
                      <TableCell align="right">Expected Reach</TableCell>
                      <TableCell align="right">Budget Share</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {config?.marketingChannels.map((ch) => (
                      <TableRow key={ch.id} hover>
                        <TableCell><Typography variant="body2" fontWeight={500}>{ch.name}</Typography></TableCell>
                        <TableCell>
                          <Chip label={ch.type} size="small" variant="outlined" sx={{ textTransform: 'capitalize', height: 20, fontSize: '0.65rem' }} />
                        </TableCell>
                        <TableCell align="right"><Typography variant="body2">${ch.monthlyBudget.toLocaleString()}</Typography></TableCell>
                        <TableCell align="right"><Typography variant="body2">{ch.expectedReach.toLocaleString()}</Typography></TableCell>
                        <TableCell align="right" sx={{ width: 120 }}>
                          <Box display="flex" alignItems="center" gap={0.75}>
                            <LinearProgress
                              variant="determinate"
                              value={totalMarketing ? (ch.monthlyBudget / totalMarketing) * 100 : 0}
                              sx={{ flex: 1, height: 4 }}
                              color="secondary"
                            />
                            <Typography variant="caption" fontWeight={600} sx={{ minWidth: 32 }}>
                              {totalMarketing ? Math.round((ch.monthlyBudget / totalMarketing) * 100) : 0}%
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Operations Tab */}
          {activeTab === 5 && (
            <Box>
              <AIHint text="Describe the operational structure of your business. This includes how your service or product is delivered, key processes, and any physical or digital infrastructure." />
              <Grid container spacing={2.5}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Business Model Type"
                    defaultValue="Brick & Mortar"
                    fullWidth
                    size="small"
                    select
                    SelectProps={{ native: true }}
                  >
                    <option>Brick & Mortar</option>
                    <option>Online / E-commerce</option>
                    <option>Hybrid</option>
                    <option>Service-based</option>
                    <option>Subscription</option>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Primary Delivery Model"
                    defaultValue="In-person"
                    fullWidth
                    size="small"
                    select
                    SelectProps={{ native: true }}
                  >
                    <option>In-person</option>
                    <option>Remote / Online</option>
                    <option>Delivery</option>
                    <option>Hybrid</option>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" fontWeight={600} mb={1.5}>
                    Key Operational Areas
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1.5}>
                    {[
                      { label: 'Inventory Management', configured: true },
                      { label: 'Supplier Relationships', configured: true },
                      { label: 'Quality Control', configured: false },
                      { label: 'Customer Service Process', configured: false },
                      { label: 'POS / Technology Stack', configured: true },
                    ].map((area) => (
                      <Box key={area.label} display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="body2">{area.label}</Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip
                            label={area.configured ? 'Configured' : 'Not set'}
                            size="small"
                            color={area.configured ? 'success' : 'default'}
                            sx={{ height: 18, fontSize: '0.65rem', '& .MuiChip-label': { px: 0.75 } }}
                          />
                          <Button size="small" sx={{ minWidth: 0, px: 1 }}>Edit</Button>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default BuilderPage;
