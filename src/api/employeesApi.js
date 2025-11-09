import axios from "./axiosInstance";

export const getEmployees = async () => {
  const res = await axios.get("/users/");
  return res.data;
};

export const createEmployee = async (payload) => {
  const res = await axios.post("/users/", payload);
  return res.data;
};
