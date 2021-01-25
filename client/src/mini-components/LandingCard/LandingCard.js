import { Icon } from "@material-ui/core";
import { Link } from "react-router-dom";


export default function LandingCard(props){
    return(
        <div className="landing-card">
            <div className="ball">
                <Icon>{props.icon}</Icon>
            </div>
            <p>{props.desc}</p>
            <Link to={props.to}><button>{props.purpose}</button></Link>
        </div>
    )
}