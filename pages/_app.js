import { useState, useEffect } from "react";
import "../css/style.css";
import "../css/global.css";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/client";
import Head from "next/head";
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";
import DrawerContent from "../components/DrawerContent";
//MUI
import { IconButton, Button, Input, Drawer, Hidden } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import ArrowRightAltOutlinedIcon from "@material-ui/icons/ArrowRightAltOutlined";

import {
    getCollections,
    addNewCollection,
    deleteCollection,
    signup,
} from "../utils/helpers";

const drawerWidth = 220;

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
        height: "7vh",
        [theme.breakpoints.up("sm")]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up("sm")]: {
            display: "none",
        },
    },
    // necessary for content to be below app bar
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
    const [drawer, setDrawer] = useState(false);
    const [modal, setModal] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collections, setCollections] = useState(null);
    const router = useRouter();
    const [session, loading] = useSession();

    useEffect(() => {
        if (!loading && session?.user) {
            getCollections(session.user.userID, setCollections);
        }
    }, [session, loading]);

    if (loading) return <p>Loading</p>;

    return (
        <>
            <Head>
                <title>BookmarX</title>
            </Head>
            {!session && (
                <>
                    Not signed in <br />
                    <button onClick={() => signIn()}>Sign in</button>
                    <div className="p-12">
                        <h1 className="text-2xl">Create an account</h1>
                        <form className="mt-6" onSubmit={signup}>
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                            />
                            <button>Signup</button>
                        </form>
                    </div>
                </>
            )}
            {session && (
                <div>
                    <div className={classes.appBar}>
                        <div className="flex justify-between items-center px-12 h-full">
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
                                    anchor={
                                        theme.direction === "rtl"
                                            ? "right"
                                            : "left"
                                    }
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
                                        className="pt-12"
                                        setModal={setModal}
                                        router={router}
                                        collections={collections}
                                        setCollections={setCollections}
                                        signOut={signOut}
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
                                        setModal={setModal}
                                        router={router}
                                        collections={collections}
                                        signOut={signOut}
                                    />
                                </Drawer>
                            </Hidden>
                        </nav>

                        <main className={classes.content}>
                            <Component {...pageProps} />
                        </main>
                    </div>
                </div>
            )}
            <Dialog
                className="z-50"
                aria-label="Add a new collection"
                isOpen={modal}
                onDismiss={() => setModal(false)}
            >
                <div className="px-7 py-8">
                    <form
                        onSubmit={(e) =>
                            addNewCollection(
                                e,
                                setModal,
                                setCollections,
                                session.user.userID
                            )
                        }
                        className=""
                    >
                        <label className="text-2xl" htmlFor="name">
                            Add a new collection
                        </label>
                        <Input
                            className="w-full  pb-1 my-7 text-sm py-1 px-1"
                            fullWidth
                            placeholder="Collection name"
                            type="text"
                            name="name"
                        />

                        <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                            endIcon={<ArrowRightAltOutlinedIcon />}
                        >
                            Add
                        </Button>
                    </form>
                </div>
            </Dialog>
        </>
    );
}

export default MyApp;
