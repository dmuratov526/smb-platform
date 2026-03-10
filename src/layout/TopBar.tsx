import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  InputBase,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Select,
  SelectChangeEvent,
  Divider,
  Chip,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  NotificationsOutlined as NotificationsIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Circle as CircleIcon,
  CheckCircleOutline as CheckIcon,
  WarningAmber as WarningIcon,
  ErrorOutline as ErrorOutlineIcon,
  InfoOutlined as InfoIcon,
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setActiveBusiness } from '../app/businessSlice';
import { markAllNotificationsRead } from '../app/uiSlice';
import { AlertSeverity } from '../types';

const SIDEBAR_WIDTH = 260;

const severityIcon: Record<AlertSeverity, React.ReactNode> = {
  success: <CheckIcon fontSize="small" color="success" />,
  warning: <WarningIcon fontSize="small" color="warning" />,
  error: <ErrorOutlineIcon fontSize="small" color="error" />,
  info: <InfoIcon fontSize="small" color="info" />,
};

const TopBar: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { businesses, activeBusinessId } = useAppSelector((s) => s.business);
  const { notifications } = useAppSelector((s) => s.ui);

  const [notifAnchor, setNotifAnchor] = useState<HTMLElement | null>(null);
  const [profileAnchor, setProfileAnchor] = useState<HTMLElement | null>(null);

  const activeBusiness = businesses.find((b) => b.id === activeBusinessId);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleBusinessChange = (e: SelectChangeEvent<string>) => {
    dispatch(setActiveBusiness(e.target.value));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsRead());
  };

  const statusColor: Record<string, string> = {
    active: theme.palette.success.main,
    draft: theme.palette.warning.main,
    paused: theme.palette.text.secondary,
    archived: theme.palette.error.main,
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
        ml: `${SIDEBAR_WIDTH}px`,
        bgcolor: 'background.paper',
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: 'text.primary',
        zIndex: theme.zIndex.drawer - 1,
      }}
    >
      <Toolbar sx={{ gap: 2, minHeight: '60px !important', px: 3 }}>
        {/* Business Switcher */}
        <Box display="flex" alignItems="center" gap={1} mr={1}>
          {activeBusiness && (
            <Box
              width={28}
              height={28}
              borderRadius={1}
              bgcolor={activeBusiness.logoColor}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
            >
              <Typography variant="caption" fontWeight={700} color="#fff" fontSize="0.65rem">
                {activeBusiness.name.slice(0, 2).toUpperCase()}
              </Typography>
            </Box>
          )}
          <Select
            value={activeBusinessId}
            onChange={handleBusinessChange}
            variant="standard"
            disableUnderline
            IconComponent={ArrowDownIcon}
            sx={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'text.primary',
              minWidth: 160,
              '& .MuiSelect-select': { pr: '28px !important' },
              '& .MuiSelect-icon': { color: 'text.secondary', right: 0 },
            }}
          >
            {businesses.map((b) => (
              <MenuItem key={b.id} value={b.id}>
                <Box display="flex" alignItems="center" gap={1}>
                  <CircleIcon
                    sx={{ fontSize: 8, color: statusColor[b.status] ?? 'grey.400' }}
                  />
                  <Typography variant="body2" fontWeight={500}>
                    {b.name}
                  </Typography>
                  <Chip
                    label={b.status}
                    size="small"
                    sx={{
                      height: 16,
                      fontSize: '0.6rem',
                      fontWeight: 600,
                      textTransform: 'capitalize',
                      '& .MuiChip-label': { px: 0.75 },
                    }}
                  />
                </Box>
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Search */}
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          px={1.5}
          py={0.75}
          borderRadius={2}
          bgcolor={alpha(theme.palette.text.primary, 0.04)}
          sx={{
            '&:focus-within': {
              bgcolor: alpha(theme.palette.primary.main, 0.06),
              outline: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
            },
            transition: 'all 0.15s',
          }}
          flex={1}
          maxWidth={380}
        >
          <SearchIcon sx={{ color: 'text.disabled', fontSize: 18 }} />
          <InputBase
            placeholder="Search anything..."
            sx={{ fontSize: '0.875rem', color: 'text.primary', flex: 1 }}
          />
        </Box>

        <Box flex={1} />

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton
            size="small"
            onClick={(e) => setNotifAnchor(e.currentTarget)}
            sx={{ color: 'text.secondary' }}
          >
            <Badge badgeContent={unreadCount} color="error" max={9}>
              <NotificationsIcon fontSize="small" />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Profile */}
        <Tooltip title="Account">
          <IconButton
            size="small"
            onClick={(e) => setProfileAnchor(e.currentTarget)}
            sx={{ p: 0 }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: theme.palette.primary.main,
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              JD
            </Avatar>
          </IconButton>
        </Tooltip>

        {/* Notifications Popover */}
        <Popover
          open={Boolean(notifAnchor)}
          anchorEl={notifAnchor}
          onClose={() => setNotifAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{ sx: { width: 360, borderRadius: 2, mt: 1 } }}
        >
          <Box px={2} py={1.5} display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle2" fontWeight={600}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Button size="small" onClick={handleMarkAllRead} sx={{ fontSize: '0.75rem' }}>
                Mark all read
              </Button>
            )}
          </Box>
          <Divider />
          <List dense disablePadding sx={{ maxHeight: 360, overflowY: 'auto' }}>
            {notifications.slice(0, 8).map((n) => (
              <ListItem
                key={n.id}
                sx={{
                  px: 2,
                  py: 1,
                  bgcolor: n.read ? 'transparent' : alpha(theme.palette.primary.main, 0.04),
                  '&:not(:last-child)': { borderBottom: `1px solid ${theme.palette.divider}` },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  {severityIcon[n.severity]}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={n.read ? 400 : 600} noWrap>
                      {n.title}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                      {n.message.length > 72 ? n.message.slice(0, 72) + '…' : n.message}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
            {notifications.length === 0 && (
              <ListItem sx={{ py: 3, justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No notifications
                </Typography>
              </ListItem>
            )}
          </List>
        </Popover>

        {/* Profile Menu */}
        <Menu
          anchorEl={profileAnchor}
          open={Boolean(profileAnchor)}
          onClose={() => setProfileAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{ sx: { width: 200, borderRadius: 2, mt: 1 } }}
        >
          <Box px={2} py={1.5}>
            <Typography variant="subtitle2" fontWeight={600}>
              Jamie Doe
            </Typography>
            <Typography variant="caption" color="text.secondary">
              jamie@smbplatform.io
            </Typography>
          </Box>
          <Divider />
          <MenuItem dense>Profile</MenuItem>
          <MenuItem dense>Workspace Settings</MenuItem>
          <Divider />
          <MenuItem dense sx={{ color: 'error.main' }}>
            Sign out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
