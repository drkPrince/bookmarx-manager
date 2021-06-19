import Link from "next/link";
import axios from "axios";

const Index = () => {
    const addNewColl = (e) => {
        e.preventDefault();
        e.target.reset();
        axios.post("/api/collection", { name: e.target.elements.name.value });
    };

    return (
        <div>
            <h1>Go</h1>
            <form onSubmit={addNewColl}>
                <input type="text" name="name" />
            </form>
        </div>
    );
};

export default Index;
