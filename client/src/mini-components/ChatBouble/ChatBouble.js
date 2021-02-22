
import {URL} from "../../constants/constants"
import Linkify from "react-linkify"
import {useRef, useState, useEffect} from "react";

export default function ChatBouble(props){
    const {message, author, image} = props.data;
    const [full, setFull] = useState(false);
    const myRef = useRef(null);

    const fullscreen = () => {
        setFull(true);
    }   

    useEffect(() => {
        function checkClick(e){
            if(myRef.current && !myRef.current.contains(e.target)){
                setFull(false);
            }
        }
        document.addEventListener("mousedown", checkClick);

        return(() => {
            document.removeEventListener("mousedown", checkClick);
        })

    }, [])

    return(
        <div className={props.self ? "message-container self" : "message-container"}>
            <div className="img-contain"><img className="avatar" src={URL + props.image} alt="user"/></div>
            <Linkify><p>{message}</p></Linkify>
            <div className={full ? "sent-full" : "sent-image"}>
                {image ? <img ref={myRef} onClick={fullscreen} src={URL + image.url} alt="message" /> : ""}
            </div>
            <p className="author">{author}</p>
        </div>
    )
}