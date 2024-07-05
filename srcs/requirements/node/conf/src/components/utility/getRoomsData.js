import tokenRefresh from "./tokenRefresh";

async function getRoomsData() {
	try {
		const response = await fetch("/game/api/rooms/", {
			method: 'GET',
			credentials: 'include'
		});
		if (response.status === 200) {
			return await response.json();
		} else if (response.status === 403) {//엑세스토큰 만료됐을 때
			const data = await response.json();
			if (data.detail === "Authentication credentials were not provided.") {
				return await tokenRefresh(getRoomsData);
			} else {
				return Promise.reject("unknown");
			}
		} else {
			return Promise.reject("unknown");
		}
	} catch (error) {
		console.log("getRoomsData Error: ", error);
		return Promise.reject(error);
	}
}

export default getRoomsData;