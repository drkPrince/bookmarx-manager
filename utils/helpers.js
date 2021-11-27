import axios from "axios";
import NProgress from "nprogress";

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
    NProgress.done();
    setBusy(false);
  }
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
