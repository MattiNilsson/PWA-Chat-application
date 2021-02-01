import {Icon} from "@material-ui/core";
import axios from "axios";
import { useContext, useState, useEffect, useRef} from "react";
import { useParams } from "react-router-dom"; 
import {AccountContext} from "../../context/context"
import { URL } from "../../constants/constants";
import { randomKey } from "../../utils/utils";

import ChatBouble from "../../mini-components/ChatBouble/ChatBouble"
import ChatImage from "../../components/ChatImage/ChatImage"

import {socket} from "../../socket/socket";

export default function ChatPage(props){
    const { id } = useParams();
    const [message, setMessage] = useState("");
    const [room, setRoom] = useState("");
    const [file, setFile] = useState("");
    const [render, setRender] = useState(false);
    const {context} = useContext(AccountContext);
    const chatRef = useRef(null)

    const scrollToBottom = () => {
        chatRef.current.scrollIntoView()
    }

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

    useEffect(() => {
        scrollToBottom();
    })

    const sendMessage = (e) => {
        e.preventDefault();
        if(!file){
            if(!message) return;
        }

        const data = {
            message : message,
            author : context.username,
            room : [+id],
            user : [+context.id],
            userID : context.id
        }

        axios
            .post(URL + "/messages", data, {
                headers : {
                    'Authorization': "Bearer " + localStorage.getItem("jwt")
                }
            })
            .then(res => {
                return res.data.id
            })
            .then(refId => {
                if(file){
                    const formData = new FormData();
                    formData.append('files', file);
                    formData.append('refId', refId);            
                    formData.append('ref', 'message');
                    formData.append('field', 'image');
                    return axios.post(URL + "/upload", formData)      
                }    
            })
            .then(res => {
                socket.emit("message", JSON.stringify(data))
                let messages = room;
                if(file){
                    data.image = res.data[0]
                }
                messages.messages.push(data)
                setRoom(messages)
                setMessage("");
                setFile("");
            })
            .finally(() => {
                scrollToBottom()
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
            <h1>{room.title}</h1>
            <div className="bouble-container">
                {room ? room.messages.map((index) => {
                    let image = "";
                    for(let i = 0; i < room.users.length; i++){
                        if(index.userID === room.users[i].id){
                            image = room.users[i].profilepic.url;
                        }
                    }
                    return (
                    <ChatBouble key={index.id ? index.id : randomKey()} 
                    image={
                        image
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
            
            <ChatImage 
                file={file}
                setFile={setFile}
            />
            <form className="type-field" onSubmit={sendMessage}>
                <input value={message} onChange={typing} type="text" />
                <button type="submit" className="send"><Icon>send</Icon></button>
            </form>
        </div>
    )
}