import { createTheme } from '@mui/material/styles'

// カスタムカラーの型定義
declare module '@mui/material/styles' {
    interface Palette {
        custom: {
            peachPink: string
            charcoalGray: string
            mintGreen: string
            pastelYellow: string
            offWhite: string
        }
    }
    interface PaletteOptions {
        custom?: {
            peachPink?: string
            charcoalGray?: string
            mintGreen?: string
            pastelYellow?: string
            offWhite?: string
        }
    }
}

const theme = createTheme({
    palette: {
        primary: {
            main: '#7BCF8A', // ミントグリーンを少し濃くしてコントラスト向上
            light: '#A2E4B8', // 元のミントグリーンをlightに
            dark: '#5BBF7A', // より濃いミントグリーン
            contrastText: '#2A2A2A', // チャコールグレーをより濃く
        },
        secondary: {
            main: '#FFE066', // パステルイエローを少し濃くしてコントラスト向上
            light: '#FFFFE0', // 元のパステルイエローをlightに
            dark: '#FFD54F', // より濃いパステルイエロー
            contrastText: '#2A2A2A', // チャコールグレーをより濃く
        },
        background: {
            default: '#F5F5F5', // オフホワイトを少し濃く
            paper: '#FFFFFF', // カード背景を純白にしてコントラスト向上
        },
        text: {
            primary: '#2A2A2A', // チャコールグレーをより濃く
            secondary: '#5A5A5A', // セカンダリーテキストも濃く
        },
        // カスタムカラー
        custom: {
            peachPink: '#FFDAB9', // ピーチピンク
            charcoalGray: '#2A2A2A', // より濃いチャコールグレー
            mintGreen: '#7BCF8A', // より濃いミントグリーン
            pastelYellow: '#FFE066', // より濃いパステルイエロー
            offWhite: '#F5F5F5', // より濃いオフホワイト
        },
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
        h1: {
            fontWeight: 700,
            color: '#2A2A2A',
        },
        h2: {
            fontWeight: 700,
            color: '#2A2A2A',
        },
        h3: {
            fontWeight: 600,
            color: '#2A2A2A',
        },
        h4: {
            fontWeight: 600,
            color: '#2A2A2A',
        },
        h5: {
            fontWeight: 600,
            color: '#2A2A2A',
        },
        h6: {
            fontWeight: 600,
            color: '#2A2A2A',
        },
        body1: {
            color: '#2A2A2A',
        },
        body2: {
            color: '#2A2A2A',
        },
    },
    components: {
        // ヘッダー用のAppBarスタイル
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#7BCF8A',
                    color: '#2A2A2A',
                    boxShadow: '0 2px 8px rgba(123, 207, 138, 0.3)',
                },
            },
        },
        // カードUIのスタイル
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #A2E4B8',
                    boxShadow: '0 3px 6px rgba(162, 228, 184, 0.2)',
                },
            },
        },
        // ボタンのスタイル
        MuiButton: {
            styleOverrides: {
                // 主要アクションボタン
                contained: {
                    backgroundColor: '#FFB74D', // より濃いオレンジ色で視認性向上
                    color: '#FFFFFF', // 白文字でコントラスト最大化
                    boxShadow: '0 3px 6px rgba(255, 183, 77, 0.4)',
                    fontWeight: 600,
                    '&:hover': {
                        backgroundColor: '#FF9800',
                        boxShadow: '0 4px 8px rgba(255, 183, 77, 0.5)',
                    },
                },
                // サブアクションボタン
                containedPrimary: {
                    backgroundColor: '#66BB6A', // より濃いグリーンで視認性向上
                    color: '#FFFFFF', // 白文字でコントラスト最大化
                    boxShadow: '0 3px 6px rgba(102, 187, 106, 0.4)',
                    fontWeight: 600,
                    '&:hover': {
                        backgroundColor: '#4CAF50',
                        boxShadow: '0 4px 8px rgba(102, 187, 106, 0.5)',
                    },
                },
                // 控えめなボタン
                outlined: {
                    borderColor: '#66BB6A', // より濃いグリーン
                    color: '#66BB6A', // より濃いグリーン
                    borderWidth: '2px',
                    fontWeight: 500,
                    '&:hover': {
                        backgroundColor: 'rgba(102, 187, 106, 0.1)',
                        borderColor: '#4CAF50',
                        borderWidth: '2px',
                    },
                },
                // テキストボタン
                text: {
                    color: '#2A2A2A',
                    fontWeight: 500,
                    '&:hover': {
                        backgroundColor: 'rgba(102, 187, 106, 0.1)',
                    },
                },
            },
        },
        // テキストフィールドのスタイル
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: '#FFFFFF',
                        '& fieldset': {
                            borderColor: '#A2E4B8',
                            borderWidth: '2px',
                        },
                        '&:hover fieldset': {
                            borderColor: '#7BCF8A',
                            borderWidth: '2px',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#7BCF8A',
                            borderWidth: '2px',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#5A5A5A',
                        '&.Mui-focused': {
                            color: '#7BCF8A',
                        },
                    },
                },
            },
        },
        // ダイアログのスタイル
        MuiDialog: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #A2E4B8',
                    boxShadow: '0 8px 32px rgba(162, 228, 184, 0.3)',
                },
            },
        },
        // チップのスタイル
        MuiChip: {
            styleOverrides: {
                root: {
                    backgroundColor: '#A2E4B8',
                    color: '#2A2A2A',
                    fontWeight: 500,
                    '&:hover': {
                        backgroundColor: '#7BCF8A',
                        boxShadow: '0 2px 4px rgba(123, 207, 138, 0.3)',
                    },
                },
            },
        },
        // アイコンのスタイル
        MuiSvgIcon: {
            styleOverrides: {
                root: {
                    color: '#2A2A2A',
                },
            },
        },
        // リンクのスタイル
        MuiLink: {
            styleOverrides: {
                root: {
                    color: '#7BCF8A',
                    fontWeight: 500,
                    '&:hover': {
                        color: '#5BBF7A',
                        textDecoration: 'underline',
                    },
                },
            },
        },
        // 区切り線のスタイル
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: '#A2E4B8',
                    borderWidth: '1px',
                },
            },
        },
    },
})

export default theme