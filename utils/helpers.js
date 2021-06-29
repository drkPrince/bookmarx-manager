import axios from "axios";
import NProgress from "nprogress";

export const getCollections = async (userID, setCollections) => {
	NProgress.start();
	const { data } = await axios.get(`/api/collection?user=${userID}`);
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

export const signup = (e) => {
	e.preventDefault();
	axios.post("/api/auth/signup", {
		username: e.target.elements.username.value,
		password: e.target.elements.password.value,
	});
};

//LINKS

export const addNewLink = async (e, setModal, collectionID, setLinks) => {
	e.preventDefault();
	NProgress.start();
	setModal(false);
	const res = await axios.post("/api/link", {
		url: e.target.elements.url.value,
		collectionID,
	});
	setLinks((links) => [...links, res.data.data]);
	NProgress.done();
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
