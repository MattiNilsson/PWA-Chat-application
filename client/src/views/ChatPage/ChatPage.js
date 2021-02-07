import {Icon} from "@material-ui/core";
import axios from "axios";
import { useContext, useState, useEffect, useRef} from "react";
import { useParams } from "react-router-dom"; 
import {AccountContext} from "../../context/context"
import { URL } from "../../constants/constants";
import { randomKey } from "../../utils/utils";
import imageCompression from "browser-image-compression";

import ChatBouble from "../../mini-components/ChatBouble/ChatBouble"
import ChatImage from "../../components/ChatImage/ChatImage"

import {socket} from "../../socket/socket";

export default function ChatPage(props){
    const { id } = useParams();
    const [message, setMessage] = useState("");
    const [room, setRoom] = useState("");
    const [offline, setOffline] = useState(false);
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
                if(!res.data.seen.includes(+context.id)){
                    let iveSeen = [...res.data.seen];
                    iveSeen.push(+context.id);

                    axios
                        .put(URL + "/rooms/" + id, {seen : iveSeen}, {
                            headers : {
                                'Authorization': "Bearer " + localStorage.getItem("jwt")
                            }
                        })
                }
            })
            .catch(err => {
                setOffline(true);
            })
    }, [context.id, id, render])

    useEffect(() => {
        scrollToBottom();
    })

    const sendMessage = async (e) => {
        let compressedFile;

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

        if(file){
            const options = {
                maxSizeMB: 0.1,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
            }
    
            compressedFile = await imageCompression(file, options);
            console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
            console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
        }

        await axios
            .put(URL + "/rooms/" + id, {seen : [context.id]} ,{
                headers : {
                    'Authorization': "Bearer " + localStorage.getItem("jwt")
                }
            })
            .then(res => {console.log(res)})
            .catch(err => console.err(err))

        await axios
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
                    formData.append('files', compressedFile);
                    formData.append('refId', refId);            
                    formData.append('ref', 'message');
                    formData.append('field', 'image');
                    return axios.post(URL + "/upload", formData)      
                }    
            })
            .then(res => {
                data.roomname = room.title
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
                socket.emit("message", JSON.stringify(data))
            })
            .catch(err => {})
    }

    const typing = (e) => {
        setMessage(e.target.value);
    }

    return(
        <div className="chat-container">
            <h1>{room.title}</h1>
            <div className="bouble-container">
                {room && !offline ? room.messages.map((index) => {
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