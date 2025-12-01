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

setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc2NDYxMDM1MiwianRpIjoiN2FhZTk2YTEtYmIwMS00NThjLWFkMjctMWM0NzZmMTFhNTQyIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImZyYW4iLCJuYmYiOjE3NjQ2MTAzNTIsImNzcmYiOiJlNWZkZmU5ZS04MjJlLTRkODgtYmM0NC1lY2MwMzJiYzQxNjUiLCJleHAiOjE3NjQ2MTM5NTJ9.rGr0XRujhlh2M9buEyd6jnI0o-CR073bq_kbqDxEHWs");
