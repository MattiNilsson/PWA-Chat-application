import { useContext, useState } from "react";

import {URL} from "../../constants/constants";

import {AccountContext} from "../../context/context";

import { Link } from "react-router-dom";
import { Icon } from "@material-ui/core";

import CreateRoom from "../../components/modals/CreateRoom/CreateRoom";

export default function SearchAvatar(props){
    const {context} = useContext(AccountContext);
    const {firstname, lastname, profilepic, username, id} = props.user;
    const [modal, setModal] = useState(false);

    const openModal = (e) => {
        setModal(true);
    }

    return(
        <div className="sa-container">
            {modal ? <CreateRoom setModal={setModal} friendID={id} /> : ""}
            <div className="sa-plates">
                <div className="image-container">
                    <img src={URL + profilepic.url} alt="user-avatar"/>
                </div>
                <h2>{firstname + " " + lastname}</h2>
                <h3>{username}</h3>
            </div>
            <div className="icon-container">
                <Link to={`/profile/${id}`} aria-label="user"><div><Icon>account_circle</Icon></div></Link>
                <div onClick={openModal}><Icon>message</Icon></div>
            </div>
        </div>
    )
}