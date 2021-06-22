import { useState, useEffect } from "react";
import "../css/style.css";
import "../css/global.css";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
    const [drawer, setDrawer] = useState(false);
    const [collections, setCollections] = useState(null);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const { data } = await axios.get("/api/collection");
            setCollections(data.data);
        })();
    }, []);

    const addNewCollection = async (e) => {
        e.preventDefault();
        const res = await axios.post("/api/collection", {
            name: e.target.elements.name.value,
        });
        setCollections((collections) => [...collections, res.data.data]);
        e.target.reset();
    };

    return (
        <div>
            <nav className="bg-blue-700">
                <button onClick={() => setDrawer(!drawer)}>Toggle</button>
            </nav>
            <div className="flex">
                <aside
                    style={{ width: drawer ? "0" : "15rem" }}
                    className="pt-8  bg-blue-50"
                >
                    <h1 className="text-sm  pl-2 text-gray-700">Collections</h1>
                    {collections && (
                        <div className="space-y-2 mt-2 pl-2 pr-0.5">
                            {collections.map((col) => (
                                <div
                                    key={col._id}
                                    className={
                                        router.query.collectionID ===
                                        `${col._id}`
                                            ? "text-blue-800 font-semibold border-r-2 border-blue-700"
                                            : "text-gray-800 hover:text-blue-800"
                                    }
                                >
                                    <Link
                                        href={`/collection/${col._id}?name=${col.name}`}
                                    >
                                        {col.name}
                                    </Link>
                                </div>
                            ))}
                            <form
                                onSubmit={addNewCollection}
                                className="hidden"
                            >
                                <input
                                    className="w-full"
                                    type="text"
                                    name="name"
                                />
                            </form>
                        </div>
                    )}
                </aside>
                <main className="w-full">
                    <Component {...pageProps} />
                </main>
            </div>
        </div>
    );
}

export default MyApp;
