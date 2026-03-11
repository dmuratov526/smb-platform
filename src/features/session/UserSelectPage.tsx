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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  InputAdornment,
} from '@mui/material';
import {
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

  const features = [
    { icon: '🏗️', title: 'Business Builder', desc: 'Design your model, revenue streams, team, and strategy in one structured workspace.' },
    { icon: '📊', title: 'Business Simulator', desc: 'Test financial assumptions. Find your break-even. Validate before you invest.' },
    { icon: '🚀', title: 'Launch Planner', desc: 'Turn your validated model into an action plan with milestones and task tracking.' },
    { icon: '⚙️', title: 'Operations Hub', desc: 'Manage daily workflows, recurring tasks, and operational issues post-launch.' },
    { icon: '💡', title: 'AI Assistant', desc: 'Get contextual business guidance, recommendations, and insights on demand.' },
    { icon: '📈', title: 'Analytics & Finance', desc: 'Track revenue, expenses, KPIs, and growth trends across your entire business.' },
  ];

  return (
    <>
    <Box minHeight="100vh" display="flex" flexDirection="column" bgcolor="#080C14">

      {/* ── Hero section ── */}
      <Box
        position="relative"
        overflow="hidden"
        sx={{
          background: 'linear-gradient(160deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)',
          pt: { xs: 6, md: 8 },
          pb: { xs: 5, md: 7 },
        }}
      >
        {/* Decorative glows */}
        <Box sx={{ position: 'absolute', top: -120, left: '20%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -100, right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', top: '30%', right: '25%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <Box maxWidth={900} mx="auto" px={3} position="relative">
          {/* Logo */}
          <Box display="flex" alignItems="center" gap={1.5} mb={5}>
            <Box width={38} height={38} borderRadius={2} sx={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 0 20px rgba(99,102,241,0.5)' }} display="flex" alignItems="center" justifyContent="center">
              <Typography fontWeight={900} sx={{ color: '#fff', fontSize: '0.75rem', letterSpacing: '0.02em' }}>SMB</Typography>
            </Box>
            <Box>
              <Typography fontWeight={800} sx={{ color: '#F8FAFC', fontSize: '0.95rem', lineHeight: 1.2 }}>SMB Platform</Typography>
              <Typography sx={{ color: alpha('#94A3B8', 0.7), fontSize: '0.68rem' }}>Business Operating System</Typography>
            </Box>
          </Box>

          {/* Hero copy */}
          <Box textAlign="center" mb={2}>
            <Box display="inline-flex" alignItems="center" gap={1} px={2} py={0.6} mb={3} borderRadius={10}
              sx={{ background: alpha('#6366F1', 0.15), border: `1px solid ${alpha('#6366F1', 0.3)}` }}>
              <Box width={6} height={6} borderRadius="50%" bgcolor="#818CF8" sx={{ animation: 'pulse 2s infinite', '@keyframes pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.4 } } }} />
              <Typography sx={{ color: '#A5B4FC', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em' }}>
                YOUR COMPLETE BUSINESS OS
              </Typography>
            </Box>
            <Typography
              fontWeight={900}
              sx={{
                color: '#F8FAFC',
                fontSize: { xs: '2rem', md: '2.8rem' },
                lineHeight: 1.15,
                letterSpacing: '-0.04em',
                mb: 2,
                background: 'linear-gradient(135deg, #F8FAFC 30%, #A5B4FC 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Build. Simulate. Launch.<br />Run your business.
            </Typography>
            <Typography sx={{ color: alpha('#94A3B8', 0.85), fontSize: '1.05rem', maxWidth: 520, mx: 'auto', lineHeight: 1.65 }}>
              The only platform that takes you from idea to operations — design your model, test assumptions, plan your launch, and manage everything in one place.
            </Typography>
          </Box>

          {/* Feature pills */}
          <Box display="flex" flexWrap="wrap" gap={1} justifyContent="center" mt={3.5}>
            {['Business Builder', 'Financial Simulator', 'Launch Planner', 'Operations Hub', 'AI Assistant', 'Analytics'].map((f) => (
              <Box key={f} px={1.5} py={0.5} borderRadius={1.5}
                sx={{ background: alpha('#1E293B', 0.8), border: `1px solid ${alpha('#334155', 0.8)}` }}>
                <Typography sx={{ color: '#94A3B8', fontSize: '0.72rem', fontWeight: 600 }}>{f}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ── Select workspace section ── */}
      <Box flex={1} py={{ xs: 5, md: 6 }} px={3} sx={{ background: 'linear-gradient(180deg, #0A0F1E 0%, #080C14 100%)' }}>
        <Box maxWidth={760} mx="auto">
          <Box textAlign="center" mb={4}>
            <Typography fontWeight={800} sx={{ color: '#F8FAFC', fontSize: '1.4rem', letterSpacing: '-0.02em', mb: 0.75 }}>
              Select your workspace
            </Typography>
            <Typography sx={{ color: alpha('#94A3B8', 0.7), fontSize: '0.9rem' }}>
              Each workspace has its own businesses, data, and configurations.
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

          {/* Create new */}
          <Box display="flex" justifyContent="center" mb={6}>
            <Button
              variant="outlined"
              size="medium"
              startIcon={<PersonAddIcon />}
              onClick={handleOpenDialog}
              sx={{
                borderRadius: 2, fontWeight: 600, px: 3,
                borderColor: alpha('#475569', 0.6),
                color: '#94A3B8',
                '&:hover': { borderColor: '#6366F1', color: '#A5B4FC', bgcolor: alpha('#6366F1', 0.06) },
              }}
            >
              Create New Workspace
            </Button>
          </Box>

          {/* Feature grid */}
          <Box mb={2}>
            <Typography textAlign="center" fontWeight={700} sx={{ color: alpha('#94A3B8', 0.5), fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', mb: 3 }}>
              Everything you need to run a business
            </Typography>
            <Grid container spacing={1.5}>
              {features.map((f) => (
                <Grid item xs={12} sm={6} md={4} key={f.title}>
                  <Box
                    p={2}
                    borderRadius={2}
                    sx={{
                      background: alpha('#1E293B', 0.5),
                      border: `1px solid ${alpha('#334155', 0.6)}`,
                      transition: 'all 0.2s',
                      '&:hover': { background: alpha('#1E293B', 0.8), borderColor: alpha('#6366F1', 0.3) },
                    }}
                  >
                    <Typography sx={{ fontSize: '1.4rem', mb: 0.75, lineHeight: 1 }}>{f.icon}</Typography>
                    <Typography fontWeight={700} sx={{ color: '#E2E8F0', fontSize: '0.85rem', mb: 0.4 }}>{f.title}</Typography>
                    <Typography sx={{ color: alpha('#94A3B8', 0.7), fontSize: '0.75rem', lineHeight: 1.5 }}>{f.desc}</Typography>
                  </Box>
                </Grid>
              ))}
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
