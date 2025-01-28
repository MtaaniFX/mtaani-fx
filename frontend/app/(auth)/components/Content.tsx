import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LockIcon from '@mui/icons-material/Lock';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import WidgetsIcon from '@mui/icons-material/Widgets';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import {FaviconRow} from '@/components/internal/icons/Favicon'

const highlights = [
  {
    icon: <TrendingUpIcon sx={{ color: 'text.secondary' }} />,
    title: 'High Returns on Investments',
    description: 'Earn competitive interest rates on your principal, growing your wealth faster.',
  },
  {
    icon: <LockIcon sx={{ color: 'text.secondary' }} />,
    title: 'Secure and Reliable',
    description: 'We use top-tier encryption and security measures to protect your funds.',
  },
  {
    icon: <AccountCircleIcon sx={{ color: 'text.secondary' }} />,
    title: 'Easy Account Management',
    description: 'User-friendly interface for seamless tracking and managing of your investments.',
  },
  {
    icon: <WidgetsIcon sx={{ color: 'text.secondary' }} />,
    title: 'Diversified Investment Options',
    description: 'Choose from various investment plans tailored to your preferences and goals.',
  },
  {
    icon: <VisibilityIcon sx={{ color: 'text.secondary' }} />,
    title: 'Transparent Fees',
    description: 'No hidden fees—know exactly what you\'re paying and how your returns are calculated.',
  },
  {
    icon: <SupportAgentIcon sx={{ color: 'text.secondary' }} />,
    title: '24/7 Customer Support',
    description: 'Reach out anytime for assistance with expert support available around the clock.',
  },
];

export default function Content() {
  return (
    <Stack
      sx={{ flexDirection: 'column', alignSelf: 'center', gap: 4, maxWidth: 450 }}
    >
      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
        <FaviconRow/>
      </Box>
      {highlights.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          {item.icon}
          <div>
            <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}
