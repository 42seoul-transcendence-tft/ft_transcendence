import { useState, MyReact } from "../MyReact/MyReact.js";
import { navigate } from "../MyReact/MyReactRouter.js";
import notifyStatusById from "./utility/notifyStatusById.js";

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
				<input id="otp-code-input" type="text" placeholder="message you received" maxLength={6} autocomplete="off" />
				<button className="btn btn-primary btn-sm" onClick={onClickSubmitOtpCode}>Submit</button>
				<div id="otp-status-message" className="text-danger"></div>
			</form>
		</div>
	);
}

async function onClickSubmitOtpCode(event) {
	event.preventDefault();
	const input = document.querySelector("#otp-code-input");
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
			notifyStatusById(data.result, false, "otp-status-message");
		}
	} catch (error) {
		console.log("onClickSubmitOtpCode Error: ", error);
		notifyStatusById("Network Error!", false, "otp-status-message");
		setTimeout(() => { navigate("/login") }, 800);
	}
}

export default EmailOTP