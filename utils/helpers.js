import axios from "axios";
import NProgress from "nprogress";

export const getCollections = async (userID, setCollections, router) => {
	NProgress.start();
	const { data } = await axios.get(`/api/collection?user=${userID}`);
	if (data.data.length > 0) {
		router.replace(`/collection/${data.data[0]._id}`);
	}
	setCollections(data.data);
	NProgress.done();
};

export const addNewCollection = async (e, setModal, setCollections, userID) => {
	e.preventDefault();
	NProgress.start();
	setModal(false);
	const res = await axios.post("/api/collection", {
		name: e.target.elements.name.value,
		user: userID,
	});
	setCollections((collections) => [...collections, res.data.data]);
	NProgress.done();
};

export const deleteCollection = async (id, setCollections) => {
	setCollections((collections) => collections.filter((x) => x._id !== id));
	await axios.delete("/api/collection", {
		data: { collectionID: id },
	});
};

export const signUp = async (e, signIn, setError, setBusy) => {
	e.preventDefault();
	NProgress.start();
	setBusy(true);
	try {
		const user = await axios.post("/api/auth/signup", {
			username: e.target.elements.username.value,
			password: e.target.elements.password.value,
		});
		const col = await axios.post("/api/collection", {
			name: "Demo",
			user: user.data._id,
		});
		NProgress.done();
		signIn(null, { callbackUrl: process.env.NEXTAUTH_URL });
	} catch (e) {
		setError(e.response.data.error);
		console.dir(e);
		NProgress.done();
		setBusy(false);
	}
};

//LINKS

export const addNewLink = async (
	e,
	setModal,
	collectionID,
	setLinks,
	setError,
	setBusy
) => {
	e.preventDefault();
	NProgress.start();
	setBusy(true);
	try {
		const res = await axios.post("/api/link", {
			url: e.target.elements.url.value,
			collectionID,
		});
		setLinks((links) => [...links, res.data.data]);
		setModal(false);
		setError(null);
	} catch (e) {
		setError(e.response.data.error);
	}
	NProgress.done();
	setBusy(false);
};

export const deleteLink = async (id, setLinks) => {
	setLinks((links) => links.filter((x) => x._id !== id));
	await axios.delete("/api/link", { data: { linkID: id } });
};

export const debounce = (callback, wait) => {
	let timeoutId = null;
	return (...args) => {
		window.clearTimeout(timeoutId);
		timeoutId = window.setTimeout(() => {
			callback.apply(null, args);
		}, wait);
	};
};
