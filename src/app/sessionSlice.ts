import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MockUser } from '../types';
import { mockUsers } from '../mock/users';

interface SessionState {
  currentUserId: string | null;
  users: MockUser[];
}

const initialState: SessionState = {
  currentUserId: mockUsers[0].id,
  users: mockUsers,
};

const avatarColors = [
  '#2563EB', '#7C3AED', '#059669', '#DC2626', '#D97706',
  '#0891B2', '#9333EA', '#16A34A', '#0369A1', '#C8702A',
];

function generateUserId(): string {
  return `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
}

function pickAvatarColor(existingUsers: MockUser[]): string {
  const used = new Set(existingUsers.map((u) => u.avatarColor));
  const available = avatarColors.filter((c) => !used.has(c));
  return available.length > 0
    ? available[0]
    : avatarColors[existingUsers.length % avatarColors.length];
}

function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    selectUser(state, action: PayloadAction<string>) {
      state.currentUserId = action.payload;
    },
    exitSession(state) {
      state.currentUserId = null;
    },
    createUser(
      state,
      action: PayloadAction<{ name: string; title: string }>
    ) {
      const { name, title } = action.payload;
      const newUser: MockUser = {
        id: generateUserId(),
        name: name.trim(),
        title: title.trim() || 'Business Owner',
        initials: deriveInitials(name),
        avatarColor: pickAvatarColor(state.users),
        businessIds: [],
      };
      state.users.push(newUser);
      state.currentUserId = newUser.id;
    },
    addBusinessToUser(
      state,
      action: PayloadAction<{ userId: string; businessId: string }>
    ) {
      const user = state.users.find((u) => u.id === action.payload.userId);
      if (user && !user.businessIds.includes(action.payload.businessId)) {
        user.businessIds.push(action.payload.businessId);
      }
    },
  },
});

export const { selectUser, exitSession, createUser, addBusinessToUser } = sessionSlice.actions;
export default sessionSlice.reducer;
