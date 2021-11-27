import Link from "next/link";
import useCollections from "../utils/useCollections.js";

const Index = (props) => {
  const collections = useCollections(props.session.user.userID);

  if (!collections) {
    return <div className="spin" />;
  }

  if (collections && collections.length === 0) {
    return (
      <div className="w-full my-12">
        <p className="w-full text-center text-gray-700">
          You don't have any collections.
        </p>
        <img className="w-1/2 mx-auto" src="/empty.png" alt="empty state" />
      </div>
    );
  }

  return (
    <div className="px-12 py-8">
      <h1 className="text-3xl">All Collections</h1>
      <div className="flex flex-col items-start mt-8 space-y-4">
        {collections.map((c) => (
          <Link href={`/collection/${c._id}`} key={c._id}>
            <a className="text-lg text-gray-700 cursor-pointer hover:text-black">
              {c.name}
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Index;
