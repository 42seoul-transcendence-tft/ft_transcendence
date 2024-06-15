import MyReact from "../MyReact/MyReact.js";
import { Route } from "../MyReact/MyReactRouter.js";
import Home from "./home/home.js";
import UserPage from "./UserPage.js";
import Login from "./login.js";
import Interchange from "./interchange.js";
import Game from "./Game/Game.js";
import Room1vs1 from "./Room/1vs1/Room1vs1.js";

function App() {
	return (
		<div>
			<Route path="/" component={Interchange} />
			{/* <Route path="/home" component={Home} /> */}
			<Route path="/profile" component={UserPage} />
			<Route path="/login" component={Login} />
			{/* <Route path="/home" component={Game} /> */}
			<Route path="/home" component={Room1vs1} />
		</div>
	);
}

export default App;