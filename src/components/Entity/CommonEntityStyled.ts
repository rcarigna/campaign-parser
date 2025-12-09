import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const EntityGridContainer = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(6),
    [theme.breakpoints.up('md')]: {
        gridTemplateColumns: 'repeat(3, 1fr)',
    },
    [theme.breakpoints.up('lg')]: {
        gridTemplateColumns: 'repeat(6, 1fr)',
    },
}));

export const EntityCardContainer = styled(Box)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    padding: theme.spacing(2),
    transition: 'box-shadow 0.2s, border-color 0.2s',
    cursor: 'pointer',
    '&.selected': {
        borderColor: theme.palette.primary.main,
        boxShadow: theme.shadows[4],
    },
    '&:hover': {
        boxShadow: theme.shadows[3],
    },
}));
