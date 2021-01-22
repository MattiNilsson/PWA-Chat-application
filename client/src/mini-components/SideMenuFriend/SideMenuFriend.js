import {Link} from "react-router-dom";
import {URL} from "../../constants/constants"

export default function SideMenuFriends(props){

    const onHam = (e) => {
        props.setCloseHam(false);
    }
     
    return(
        <Link onClick={onHam} aria-label={props.profile} to={props.to} style={{ textDecoration: 'none' }}>
            <button className="sidemenu-friend-container">
                <h2>{props.displayTo}</h2>
               <div className="img-cont"><img src={URL + props.profile} alt="profile-img" /></div>
            </button>
        </Link>
    )
}