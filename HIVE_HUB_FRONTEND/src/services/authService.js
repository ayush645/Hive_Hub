import api from "../utils/axios";

// Example: POST request to /user/sign
const adminSignIn = async (payload) => {
  const response = await api.post("/admin/signInAdmin", payload);
  return response.data;
};

const signUp = async (payload) => {
  const response = await api.post("/user/signup", payload);
  return response.data;
};

const signIn = async (payload) => {
  const response = await api.post("/user/login", payload);
  return response.data;
};

const authService = { adminSignIn, signUp, signIn };

export default authService;
