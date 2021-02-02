
import { useState } from "react";
import {Link} from "react-router-dom";
import {URL} from "../../constants/constants";

export default function SideMenuFriends(props){
    const [clicked, setClicked] = useState(false);

    const onHam = (e) => {
        props.setCloseHam(false);
        setClicked(true);
    }

    return(
        <Link className="sidemenu-wrap" onClick={onHam} aria-label={props.profile} to={props.to} style={{ textDecoration: 'none' }}>
            <button className="sidemenu-friend-container">
                <h2>{props.displayTo}</h2>
                <div className="img-cont"><img src={URL + props.profile} alt="profile-img" /></div>
                {!props.seen ? <div className={!clicked ? "orb" : "orb hide"}></div> : ""}
            </button>
            {
                props.notify ? 
                <div className="note">
                    <p className="name">{props.notify.roomName + " : "}<span className="author">{props.notify.author}</span></p>
                    <p className={props.notify.message ? "message" : "message image"}>
                        {props.notify.message ? props.notify.message : "Sent an image!"}
                    </p>
                </div>
                : <></>
            }
        </Link>
    )
}