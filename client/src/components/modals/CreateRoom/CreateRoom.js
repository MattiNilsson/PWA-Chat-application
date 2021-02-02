import { Icon } from "@material-ui/core";
import { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import { URL } from "../../../constants/constants"
import {AccountContext} from "../../../context/context";
import imageCompression from "browser-image-compression"

export default function CreateRoom(props){
    const [file, setFile] = useState("");
    const modalRef = useRef("");
    const {context} = useContext(AccountContext);
    const [friends, setFriends] = useState([]);
    const [newFriend, setNewFriend] = useState("");
    const [data, setData] = useState({
        title : "",
        users : [+props.friendID, +context.id],
        seen : [],
    })

    console.log(data.users)
    console.log(friends);

    const onChangeFile = (e) => {
        setFile(e.target.files[0]);
    }

    const onInputChange = (e) => {
        let newData = {...data};
        newData[e.target.name] = e.target.value;
        setData(newData);
    }

    const onFriendChange = (e) => {
        setNewFriend(e.target.value);
    }

    const onFriendSubmit = (e) =>{
        e.preventDefault()
        axios
            .get(URL + "/users?username=" + newFriend)
            .then((res) => {
                let newData = {...data}
                console.log(res.data[0].id)
                newData.users.push(res.data[0].id);
                setData(newData);
                let newFriends = [...friends];
                newFriends.push(res.data[0]);
                setFriends(newFriends);
                setNewFriend("");
            })
            .catch((err) => {
                console.error(err)
            })
    }

    

    const onCreateRoom = async (e) => {
        e.preventDefault();
        let compressedFile;
        console.log(data);        

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
            .post(URL + "/rooms", data, {
                headers : {
                    'Authorization': "Bearer " + localStorage.getItem("jwt")
                }
            })
            .then(res => {
                console.log(res);
                return res.data.id;
            })
            .then((refId) => {
                if(file){
                    const formData = new FormData();
                    formData.append('files', compressedFile);
                    formData.append('refId', refId);            
                    formData.append('ref', 'room');
                    formData.append('field', 'roomimage');
                    return axios.post(URL + "/upload", formData)   
                }    
            })
            .then((res) => {
                console.log(res)
                props.setModal(false);
            })
            .catch(err => console.error(err))
    }

    useEffect(() => {
        let query = ""
        for(let i = 0; i < data.users.length; i++){
            if(i !== data.users.length - 1){
                query += "id_in=" + data.users[i] + "&";
            }else{
                query += "id_in=" + data.users[i];
            }
        }
        console.log("QUERY", query);
        axios
            .get(URL + "/users?" + query )
            .then(res => {
                console.log(res);
                setFriends(res.data);
            })
            .catch(err => console.error(err))
    }, [data.users])

    useEffect(() => {
        function checkClick(e){
            if(modalRef.current && !modalRef.current.contains(e.target)){
                props.setModal(false);
            }
        }
        document.addEventListener("mousedown", checkClick);

        return(() => {
            document.removeEventListener("mousedown", checkClick);
        })

    }, [props])

    return(
        <>
        <div ref={modalRef} className="CR-modal">
            <h1>Create Room</h1>
            <div className="exitIcon" onClick={() => props.setModal(false)}><Icon>close</Icon></div>
            <form onSubmit={onFriendSubmit} className="friend-form">
                <label htmlFor="friend">Add Friend</label>
                <div className="friend-form-container">
                    <input value={newFriend} 
                        onChange={onFriendChange} 
                        name="title" 
                        type="text" 
                        id="friend" 
                        placeholder="Username" 
                    />
                    <button type="submit"><Icon>group_add</Icon></button>
                </div>
            </form>
            <div className="friend-container">
                {friends.map((friend) => {
                    return (
                        <div key={friend.id} className="friend">
                            <img src={URL + friend.profilepic.url} alt="friend"/>
                        </div>
                    )
                })}
            </div>
            <form onSubmit={onCreateRoom}>
                <label htmlFor="roomname">Room Name</label>
                <input value={data.title} 
                    onChange={onInputChange} 
                    name="title" 
                    type="text" 
                    id="roomname" 
                    placeholder="Room Name" 
                />
                <label 
                    htmlFor="profilepic" 
                    className="label-file"
                >
                    <Icon>upload</Icon>
                    {file ? file.name : "Add Picture..."}
                </label>
                <input onChange={onChangeFile} className="input-file" type="file" id="profilepic" alt="image"/>
                <button type="submit">Create Room</button>
            </form>
        </div>
        <div className="background"></div>
        </>
    )
}