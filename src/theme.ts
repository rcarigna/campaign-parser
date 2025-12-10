import { createTheme } from '@mui/material/styles';

// Augment MUI palette type to include 'lighter' shades
declare module '@mui/material/styles' {
  interface PaletteColor {
    lighter?: string;
  }
  interface SimplePaletteColorOptions {
    lighter?: string;
  }
}

const underdark = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#807596' },
        secondary: { main: '#637089' },
        success: {
            main: '#4caf50',
            light: '#81c784',
            lighter: '#1b5e20',
        },
        error: {
            main: '#f44336',
            light: '#e57373',
            lighter: '#b71c1c',
        },
        info: {
            main: '#2196f3',
            light: '#64b5f6',
            lighter: '#0d47a1',
        },
        background: {
            default: '#16171d',
            paper: '#23232B',      // a bit brighter so the gradient shows
        },
        text: {
            primary: '#f1f1f5',
            secondary: '#a3a3b0',
        },
        divider: 'rgba(255,255,255,0.08)',
    },

    shape: { borderRadius: 10 },

    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#23232B', // or use palette: backgroundColor: 'inherit'
                    border: '1px solid rgba(255,255,255,0.08)',
                    backgroundImage: `
                    linear-gradient(
                        to bottom,
                        rgba(255, 255, 255, 0.03) 0%,
                        rgba(110, 100, 125, 0.06) 35%,
                        rgba(0, 0, 0, 0.12) 100%
                    )
                    `,

                    boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
                },
            },
        },

        MuiCard: {
            styleOverrides: {
                root: {
                    // make cards match papers
                    backgroundColor: '#23232B',
                },
            },
        },

        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    background: `
            linear-gradient(
              to right,
              rgba(64,57,75,0.25) 0%,
              rgba(30,26,37,0.1) 100%
            )
          `,
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                },
            },
        },
    },
});

export default underdark;
