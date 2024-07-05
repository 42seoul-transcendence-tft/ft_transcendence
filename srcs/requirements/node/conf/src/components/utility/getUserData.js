import tokenRefresh from "./tokenRefresh.js";

async function getUserData(userId) {
	try {
		const response = await fetch(`/user/api/users/${userId}/`, {
			method: 'GET',
			credentials: 'include'
		});
		if (response.status === 200) {
			return await response.json();
		} else if (response.status === 401) {
			return await tokenRefresh(async () => await getUserData(userId));
		} else if (response.status === 404) {
			return Promise.reject("not found");
		} else {
			return Promise.reject("unknown");
		}
	} catch (error) {
		console.log("getUserData Error: ", error);
		return Promise.reject(error);
	}
}

export default getUserData;