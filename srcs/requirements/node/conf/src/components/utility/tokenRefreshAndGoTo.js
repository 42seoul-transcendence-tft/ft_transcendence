import { navigate } from "../../MyReact/MyReactRouter";

const refreshApiUrl = "/user/api/token/refresh";

function tokenRefreshAndGoTo(successGoTo) {
	fetch(refreshApiUrl, {//refreshApi 요청
		method: 'POST',
		credentials: 'include'
	})
		.then(response => {
			if (response.status === 200) {
				console.log(successGoTo, "에서 access token 재발급 성공");
				navigate(successGoTo);//access token 재발급 성공
			} else {
				console.log(successGoTo, "에서 access token 재발급 실패");
				navigate("/login");//재발급 실패 시 로그인 페이지로.
			}
		})
		.catch(error => {
			console.log(successGoTo, "에서 access token 재발급 에러", error);
			navigate("/login");//에러 시 로그인 페이지로.
		});
}

export default tokenRefreshAndGoTo;
