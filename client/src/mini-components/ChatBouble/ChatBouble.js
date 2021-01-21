
import {URL} from "../../constants/constants"

export default function ChatBouble(props){
    const {message} = props.data;

    return(
        <div className={props.self ? "message-container self" : "message-container"}>
            <img src={URL + props.image} alt="user"/>
            <p>{message}</p>
        </div>
    )
}