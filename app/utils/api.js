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

setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc2NDM5MDg1NCwianRpIjoiZmY4ZGE2ZGMtOGIyYS00N2U3LWI5MjAtZjU2NWRmODU1MDNjIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImFuZ2VsIiwibmJmIjoxNzY0MzkwODU0LCJjc3JmIjoiMjA2OTFhNDMtM2QzOC00NWE4LThmNDItYzVkN2YyZDFlNzQ2IiwiZXhwIjoxNzY0Mzk0NDU0fQ.chFly5ww7rRdi33IR5u-eGZfTNUIUp4vE448yqfBHI8");
