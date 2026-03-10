import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Button,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import {
  SmartToy as AIIcon,
  Person as PersonIcon,
  Send as SendIcon,
  AutoAwesome as SparkleIcon,
} from '@mui/icons-material';
import PageHeader from '../../shared/components/PageHeader';
import { useAppSelector } from '../../app/hooks';
import { mockBusinesses } from '../../mock/businesses';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const initialMessages: Message[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content:
      "Hello! I'm your AI business assistant. I can help you interpret your simulation results, structure your business setup, understand your financial metrics, and plan your launch steps. What would you like to explore today?",
    timestamp: 'Now',
  },
];

const suggestedPrompts = [
  'Explain my current profit margin and how to improve it',
  'What are the biggest risks in my current business model?',
  'Suggest ways to reduce operating costs',
  'Help me understand my break-even point',
  'What should I prioritize before launch?',
];

const AIAssistantPage: React.FC = () => {
  const { activeBusinessId } = useAppSelector((s) => s.business);
  const activeBusiness = mockBusinesses.find((b) => b.id === activeBusinessId);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: `msg-${messages.length + 1}`,
      role: 'user',
      content: input.trim(),
      timestamp: 'Just now',
    };
    const aiResponse: Message = {
      id: `msg-${messages.length + 2}`,
      role: 'assistant',
      content:
        'This is a placeholder response. In the full product, the AI assistant will analyze your business data and provide tailored insights, recommendations, and explanations based on your specific context.',
      timestamp: 'Just now',
    };
    setMessages((prev) => [...prev, userMsg, aiResponse]);
    setInput('');
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <Box>
      <PageHeader
        title="AI Assistant"
        description="Get intelligent guidance on your business model, simulation results, and operations."
        actions={
          <Chip
            icon={<SparkleIcon sx={{ fontSize: '14px !important' }} />}
            label="Context-aware"
            size="small"
            color="secondary"
            variant="outlined"
          />
        }
      />

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ display: 'flex', flexDirection: 'column', height: 560 }}>
            <Box px={2} py={1.5} borderBottom="1px solid" borderColor="divider">
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar sx={{ width: 28, height: 28, bgcolor: 'secondary.main' }}>
                  <AIIcon sx={{ fontSize: 16 }} />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600}>
                    SMB AI Assistant
                  </Typography>
                  {activeBusiness && (
                    <Typography variant="caption" color="text.secondary">
                      Context: {activeBusiness.name}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>

            <Box flex={1} overflow="auto" p={2} display="flex" flexDirection="column" gap={1.5}>
              {messages.map((msg) => (
                <Box
                  key={msg.id}
                  display="flex"
                  gap={1.5}
                  flexDirection={msg.role === 'user' ? 'row-reverse' : 'row'}
                  alignItems="flex-start"
                >
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      bgcolor: msg.role === 'assistant' ? 'secondary.main' : 'primary.main',
                      flexShrink: 0,
                    }}
                  >
                    {msg.role === 'assistant' ? (
                      <AIIcon sx={{ fontSize: 14 }} />
                    ) : (
                      <PersonIcon sx={{ fontSize: 14 }} />
                    )}
                  </Avatar>
                  <Box
                    maxWidth="80%"
                    px={2}
                    py={1.25}
                    borderRadius={2}
                    bgcolor={msg.role === 'user' ? 'primary.main' : 'grey.100'}
                    color={msg.role === 'user' ? 'primary.contrastText' : 'text.primary'}
                  >
                    <Typography variant="body2" lineHeight={1.6}>
                      {msg.content}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ opacity: 0.6, display: 'block', mt: 0.25, fontSize: '0.65rem' }}
                    >
                      {msg.timestamp}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Divider />
            <Box p={2} display="flex" gap={1}>
              <TextField
                fullWidth
                size="small"
                placeholder="Ask about your business..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                multiline
                maxRows={3}
              />
              <Button
                variant="contained"
                size="small"
                onClick={handleSend}
                disabled={!input.trim()}
                sx={{ px: 2, alignSelf: 'flex-end' }}
              >
                <SendIcon fontSize="small" />
              </Button>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" fontWeight={600} mb={1.5}>
                Suggested Questions
              </Typography>
              <Box display="flex" flexDirection="column" gap={0.75}>
                {suggestedPrompts.map((prompt, idx) => (
                  <Button
                    key={idx}
                    variant="outlined"
                    size="small"
                    onClick={() => handlePromptClick(prompt)}
                    sx={{
                      textAlign: 'left',
                      justifyContent: 'flex-start',
                      whiteSpace: 'normal',
                      fontWeight: 400,
                      lineHeight: 1.4,
                      py: 0.75,
                      fontSize: '0.8rem',
                    }}
                  >
                    {prompt}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="subtitle2" fontWeight={600} mb={1.5}>
                AI Capabilities
              </Typography>
              <List disablePadding dense>
                {[
                  'Interpret simulation outputs',
                  'Structure business setup',
                  'Explain analytics & metrics',
                  'Launch planning guidance',
                  'Operational recommendations',
                  'Financial diagnostics',
                ].map((cap, idx) => (
                  <ListItem key={idx} disablePadding sx={{ py: 0.3 }}>
                    <ListItemAvatar sx={{ minWidth: 24 }}>
                      <SparkleIcon sx={{ fontSize: 12, color: 'secondary.main' }} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography variant="body2" color="text.secondary">{cap}</Typography>}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AIAssistantPage;
