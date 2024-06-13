import { navigate } from "../../MyReact/MyReactRouter";

function isLogin() {
	const myInfoApiUrl = "http://localhost:8000/api/users/me";
	fetch(myInfoApiUrl, {//api 요청
		method: 'GET',
		credentials: 'include'
	})
		.then(response => response.json())//요청 성공 시
		.then(data => new Promise((resolve, reject) => {
			if (data.detail === undefined) {//로그인 성공 시
				navigate("/home");//로그인 성공 시 홈으로 감
			} else {//로그인 실패 시
				resolve("http://localhost:8000/api/token/refresh");
				//login fail 프로미스 리턴. 토큰 refresh 요청하러 감
			}
		}))
		.then(refreshApiUrl => {
			fetch(refreshApiUrl, {//refreshApi 요청
				method: 'POST',
				credentials: 'include'
			})
				.then(response => {
					console.log(response);
					if (response.status === 204) {
						navigate("/home");//access token 재발급 성공했으니 홈으로
					} else {
						navigate("/login");//로그인 페이지로.
					}
				})
				.catch(error => {
					console.log(error);
					navigate("/login");
				});
		})
		.catch(error => {//요청 실패 시
			console.log(error);
			navigate("/login");
		})
}

export default isLogin;