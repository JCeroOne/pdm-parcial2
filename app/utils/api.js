import axios from "axios";

export const api = axios.create({
    baseURL: "https://backend-lol-proyectomovil.onrender.com",
    timeout: 10000
})