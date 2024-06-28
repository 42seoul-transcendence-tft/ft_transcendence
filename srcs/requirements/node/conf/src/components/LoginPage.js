import { useEffect, useState, MyReact } from "../MyReact/MyReact.js";
import MyReactRouter, { Link } from "../MyReact/MyReactRouter.js";
import Navbar from "./Navbar.js";

function clickLoginButton() {
	window.location.href = "http://localhost:8000/api/login";
}

function Login() {
	return (
		<div>
			<h1 className="container-fluid text-white text-center mt-5 mb-5 p-5 display-1">
				42 Pong
			</h1>
			<div className="container col-sm-4 mt-5 mb-5 pt-5">
				<div className="d-grid">
					<button className="btn btn-primary btn-lg" onClick={clickLoginButton}>Login with 42</button>
				</div>
			</div>
		</div>
	);
}

export default Login;