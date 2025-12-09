import { createTheme } from '@mui/material/styles';

const underdark = createTheme({
    palette: {
        mode: 'dark',

        primary: {
            main: '#6b5f7e', // muted amethyst-gray (no neon)
        },
        secondary: {
            main: '#556275', // muted steel-indigo
        },

        background: {
            default: '#0b0c10', // deep charcoal/obsidian
            paper: '#111216',   // slightly raised panel
        },

        text: {
            primary: '#e5e5ea',   // soft neutral-lilac white
            secondary: '#9b9ba5', // muted lavender-gray
            disabled: '#6a6a72',
        },

        divider: 'rgba(255,255,255,0.08)', // faint graphite line
    },

    typography: {
        fontFamily: [
            'var(--font-geist-sans)',
            'Geist',
            'Inter',
            'Arial',
            'sans-serif',
        ].join(','),

        h1: { fontWeight: 600, letterSpacing: '0.02em' },
        h2: { fontWeight: 600, letterSpacing: '0.02em' },
        h3: { fontWeight: 600 },
        button: { textTransform: 'none', fontWeight: 600 },
    },

    shape: {
        borderRadius: 8,
    },

    components: {
        // Subtle gradient header (A2 aesthetic)
        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    padding: '20px 24px 16px 24px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    background: `linear-gradient(
                        to right,
                        #342b3e 0%,
                        #1e1a25 100%
                    )`,
                },
            },
        },

        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#111216',
                    border: '1px solid rgba(255,255,255,0.06)', // subtle hairline
                    boxShadow: '0 2px 16px rgba(0,0,0,0.4)',     // clean, modern
                },
            },
        },

        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#111216',
                    border: '1px solid rgba(255,255,255,0.06)',
                },
            },
        },

        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: '#14141c',
                        '& fieldset': {
                            borderColor: 'rgba(255,255,255,0.12)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(255,255,255,0.22)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#6b5f7e',       // muted amethyst
                        },
                    },
                },
            },
        },

        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                },
                containedPrimary: {
                    background: `linear-gradient(to bottom, #3e3a44, #2e2a33)`,
                    color: '#e5e5ea',
                    '&:hover': {
                        background: `linear-gradient(to bottom, #4b4652, #35303a)`,
                    },
                },
                outlinedPrimary: {
                    borderColor: 'rgba(255,255,255,0.20)',
                    color: '#e5e5ea',
                    '&:hover': {
                        borderColor: 'rgba(255,255,255,0.35)',
                    },
                },
            },
        },

        MuiTabs: {
            styleOverrides: {
                indicator: {
                    backgroundColor: '#6b5f7e', // muted amethyst
                },
            },
        },

        MuiChip: {
            styleOverrides: {
                root: {
                    backgroundColor: '#181822',
                    color: '#c9c9d1',
                    border: '1px solid rgba(255,255,255,0.08)',
                    fontWeight: 500,
                },
            },
        },
    },
});

export default underdark;
