import { createMuiTheme } from "@material-ui/core"

const theme = createMuiTheme({
    typography: {
        fontFamily: 'Nunito',
        h6: {
            fontWeight: 700,
        },
    },
    palette: {
        primary: {
            light: '#4fc3f7',
            main: '#03a9f4',
        },
        action: {
            disabled: '#a3e2ff'
        }
    },
    overrides: {
        MuiTypography : {
            root: {
                color: '#3f3844',
            },
            colorPrimary: {
                color: '#03a9f4'
            },
            colorTextSecondary: {
                color: '#FD6A02'
            }
        },
        MuiButton: {
            root : {
                textTransform: "none",
                fontSize: '1rem',
                fontWeight: '900'
            },
            containedPrimary: {
                color: '#ffffff',
            },
        }
    },
    props: {
        MuiLink: {
            underline: 'none',
        },
    }
})

export default theme