import { createTheme } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'

const MINT_GREEN = '#A2E4B8';
const PASTEL_YELLOW = '#FFFFE0';
const CHARCOAL_GRAY = '#4A4A4A';

const theme = createTheme({
    palette: {
        primary: {
            main: MINT_GREEN, // ミントグリーン
            contrastText: CHARCOAL_GRAY, // チャコールグレー
        },
        secondary: {
            main: PASTEL_YELLOW, // パステルイエロー
            contrastText: CHARCOAL_GRAY, // チャコールグレー
        },
        background: {
            default: '#F8F8F8', // オフホワイト
            paper: '#F0FAF3', // ミントグリーン
        },
        text: {
            primary: '#4A4A4A', // チャコールグレー
            secondary: '#757575', // グレー
        },
        divider: alpha(MINT_GREEN, 0.5) ,
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      h6: {
        fontWeight: 600,
      }
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => ({ // themeオブジェクトにアクセスできるコールバック形式
            backgroundColor: theme.palette.common.white,
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
              borderWidth: '2px',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.text.secondary,
            },
          }),
        },
      },
      MuiButton: {
        styleOverrides: {
          // variant="contained" かつ color="primary" のボタン (ミントグリーン)
          containedPrimary: {
            '&:hover': {
              backgroundColor: alpha(MINT_GREEN, 0.8), // ホバー時に少し暗くする (元の色の80%の濃さのイメージ)
            },
          },
          // variant="contained" かつ color="secondary" のボタン (パステルイエロー)
          containedSecondary: {
            '&:hover': {
              backgroundColor: '#F2F2BF', // パステルイエローを少しだけ暗くした色
            },
          },
          // variant="outlined" かつ color="primary" のボタン
          outlinedPrimary: {
            '&:hover': {
              backgroundColor: alpha(MINT_GREEN, 0.08), // ホバー時にミントグリーンを薄く背景に敷く
              borderColor: MINT_GREEN, // 枠線の色も維持
            },
          },
          outlinedSecondary: {
            '&:hover': {
              backgroundColor: alpha(PASTEL_YELLOW, 0.08), // ホバー時にパステルイエローを薄く背景に敷く
              borderColor: PASTEL_YELLOW, // 枠線の色も維持
            },
          },
        },
      },
    },
})

export default theme