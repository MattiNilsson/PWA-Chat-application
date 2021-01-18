import {Link} from "react-router-dom";
import Icon from '@material-ui/core/Icon';

export default function SideMenuButton(props){

    return(
        <Link to={props.to} style={{ textDecoration: 'none' }}>
            <button className="sidemenu-btn-container">
                <h2>{props.displayTo}</h2>
                <Icon>{props.icon}</Icon>
            </button>
        </Link>
    )
}