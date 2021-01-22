import {Link} from "react-router-dom";
import Icon from '@material-ui/core/Icon';
import  { URL } from "../../constants/constants";

export default function SideMenuButton(props){

    const onHam = (e) => {
        props.setCloseHam(false);
    }

    return(
        <Link onClick={onHam} aria-label={props.profile} to={props.to} style={{ textDecoration: 'none' }}>
            <button className={props.profile ? "sidemenu-btn-container profile" : "sidemenu-btn-container"} onClick={props.click ? props.click : null}>
                <h2>{props.displayTo}</h2>
                {props.profile ? <div className="img-cont"><img src={URL + props.profile} alt="profile-img" /></div> : <Icon>{props.icon}</Icon>}
            </button>
        </Link>
    )
}