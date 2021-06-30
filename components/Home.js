import { signUp } from "../utils/helpers";
import { Button, Input } from "@material-ui/core";
import { useState } from "react";
import Modal from "./Modal";

const Home = ({ signIn }) => {
	const [modal, setModal] = useState(false);
	const [error, setError] = useState(null);
	const [busy, setBusy] = useState(false);

	return (
		<>
			<div className="flex flex-col sm:flex-row sm:max-h-screen items-center">
				<div className="py-20 sm:py-32 px-6 sm:pl-20 w-full sm:w-1/2">
					<h1 className="text-4xl font-semibold text-gray-800 leading-10">
						Bookmarx is an all in one bookmark manager
					</h1>
					<p className="text-gray-700 text-xl mt-3 mb-6 leading-relaxed">
						Lorem ipsum dolor, sit amet, consectetur adipisicing
						elit. Doloribus, ipsam! Lorem ipsum, dolor sit, amet
						consectetur adipisicing elit. Voluptates, alias.
					</p>
					<div className="flex space-x-4">
						<Button
							variant="contained"
							color="primary"
							onClick={() => signIn()}
						>
							Sign in
						</Button>

						<Button
							color="secondary"
							variant="outlined"
							onClick={() => setModal(true)}
						>
							Create an account
						</Button>
					</div>
				</div>
				<div className="w-full sm:w-1/2 px-4">
					<img
						src="/main.png"
						className="object-cover"
						alt="an organised girl"
					/>
				</div>
			</div>

			<Modal modal={modal} setModal={setModal} className="p-12">
				<h1 className="text-2xl">Create an account</h1>
				{error && <p className="text-red-500">{error}</p>}
				<form
					className="mt-6"
					onSubmit={(e) => signUp(e, signIn, setError, setBusy)}
				>
					<Input
						className="w-full pb-1 my-3 text-sm py-1 px-1"
						type="text"
						required
						name="username"
						placeholder="Username"
						minLength="3"
					/>
					<Input
						className="w-full pb-1 mt-3 mb-12 text-sm py-1 px-1"
						type="password"
						required
						name="password"
						placeholder="Password"
						minLength="6"
					/>
					<Button
						disabled={busy}
						variant="contained"
						type="submit"
						color="primary"
					>
						Signup
					</Button>
				</form>
			</Modal>
		</>
	);
};

export default Home;

{
}
