import { useState } from "react";
import "../css/style.css";
import "../css/global.css";
import "../css/nprogress.css";
import { useRouter } from "next/router";
import { Provider } from "next-auth/client";
import { signIn, signOut, useSession } from "next-auth/client";
import Head from "next/head";
import DrawerContent from "../components/DrawerContent";
import Home from "../components/Home";
//MUI
import { IconButton, Button, Input, Drawer, Hidden } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import {
  createTheme,
  makeStyles,
  ThemeProvider,
  useTheme,
} from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";

const myTheme = createTheme({
  typography: {
    fontFamily: ["Inter", "sans-serif"],
  },
  palette: {
    primary: {
      main: "#205be1",
    },
  },
});

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    zIndex: "0",
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    height: "8vh",
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    [theme.breakpoints.down("sm")]: {
      backgroundColor: "#205be1",
    },
  },
  menuButton: {
    // marginTop: theme.spacing(5),
    // marginBottom: theme.spacing(3),
    padding: "0 1rem",
    color: "white",
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
  },
}));

function MyApp({ Component, pageProps }) {
  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [session, loading] = useSession();

  if (loading) return <div className="spin" />;

  return (
    <Provider session={pageProps.session}>
      <Head>
        <title>BookmarX</title>
        <link rel="icon" href="/favicon.svg" />
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta
          name="description"
          content="Bookmark the best links on the internet."
        />
        <meta name="keywords" content="Keywords" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-icon.png"></link>
        <meta name="theme-color" content="#205be1" />
      </Head>

      <ThemeProvider theme={myTheme}>
        {!session && <Home signIn={signIn} />}

        {session && (
          <>
            <div className={classes.appBar}>
              <div className="flex items-center justify-between h-full px-4">
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={() => setMobileOpen(true)}
                  className={classes.menuButton}
                >
                  <MenuIcon />
                </IconButton>
              </div>
            </div>

            <div className={classes.root}>
              <nav className={classes.drawer}>
                <Hidden smUp implementation="css">
                  <Drawer
                    variant="temporary"
                    anchor={theme.direction === "rtl" ? "right" : "left"}
                    open={mobileOpen}
                    onClose={() => setMobileOpen(!mobileOpen)}
                    classes={{
                      paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                      keepMounted: true, // Better open performance on mobile.
                    }}
                  >
                    <DrawerContent
                      router={router}
                      setMobileOpen={setMobileOpen}
                      loading={loading}
                      signOut={signOut}
                      session={session}
                    />
                  </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                  <Drawer
                    classes={{
                      paper: classes.drawerPaper,
                    }}
                    variant="permanent"
                    open
                  >
                    <DrawerContent
                      className="pt-12"
                      setMobileOpen={setMobileOpen}
                      router={router}
                      loading={loading}
                      signOut={signOut}
                      session={session}
                    />
                  </Drawer>
                </Hidden>
              </nav>

              <main className={classes.content}>
                <Component session={session} {...pageProps} />
              </main>
            </div>
          </>
        )}
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
