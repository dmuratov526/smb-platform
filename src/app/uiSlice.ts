import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Alert } from '../types';
import { mockAlerts } from '../mock/dashboard';

interface UiState {
  sidebarOpen: boolean;
  notifications: Alert[];
}

const initialState: UiState = {
  sidebarOpen: true,
  notifications: mockAlerts,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    markNotificationRead(state, action: PayloadAction<string>) {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markAllNotificationsRead(state) {
      state.notifications.forEach((n) => {
        n.read = true;
      });
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  markNotificationRead,
  markAllNotificationsRead,
} = uiSlice.actions;
export default uiSlice.reducer;
