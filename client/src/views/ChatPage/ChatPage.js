import {Icon} from "@material-ui/core";
import axios from "axios";
import { useContext, useState, useEffect, useRef} from "react";
import { useParams } from "react-router-dom"; 
import {AccountContext} from "../../context/context"
import { URL } from "../../constants/constants";
import { randomKey } from "../../utils/utils";

import ChatBouble from "../../mini-components/ChatBouble/ChatBouble"
import LoadingSpinner from "../../mini-components/LoadingSpinner/LoadingSpinner"

import {socket} from "../../socket/socket";

export default function ChatPage(props){
    const { id } = useParams();
    const [message, setMessage] = useState("");
    const [room, setRoom] = useState("");
    const [render, setRender] = useState(false);
    const {context} = useContext(AccountContext);
    const chatRef = useRef(null)

    const scrollToBottom = () => {
        chatRef.current.scrollIntoView()
    }

    useEffect(() => {
        scrollToBottom();
    })

    useEffect(() => {
        socket.emit('join', JSON.stringify({room : id, user : context.username}), (msg, cb) => {
            console.log('connected')
        })
        console.log("hello?")

        return function cleanup(){
            socket.off("join")
        }
    }, [id, context]);

    useEffect(() => {
        socket.on('broad-message', data => {
            console.log(data)
            setRender(!render);
        })
        console.log("message")

        return function cleanup(){
            socket.off("broad-message")
        }
    }, [id, context, render]);

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
    }, [id, render])

    const sendMessage = (e) => {
        e.preventDefault();
        if(!message) return;

        const data = {
            message : message,
            author : context.username,
            room : [+id],
            user : [+context.id]
        }

        axios
            .post(URL + "/messages", data, {
                headers : {
                    'Authorization': "Bearer " + localStorage.getItem("jwt")
                }
            })
            .then(res => {
                let messages = room;
                messages.messages.push(data)
                setRoom(messages)
                socket.emit("message", JSON.stringify(data))
                setMessage("");
            })
            .finally(() => scrollToBottom())
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
                    <ChatBouble key={index.id ? index.id : randomKey()} 
                    image={
                        index.author === room.users[0].username ? room.users[0].profilepic.url : room.users[1].profilepic.url
                    }
                    self={
                        index.author === context.username ? true : false
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