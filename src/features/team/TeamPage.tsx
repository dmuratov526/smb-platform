import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import PageHeader from '../../shared/components/PageHeader';
import { useAppSelector } from '../../app/hooks';
import { mockBusinessConfigurations } from '../../mock/businesses';

const employeeTypeColor: Record<string, 'primary' | 'secondary' | 'default'> = {
  full_time: 'primary',
  part_time: 'secondary',
  contractor: 'default',
};

const employeeTypeLabel: Record<string, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contractor: 'Contractor',
};

const avatarColors = ['#2563EB', '#7C3AED', '#059669', '#D97706', '#DC2626', '#0284C7'];

const TeamPage: React.FC = () => {
  const { activeBusinessId } = useAppSelector((s) => s.business);
  const config = mockBusinessConfigurations.find((c) => c.businessId === activeBusinessId);
  const employees = config?.employees ?? [];

  const totalPayroll = employees.reduce((a, e) => a + e.monthlyCost, 0);
  const fullTime = employees.filter((e) => e.type === 'full_time').length;
  const partTime = employees.filter((e) => e.type === 'part_time').length;
  const contractors = employees.filter((e) => e.type === 'contractor').length;

  return (
    <Box>
      <PageHeader
        title="Team"
        description="Manage team members, roles, and responsibilities."
        actions={
          <Button variant="contained" size="small" startIcon={<AddIcon />}>
            Add Member
          </Button>
        }
      />

      <Grid container spacing={2.5} mb={3}>
        {[
          { label: 'Total Members', value: employees.length },
          { label: 'Full-time', value: fullTime },
          { label: 'Part-time / Contract', value: partTime + contractors },
          { label: 'Monthly Payroll', value: `$${totalPayroll.toLocaleString()}` },
        ].map((stat) => (
          <Grid item xs={6} sm={3} key={stat.label}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing="0.06em">
                  {stat.label}
                </Typography>
                <Typography variant="h5" fontWeight={700} mt={0.5}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="subtitle2" fontWeight={600} mb={2}>
            Team Members
          </Typography>
          {employees.length > 0 ? (
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
                  {employees.map((emp, idx) => (
                    <TableRow key={emp.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <Avatar
                            sx={{
                              width: 30,
                              height: 30,
                              fontSize: '0.7rem',
                              bgcolor: avatarColors[idx % avatarColors.length],
                            }}
                          >
                            {emp.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()}
                          </Avatar>
                          <Typography variant="body2" fontWeight={500}>
                            {emp.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {emp.role}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={employeeTypeLabel[emp.type]}
                          size="small"
                          color={employeeTypeColor[emp.type]}
                          variant="outlined"
                          sx={{ height: 20, fontSize: '0.65rem' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}>
                          ${emp.monthlyCost.toLocaleString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box py={4} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                No team members added yet.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default TeamPage;
