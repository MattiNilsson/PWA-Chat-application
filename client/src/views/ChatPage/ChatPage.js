import {Icon} from "@material-ui/core";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import {AccountContext} from "../../context/context"
import { URL } from "../../constants/constants";

export default function ChatPage(props){
    const { id } = useParams();
    const [message, setMessage] = useState("");
    const [room, setRoom] = useState("");
    const {context} = useContext(AccountContext);

    useEffect(() => {
        axios
            .get(URL + "/rooms/" + id, {
                headers : {
                    'Authorization': "Bearer " + localStorage.getItem("jwt")
                }
            })
            .then(res => {
                console.log(res);
                setRoom(res.data);
            })
            .catch(err => console.error(err))
    }, [id])

    const getRoom = async () => {

    }

    const sendMessage = (e) => {
        e.preventDefault();
        axios
            .post(URL + "/messages", {
                message : message,
                author : context.username,
                room : [+id]
            }, {
                headers : {
                    'Authorization': "Bearer " + localStorage.getItem("jwt")
                }
            })
            .then(res => {
                console.log(res);
                setMessage("");
            })
            .catch(err => {
                console.log(err);
            })
    }

    const typing = (e) => {
        setMessage(e.target.value);
    }

    return(
        <div className="chat-container">
            <h1>{room ? room.users[0].username : ""}</h1>

            <div className="bouble-container">
                {room ? room.messages.map((index) => {
                    return <div key={index.id}>{index.message}</div>
                }) : <></>}
            </div>

            <form className="type-field" onSubmit={sendMessage}>
                <input value={message} onChange={typing} type="text" />
                <button type="submit" className="send"><Icon>send</Icon></button>
            </form>
        </div>
    )
}