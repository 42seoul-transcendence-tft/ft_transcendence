import { useState, MyReact } from "../MyReact/MyReact.js";
import { navigate } from "../MyReact/MyReactRouter.js";

async function onClickSubmit(event) {
	event.preventDefault();
	const input = event.target.parentNode.querySelector("input");
	const authStatusMessage = document.querySelector("#auth-status-message");
	try {
		const response = await fetch("/user/api/otp", {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				code: input.value
			})
		});
		const data = await response.json();
		if (data.result === "success") {
			navigate("/");
		} else {
			authStatusMessage.innerText = data.result;
		}
	} catch (error) {
		authStatusMessage.innerText = "Network Error!";
		setTimeout(() => { navigate("/") }, 800);
	}
}

function EmailOTP() {
	return (
		<div className="text-light text-center" style="user-select: none;">
			<div className="py-5"></div>
			<div className="container fs-1 py-5">
				42 Pong
			</div>
			<div className="container">
			</div>
			<div className="container">42Seoul에 연동된 이메일로 인증코드를 보냈습니다.</div>
			<div className="container">6자리 인증코드를 입력하세요.</div>
			<form className="container my-1 py-1">
				<input id="auth-code-input" type="text" placeholder="message you received" maxLength={6} autocomplete="off" />
				<button className="btn btn-primary btn-sm" onClick={onClickSubmit}>Submit</button>
				<div id="auth-status-message" className="text-danger"></div>
			</form>
		</div>
	);
}

export default EmailOTP