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
  userBusinesses: { id: string; name: string; industry: string; logoColor: string }[];
  onSelect: () => void;
}> = ({ user, userBusinesses, onSelect }) => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        border: `1.5px solid ${theme.palette.divider}`,
        borderLeft: `4px solid ${user.avatarColor}`,
        borderRadius: 2.5,
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: user.avatarColor,
          boxShadow: `0 6px 32px ${alpha(user.avatarColor, 0.14)}`,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardActionArea onClick={onSelect} sx={{ p: 0 }}>
        <Box display="flex" alignItems="center" px={3} py={2.75} gap={3}>
          {/* Avatar with online dot */}
          <Box position="relative" flexShrink={0}>
            <Avatar
              sx={{
                width: 72,
                height: 72,
                bgcolor: user.avatarColor,
                fontSize: '1.4rem',
                fontWeight: 800,
                boxShadow: `0 0 0 3px ${alpha(user.avatarColor, 0.15)}`,
              }}
            >
              {user.initials}
            </Avatar>
            <Box
              position="absolute"
              bottom={3}
              right={3}
              width={14}
              height={14}
              borderRadius="50%"
              bgcolor="success.main"
              border={`2px solid ${theme.palette.background.paper}`}
            />
          </Box>

          {/* Info */}
          <Box flex={1} minWidth={0}>
            <Typography variant="h6" fontWeight={700} lineHeight={1.25} mb={0.25}>
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1.5}>
              {user.title}
            </Typography>

            {/* Business chips */}
            <Box display="flex" gap={0.75} flexWrap="wrap">
              {userBusinesses.length === 0 ? (
                <Chip
                  label="No businesses yet"
                  size="small"
                  variant="outlined"
                  sx={{ fontStyle: 'italic', color: 'text.disabled', fontSize: '0.72rem', height: 24 }}
                />
              ) : (
                userBusinesses.map((b) => (
                  <Chip
                    key={b.id}
                    label={b.name}
                    size="small"
                    sx={{
                      height: 24,
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      bgcolor: alpha(b.logoColor, 0.1),
                      color: b.logoColor,
                      border: `1px solid ${alpha(b.logoColor, 0.25)}`,
                      '& .MuiChip-label': { px: 1 },
                    }}
                  />
                ))
              )}
            </Box>
          </Box>

          {/* Enter CTA */}
          <Box
            flexShrink={0}
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={0.5}
          >
            <Box
              display="flex"
              alignItems="center"
              gap={0.75}
              px={2}
              py={1}
              borderRadius={2}
              bgcolor={alpha(user.avatarColor, 0.08)}
              border={`1.5px solid ${alpha(user.avatarColor, 0.2)}`}
              sx={{ transition: 'all 0.15s ease' }}
            >
              <Typography
                variant="body2"
                fontWeight={700}
                sx={{ color: user.avatarColor, fontSize: '0.8rem' }}
              >
                Enter
              </Typography>
              <ArrowIcon sx={{ fontSize: 15, color: user.avatarColor }} />
            </Box>
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>
              {userBusinesses.length} {userBusinesses.length === 1 ? 'business' : 'businesses'}
            </Typography>
          </Box>
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

  const getUserBusinesses = (user: MockUser) =>
    businesses
      .filter((b) => user.businessIds.includes(b.id))
      .map((b) => ({ id: b.id, name: b.name, industry: b.industry, logoColor: b.logoColor }));

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
        <Box width="100%" maxWidth={760}>
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
          <Box display="flex" flexDirection="column" gap={2} mb={3}>
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                userBusinesses={getUserBusinesses(user)}
                onSelect={() => handleSelectUser(user)}
              />
            ))}
          </Box>

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
