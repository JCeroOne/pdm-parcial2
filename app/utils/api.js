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

setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc2NDExNjY3OSwianRpIjoiYTQ2YWRlYTItZDM4OC00ZjE1LTk0ZGItYjIyNDkyMGFhYjQ1IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6InVzZXIiLCJuYmYiOjE3NjQxMTY2NzksImNzcmYiOiJkMmQ1YjIwZi0wYjY4LTRmYjItYTg3ZC02YTQ1YTVlOWNiNjEiLCJleHAiOjE3NjQxMjAyNzl9.a9gMx4kvfExmwVUu1qtPIOCtfuq1ozITRfwQBZtZtrM");
