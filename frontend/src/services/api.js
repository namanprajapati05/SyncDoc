import axios from 'axios'

const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
})

api.interceptors.request.use((config) => {
	const accessToken = localStorage.getItem('syncdoc-access-token')

	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`
	}

	return config
})

let refreshPromise = null

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config
		const isRefreshRequest = originalRequest?.url?.endsWith('/user/refresh-token')

		if (error.response?.status !== 401 || originalRequest?._retry || isRefreshRequest) {
			return Promise.reject(error)
		}

		originalRequest._retry = true
		refreshPromise ||= api.post('/user/refresh-token')

		try {
			const { data } = await refreshPromise
			const accessToken = data.data.accessToken
			localStorage.setItem('syncdoc-access-token', accessToken)
			originalRequest.headers.Authorization = `Bearer ${accessToken}`
			return api(originalRequest)
		} finally {
			refreshPromise = null
		}
	},
)

export default api
