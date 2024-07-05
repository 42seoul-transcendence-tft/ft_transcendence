async function tokenRefresh(workingFunction) {
	try {
		const response = await fetch("/user/api/token/refresh", {
			method: 'POST',
			credentials: 'include'
		});
		if (response.status === 200) {
			return await workingFunction();
		} else if (response.status === 401) {
			return Promise.reject("refresh failed");
		} else {
			return Promise.reject("unknown");
		}
	} catch (error) {
		console.log("tokenRefresh Error: ", error);
		return Promise.reject(error);
	}
}

export default tokenRefresh;