import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  Avatar,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  InputAdornment,
} from '@mui/material';
import {
  BusinessCenter as BuilderIcon,
  ArrowForward as ArrowIcon,
  PersonAddOutlined as PersonAddIcon,
  BadgeOutlined as TitleIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUser, createUser } from '../../app/sessionSlice';
import { setActiveBusiness } from '../../app/businessSlice';
import { MockUser } from '../../types';

const UserCard: React.FC<{
  user: MockUser;
  businessCount: number;
  onSelect: () => void;
}> = ({ user, businessCount, onSelect }) => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        border: `1.5px solid ${theme.palette.divider}`,
        borderRadius: 3,
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: user.avatarColor,
          boxShadow: `0 4px 20px ${alpha(user.avatarColor, 0.15)}`,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardActionArea onClick={onSelect} sx={{ p: 3 }}>
        <Box display="flex" alignItems="flex-start" gap={2}>
          <Avatar
            sx={{
              width: 52,
              height: 52,
              bgcolor: user.avatarColor,
              fontSize: '1.1rem',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {user.initials}
          </Avatar>

          <Box flex={1} minWidth={0}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1.5}>
              {user.title}
            </Typography>

            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
              <Chip
                label={businessCount === 0 ? 'No businesses yet' : `${businessCount} business${businessCount > 1 ? 'es' : ''}`}
                size="small"
                variant="outlined"
                sx={{
                  height: 22,
                  fontSize: '0.7rem',
                  borderColor: businessCount > 0 ? alpha(user.avatarColor, 0.4) : 'divider',
                  color: businessCount > 0 ? user.avatarColor : 'text.secondary',
                }}
              />
            </Box>
          </Box>

          <ArrowIcon
            fontSize="small"
            sx={{ color: 'text.disabled', mt: 0.5, flexShrink: 0 }}
          />
        </Box>
      </CardActionArea>
    </Card>
  );
};

const UserSelectPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((s) => s.session);
  const { businesses } = useAppSelector((s) => s.business);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [nameError, setNameError] = useState('');

  const getBusinessCount = (user: MockUser) => user.businessIds.length;

  const handleSelectUser = (user: MockUser) => {
    dispatch(selectUser(user.id));
    const firstValidBusiness = businesses.find((b) => user.businessIds.includes(b.id));
    dispatch(setActiveBusiness(firstValidBusiness?.id ?? null));
    navigate('/builder');
  };

  const handleOpenDialog = () => {
    setNewName('');
    setNewTitle('');
    setNameError('');
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleCreateUser = () => {
    const trimmedName = newName.trim();
    if (!trimmedName) {
      setNameError('Name is required');
      return;
    }
    if (trimmedName.length < 2) {
      setNameError('Name must be at least 2 characters');
      return;
    }
    dispatch(createUser({ name: trimmedName, title: newTitle }));
    dispatch(setActiveBusiness(null));
    setDialogOpen(false);
    navigate('/builder');
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreateUser();
  };

  return (
    <>
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      bgcolor="background.default"
    >
      {/* Header */}
      <Box
        px={4}
        py={2}
        display="flex"
        alignItems="center"
        bgcolor="background.paper"
        borderBottom={`1px solid ${theme.palette.divider}`}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            width={36}
            height={36}
            borderRadius={2}
            bgcolor={theme.palette.primary.main}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <BuilderIcon sx={{ fontSize: 20, color: '#fff' }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
              SMB Platform
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Business Operating System
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        px={3}
        py={6}
      >
        <Box width="100%" maxWidth={680}>
          {/* Welcome Text */}
          <Box textAlign="center" mb={5}>
            <Typography
              variant="h4"
              fontWeight={700}
              mb={1.5}
              sx={{ letterSpacing: '-0.02em' }}
            >
              Welcome back
            </Typography>
            <Typography variant="body1" color="text.secondary" maxWidth={420} mx="auto">
              Select your workspace to continue, or create a new one. Each workspace has its
              own businesses and configurations.
            </Typography>
          </Box>

          {/* User Cards */}
          <Grid container spacing={2} mb={3}>
            {users.map((user) => (
              <Grid item xs={12} sm={6} md={4} key={user.id}>
                <UserCard
                  user={user}
                  businessCount={getBusinessCount(user)}
                  onSelect={() => handleSelectUser(user)}
                />
              </Grid>
            ))}
          </Grid>

          {/* Create New User */}
          <Box display="flex" justifyContent="center" mb={2}>
            <Button
              variant="outlined"
              size="medium"
              startIcon={<PersonAddIcon />}
              onClick={handleOpenDialog}
              sx={{ borderRadius: 2, fontWeight: 600, px: 3 }}
            >
              Create New User
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.disabled" px={1}>
              OR
            </Typography>
          </Divider>

          {/* Product Description */}
          <Box
            p={3}
            borderRadius={2}
            bgcolor={alpha(theme.palette.primary.main, 0.04)}
            border={`1px solid ${alpha(theme.palette.primary.main, 0.12)}`}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="subtitle2" fontWeight={700} mb={0.5}>
                  What is SMB Platform?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  A Business Operating System that helps you design, simulate, launch, and
                  manage your business — from initial concept to daily operations. Start by
                  selecting a workspace above.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box display="flex" flexDirection="column" gap={1}>
                  {[
                    'Business Builder',
                    'Business Simulator',
                    'Launch Planner',
                  ].map((feature) => (
                    <Box key={feature} display="flex" alignItems="center" gap={1}>
                      <Box
                        width={6}
                        height={6}
                        borderRadius="50%"
                        bgcolor={theme.palette.primary.main}
                        flexShrink={0}
                      />
                      <Typography variant="caption" fontWeight={500}>
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>

      {/* Create New User Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box
              width={36}
              height={36}
              borderRadius={2}
              bgcolor={alpha(theme.palette.primary.main, 0.1)}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <PersonAddIcon sx={{ fontSize: 20, color: 'primary.main' }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                Create New User
              </Typography>
              <Typography variant="caption" color="text.secondary">
                This user will be saved for this session
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: '16px !important' }}>
          <Box display="flex" flexDirection="column" gap={2.5}>
            <TextField
              label="Full Name"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                if (nameError) setNameError('');
              }}
              onKeyDown={handleNameKeyDown}
              error={Boolean(nameError)}
              helperText={nameError || 'e.g. Maria Garcia, John Smith'}
              required
              autoFocus
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonAddIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Role / Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleNameKeyDown}
              placeholder="e.g. Founder, Agency Owner, Freelancer"
              helperText="Optional — describes your role"
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TitleIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1 }}>
          <Button variant="outlined" onClick={handleCloseDialog} fullWidth>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateUser}
            fullWidth
            disabled={!newName.trim()}
          >
            Create & Enter
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserSelectPage;
