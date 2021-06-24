import { useState, useEffect } from "react";
import "../css/style.css";
import "../css/global.css";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/client";
import Head from "next/head";

import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";

function MyApp({ Component, pageProps }) {
    const [drawer, setDrawer] = useState(false);
    const [modal, setModal] = useState(false);
    const [collections, setCollections] = useState(null);
    const router = useRouter();
    const [session, loading] = useSession();

    useEffect(() => {
        if (!loading && session?.user) {
            (async () => {
                const { data } = await axios.get(
                    `/api/collection?user=${session.user.userID}`
                );
                setCollections(data.data);
            })();
        }
    }, [session, loading]);

    const addNewCollection = async (e) => {
        e.preventDefault();
        setModal(false);
        const res = await axios.post("/api/collection", {
            name: e.target.elements.name.value,
            user: session.user.userID,
        });
        setCollections((collections) => [...collections, res.data.data]);
        e.target.reset();
    };

    const deleteCollection = async (id) => {
        setCollections((collections) =>
            collections.filter((x) => x._id !== id)
        );
        await axios.delete("/api/collection", {
            data: { collectionID: id, user: session.user.email },
        });
        router.push("/");
    };

    const signup = (e) => {
        e.preventDefault();
        axios.post("/api/auth/signup", {
            username: e.target.elements.username.value,
            password: e.target.elements.password.value,
        });
    };

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
                    <nav className="bg-blue-700 text-gray-200 flex items-center justify-between pl-4 pr-12">
                        <button onClick={() => setDrawer(!drawer)}>
                            <svg
                                className="w-6 h-6  "
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h8m-8 6h16"
                                />
                            </svg>
                        </button>
                        <button onClick={signOut}>Sign out</button>
                    </nav>
                    <div className="flex">
                        <aside
                            style={{ width: drawer ? "0" : "250px" }}
                            className="pt-8 bg-blue-50"
                        >
                            <div className="px-2 flex justify-between items-center">
                                <h1 className="text-xs tracking-wider uppercase   text-gray-700">
                                    Collections
                                </h1>
                                <button
                                    onClick={() => setModal(true)}
                                    className="text-gray-600 text-2xl rounded"
                                >
                                    +
                                </button>
                            </div>
                            {collections && (
                                <div className="space-y-3 mt-5 pl-2 pr-0.5">
                                    {collections.map((col) => (
                                        <div
                                            key={col._id}
                                            className={
                                                router.query.collectionID ===
                                                `${col._id}`
                                                    ? "text-blue-800 font-semibold border-r-2 border-blue-700 flex justify-between pr-2"
                                                    : "text-gray-800 hover:text-blue-800 flex justify-between pr-2"
                                            }
                                        >
                                            <Link
                                                href={`/collection/${col._id}?name=${col.name}`}
                                                className="truncate"
                                            >
                                                {col.name}
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    deleteCollection(col._id)
                                                }
                                            >
                                                <svg
                                                    className="w-4 h-4 text-gray-500 hover:text-red-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </aside>
                        <main className="w-full">
                            <Component {...pageProps} />
                        </main>
                    </div>
                </div>
            )}
            <Dialog
                aria-label="Add a new collection"
                isOpen={modal}
                onDismiss={() => setModal(false)}
            >
                <div>
                    <form onSubmit={addNewCollection} className="">
                        <label className="text-2xl" htmlFor="name">
                            Add a new collection
                        </label>
                        <input
                            className="w-full border-b outline-none border-gray-300 focus:ring-2 ring-blue-500 pb-1 mt-5 text-sm py-1 px-1"
                            placeholder="Enter name here"
                            type="text"
                            name="name"
                        />
                    </form>
                </div>
            </Dialog>
        </>
    );
}

export default MyApp;
