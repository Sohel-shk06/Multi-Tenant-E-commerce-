/**
 * api.js — Axios instance configuration.
 *
 * TODO: Install axios: npm install axios
 * TODO: Set VITE_API_BASE_URL in .env file:
 *       VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
 *
 * Uncomment the block below once Axios is installed and the backend is ready.
 */

// import axios from 'axios'
//
// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
//   timeout: 15000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })
//
// // Attach auth token to every request
// api.interceptors.request.use((config) => {
//   // TODO: Get token from Redux auth state or localStorage
//   const token = localStorage.getItem('auth_token')
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })
//
// // Global response error handler
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // TODO: Dispatch logout action and redirect to /login
//     }
//     return Promise.reject(error)
//   },
// )
//
// export default api

const api = null // placeholder — replace with axios instance above
export default api
