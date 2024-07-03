import { navigate } from "../../MyReact/MyReactRouter";

function logout() {
	fetch("/user/api/logout", {
		method: 'POST',
		credentials: 'include'
	});
	navigate("/login");
}

export default logout;