import { useState, useEffect } from "react";
import "../css/style.css";
import "../css/global.css";
import axios from "axios";
import Link from "next/link";

function MyApp({ Component, pageProps }) {
    const [drawer, setDrawer] = useState(false);
    const [collections, setCollections] = useState(null);

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
            <nav>
                <button onClick={() => setDrawer(!drawer)}>Toggle</button>
            </nav>
            <div style={{ display: "flex" }}>
                <aside style={{ width: drawer ? "0" : "15rem" }}>
                    <h1>Collections</h1>
                    {collections && (
                        <div>
                            {collections.map((col) => (
                                <div key={col._id}>
                                    <Link href={`/collection/${col._id}`}>
                                        {col.name}
                                    </Link>
                                </div>
                            ))}
                            <form onSubmit={addNewCollection}>
                                <input type="text" name="name" />
                            </form>
                        </div>
                    )}
                </aside>
                <main>
                    <Component {...pageProps} />
                </main>
            </div>
        </div>
    );
}

export default MyApp;
