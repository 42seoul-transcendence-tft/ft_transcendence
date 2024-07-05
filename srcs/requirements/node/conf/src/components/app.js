import MyReact from "../MyReact/MyReact.js";
import { Route, navigate } from "../MyReact/MyReactRouter.js";
import Home from "./home/Home.js";
import UserPage from "./userPage/UserPage.js";
import Login from "./LoginPage.js";
import Interchange from "./Interchange.js";
import EmailOTP from "./EmailOTP.js";
import LocalGame from "./LocalGame/Game.js";
import RemoteGame from "./RemoteGame/Game.js";
import Room from "./Room/Room.js";

const paths = [ "/", "/emailotp", "/home", "/userpage", "/login", 
                "/local_game", "/remote_game", "/next_game", "/room", ];

function App() {
    if (!paths.includes(window.location.pathname))
        navigate("/home");
	return (
		<div>
			<Route path="/" component={Interchange} />
			<Route path="/emailotp" component={EmailOTP} />
			<Route path="/home" component={Home} />
			<Route path="/userpage" component={UserPage} />
			<Route path="/login" component={Login} />
			<Route path="/local_game" component={LocalGame} />
			<Route path="/remote_game" component={RemoteGame} />
			<Route path="/next_game" component={RemoteGame} />
			<Route path="/room" component={Room} />
		</div>
		// <div>
		// 	<Route path="/" component={HomeTest} />
		// 	<Route path="/login" component={LoginTest} />
		// </div>
	);
}

export default App;