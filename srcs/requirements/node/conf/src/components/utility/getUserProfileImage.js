import tokenRefresh from "./tokenRefresh";

async function getUserProfileImage(id) {
	try {
		const response = await fetch(`http://localhost:8000/api/users/${id}/avatar/`, { method: 'GET', credentials: 'include' });
		if (response.status === 200) {
			const blob = await response.blob();
			return URL.createObjectURL(blob);
		} else if (response.status === 401) {
			return await tokenRefresh(() => getUserProfileImage(id));
		} else {
			return Promise.reject("unknown");
		}
	} catch (error) {
		console.log("getUserProfileImage Error: ", error);
		return Promise.reject(error);
	}
}

export default getUserProfileImage;