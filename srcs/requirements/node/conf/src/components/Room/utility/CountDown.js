import { useEffect, useState, MyReact } from "../../../MyReact/MyReact.js";
import "../../../css/room/utility/count-down.css";

function CountDown({ count }) {
    return (
        <div id="count-down">{ count }</div>
    );
}

export default CountDown;