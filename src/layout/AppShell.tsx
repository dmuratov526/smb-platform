import React from 'react';
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import GettingStartedChecklist from '../features/journey/GettingStartedChecklist';

const SIDEBAR_WIDTH = 260;

const AppShell: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <TopBar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar sx={{ minHeight: '60px !important' }} />
        <Box
          sx={{
            flex: 1,
            p: 3,
            maxWidth: 1400,
            width: '100%',
            mx: 'auto',
            boxSizing: 'border-box',
          }}
        >
          <Outlet />
        </Box>
      </Box>
      <GettingStartedChecklist />
    </Box>
  );
};

export default AppShell;
