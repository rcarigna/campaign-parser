import { Box, Button, Typography, TypographyProps } from '@mui/material';
import { styled } from '@mui/material/styles';

// Panel/Section Container
export const SectionContainer = styled(Box)(({ theme }) => ({
    background: `linear-gradient(135deg, ${theme.palette.background.paper} 60%, ${theme.palette.primary.main} 100%)`,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(4),
    marginBottom: theme.spacing(3),
}));

// Themed Button
export const ThemedButton = styled(Button)(({ theme }) => ({
    padding: `${theme.spacing(1.5)} ${theme.spacing(3)}`,
    background: theme.palette.primary.main,
    color: theme.palette.text.primary,
    borderRadius: theme.shape.borderRadius,
    fontWeight: 500,
    fontSize: theme.typography.button.fontSize,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    transition: 'background 0.2s',
    '&:hover': {
        background: theme.palette.primary.dark || theme.palette.primary.main,
    },
    '&.Mui-disabled': {
        background: theme.palette.action.disabledBackground,
        color: theme.palette.action.disabled,
        cursor: 'not-allowed',
    },
}));

// Header Typography
export const SectionTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
    fontWeight: 600,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(3),
}));

// Spinner/Loader
export const ThemedSpinner = styled(Box)(({ theme }) => ({
    animation: 'spin 1s linear infinite',
    borderRadius: '50%',
    height: 16,
    width: 16,
    borderBottom: `2px solid ${theme.palette.common.white}`,
    '@keyframes spin': {
        to: { transform: 'rotate(360deg)' },
    },
}));

// Centered Flex Box
export const FlexCenter = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});
