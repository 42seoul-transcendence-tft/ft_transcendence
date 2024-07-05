import { useEffect, useState, MyReact } from "../MyReact/MyReact.js";
import { navigate } from "../MyReact/MyReactRouter.js";
import getMyData from "./utility/getMyData.js";

function Interchange() {
	useEffect(() => {
		const a = async () => {
			try {
				await getMyData();
				navigate("/home");
			} catch (error) {
				console.log("Interchange Error: ", error);
				navigate("/login");
			}
		};
		a();
	}, []);
	return (
		<div className="container text-light fs-1 text-center">
			42Pong
		</div>
	);
}

export default Interchange;
