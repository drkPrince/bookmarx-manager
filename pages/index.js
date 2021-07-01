import { useCtx } from "../ctx.js";
import Link from "next/link";

const Index = () => {
    const { collections } = useCtx();

    if (!collections) {
        return <div className="spin" />;
    }

    if (collections && collections.length === 0) {
        return (
            <div className="w-full my-12">
                <p className="text-center text-gray-700 w-full">
                    You don't have any collections.
                </p>
                <img
                    className="w-1/2 mx-auto"
                    src="/empty.png"
                    alt="empty state"
                />
            </div>
        );
    }

    return (
        <div className="px-12 py-8">
            <h1 className="text-3xl">All Collections</h1>
            <div className="mt-4 space-y-3">
                {collections.map((c) => (
                    <div key={c._id}>
                        <Link href={`/collection/${c._id}`}>
                            <span className="inline-block text-blue-800 text-xl hover:text-black cursor-pointer">
                                {c.name}
                            </span>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Index;
