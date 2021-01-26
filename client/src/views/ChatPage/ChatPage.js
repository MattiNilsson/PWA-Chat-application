import {Icon} from "@material-ui/core";
import axios from "axios";
import { useContext, useState, useEffect, useRef} from "react";
import { useParams } from "react-router-dom"; 
import {AccountContext} from "../../context/context"
import { URL } from "../../constants/constants";

import ChatBouble from "../../mini-components/ChatBouble/ChatBouble"

import {socket} from "../../socket/socket";

export default function ChatPage(props){
    const { id } = useParams();
    const [message, setMessage] = useState("");
    const [room, setRoom] = useState("");
    const {context} = useContext(AccountContext);
    const chatRef = useRef(null)

    const scrollToBottom = () => {
        chatRef.current.scrollIntoView()
    }

    useEffect(() => {
        socket.emit('join', JSON.stringify({room : id, user : context.username}), (msg, cb) => {
            console.log('SOCKET HI')
            console.log(msg);
            console.log(cb);
        })
        console.log("hello?")

        return function cleanup(){
            socket.off("join")
        }
    }, [id, context]);

    useEffect(() => {
        socket.on('broad-message', data => {
            console.log(data)
        })
        console.log("message")

        return function cleanup(){
            socket.off("broad-message")
        }
    }, [id, context]);

    useEffect(() => {
        axios
            .get(URL + "/rooms/" + id, {
                headers : {
                    'Authorization': "Bearer " + localStorage.getItem("jwt")
                }
            })
            .then(res => {
                setRoom(res.data);
                scrollToBottom();
            })
            .catch(err => console.error(err))
    }, [id])

    const sendMessage = (e) => {
        e.preventDefault();



        axios
            .post(URL + "/messages", {
                message : message,
                author : context.username,
                room : [+id],
                user : [+context.id]
            }, {
                headers : {
                    'Authorization': "Bearer " + localStorage.getItem("jwt")
                }
            })
            .then(res => {

                socket.emit("message", JSON.stringify({user: context.username, id: id, message: message}))
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
            <h1>{room ? room.users[0].username + ", " + room.users[1].username : ""}</h1>

            <div className="bouble-container">
                {room ? room.messages.map((index) => {
                    return (
                    <ChatBouble key={index.id} 
                    image={
                        index.author === room.users[0].username ? room.users[0].profilepic.url : room.users[1].profilepic.url
                    }
                    self={
                        index.author === room.users[0].username ? false : true
                    } 
                    data={index}
                    />
                    )
                }) : <></>}
                <div ref={chatRef}></div>
            </div>

            <form className="type-field" onSubmit={sendMessage}>
                <input value={message} onChange={typing} type="text" />
                <button type="submit" className="send"><Icon>send</Icon></button>
            </form>
        </div>
    )
}