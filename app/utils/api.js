import axios from "axios";

export const api = axios.create({
    baseURL: "https://backend-lol-proyectomovil.onrender.com",
    timeout: 10000
})

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc2NDI5NTcxNCwianRpIjoiMjdlZWE4YTEtMTFjNy00YWRkLTkwMDQtMmFjNDEzNDQwZGI4IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImZyYW4iLCJuYmYiOjE3NjQyOTU3MTQsImNzcmYiOiJiYzgwNDRhNi1jMGJhLTRmZjMtYTZkMi02YzFlYTA4OTkxYzMiLCJleHAiOjE3NjQyOTkzMTR9.pEWmiJjij2hvdOXzVSqZvPvZgoEWqfK0md9QmNU66ys");
