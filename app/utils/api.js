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

setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc2NDI5NTUwMywianRpIjoiZDQ4YzljOWItZWE0NS00ZmY3LWIyYjctOWM4MDJhYTAyYjViIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImFuZ2VsIiwibmJmIjoxNzY0Mjk1NTAzLCJjc3JmIjoiN2U3ZTU2Y2EtNzhiNS00MjliLTg0MTAtNTVkZjI0YjJjZDBkIiwiZXhwIjoxNzY0Mjk5MTAzfQ.bwBfLb_6_VJd_22wKo-q9ldFYKsfbbToEG-xZx8z04k");
