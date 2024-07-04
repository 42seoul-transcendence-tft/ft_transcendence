import tokenRefresh from "../utility/tokenRefresh.js";

async function getUserMatchRecords(userId) {
	try {
		const response = await fetch(`http://localhost:8000/api/users/${userId}/matches`, {
			method: 'GET',
			credentials: 'include'
		});
		if (response.status === 200) {
			return await response.json();
		} else if (response.status === 401) {
			return await tokenRefresh(() => getUserMatchRecords(userId));
		} else {
			return Promise.reject("unknown");
		}
	} catch (error) {
		return Promise.reject(error);
	}
}

export default getUserMatchRecords;