import { useContext } from "react";

import {URL} from "../../constants/constants";

import {AccountContext} from "../../context/context";

import { Link } from "react-router-dom";
import {Icon} from "@material-ui/core";
import axios from "axios";

export default function SearchAvatar(props){
    const {context} = useContext(AccountContext);
    const {firstname, lastname, profilepic, username, id} = props.user;

    const createChatRoom = () => {
        const data = {
            users: [+id, +context.id],
            title: username + ", " + context.username 
        }

        axios
            .post(URL + "/rooms", data, {
                headers: {
                    'Authorization': "Bearer " + localStorage.getItem("jwt")
                }
            })
            .then(res => {
                console.log(res);
            })
            .catch(err => console.error(err))
    }

    return(
        <div className="sa-container">
            <div className="sa-plates">
                <div className="image-container">
                    <img src={URL + profilepic.url} alt="user-avatar"/>
                </div>
                <h2>{firstname + " " + lastname}</h2>
                <h3>( {username} )</h3>
            </div>
            <div className="icon-container">
                <Link to={`/profile/${id}`} aria-label="user"><div><Icon>account_circle</Icon></div></Link>
                <div onClick={createChatRoom}><Icon>message</Icon></div>
            </div>
        </div>
    )
}