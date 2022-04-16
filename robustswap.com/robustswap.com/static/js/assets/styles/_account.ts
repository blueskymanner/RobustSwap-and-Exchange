
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        mainContainer: {
            padding: theme.spacing(1, 6),
            background: theme.palette.background.default,
            height: "calc(100vh - 64px)",
            [theme.breakpoints.down('xs')]: {
                padding: theme.spacing(1, 4)
            }
        },
        cardWrapper: {
            width: "calc(100% - 423px - 24px)",
            marginRight: 24,
            hegiht: "368px",
            padding: theme.spacing(16, 14),
            background: theme.palette.background.paper,
            border: "1px solid #464544",
            borderRadius: 16,
            textAlign: "center",
            alignItems: "center",
            [theme.breakpoints.down('xs')]: {
                width: "100%",
                marginRight: 0,
                padding: theme.spacing(8, 4)
            }
        },
        cardWrapper1: {
            width: "calc(100% - 423px - 24px)",
            marginRight: 24,
            hegiht: "368px",
            padding: theme.spacing(5, 4),
            background: theme.palette.background.paper,
            border: "1px solid #464544",
            borderRadius: 16,
            textAlign: "center",
            alignItems: "center",
            [theme.breakpoints.down('xs')]: {
                width: "100%",
                marginRight: 0,
                padding: theme.spacing(3, 2),
                textAlign: "left"
            }
        },
        pageTitle: {
            fontSize: 34,
            fontWeight: 500,
            color: '#FF6B2A',
            fontFamily: "Poppin",
            [theme.breakpoints.down('xs')]: {
                fontSize: 32
            }
        },
        subPageTitle: {
            fontSize: 14,
            fontFamily: "Poppin",
            color: "#F0EFEF",
            paddingBottom: theme.spacing(5.3)
        },
        bgWrapper: {
            width: "431px",
            [theme.breakpoints.down('xs')]: {
                width: "unset",
                marginBottom: theme.spacing(5)
            }
        },
        bodyWrapper: {
            display: "flex",
            [theme.breakpoints.down('xs')]: {
                width: "100%",
                flexDirection: "column",
                marginRight: 0,
            }
        },
        walletButton: {
            background: '#FF6B2A',
            color: '#FCFCFC',
            padding: "16px 48px",
            borderRadius: 8,
            fontSize: 14,
            fontFamily: "Poppin"
        },
        statsValue: {
            display: "flex",
            justifyContent: "space-between",
            paddingBottom: theme.spacing(3.6),
            [theme.breakpoints.down('xs')]: {
                flexDirection: "column",
            }
        },
        switchButton: {
            background: 'transparent',
            border: "1px solid rgba(107, 161, 255, 0.2)",
            borderRadius: 8,
            padding: theme.spacing(1, 5),
            fontSize: 14,
            fontFamily: "Poppin",
            flex: 1,
            marginRight: 8
        },
        activeSwitcher: {
            background: "rgba(107, 161, 255, 0.2)",
        },
    })
);

export default useStyles;