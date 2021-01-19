import {useState} from "react"
import axios from "axios";

import {Icon} from "@material-ui/core";

import {URL} from "../../constants/constants"

export default function SignUpPage(props){
    const [data, setData] = useState({
        email : "",
        username : "",
        password : "",
    })
    const [file, setFile]= useState(false);

    const onChangeForm = (e) => {
        let newData = {...data};
        newData[e.target.id] = e.target.value;
        setData(newData);
    }

    const onChangeFile = (e) => {
        setFile(e.target.files[0]);
    }

    const onSubmitForm = async (e) => {
        e.preventDefault();
        
        await axios
            .post(URL + "/users", data)
            .then(res => {
                console.log(res);
                return res.data.id;
            })
            .then((refId) => {
                const formData = new FormData();
                formData.append('files', file);
                formData.append('refId', refId);            
                formData.append('ref', 'user');
                formData.append('source', 'users-permissions');
                formData.append('field', 'profilepic');
                return axios.post(URL + "/upload", formData)       
            })
            .then((res) => console.log(res))
            .catch(err => console.error(err))
    }
    console.log(file);
    return(
        <div className="sign-container">
            <h1>Create Account</h1>
            <form onSubmit={onSubmitForm}>
                <label htmlFor="email">Email</label>
                <input onChange={onChangeForm} type="email" id="email"/>
                <label htmlFor="username">Username</label>
                <input onChange={onChangeForm} autoComplete="username" type="text" id="username"/>
                <label htmlFor="email">Password</label>
                <input onChange={onChangeForm} autoComplete="current-password" type="password" id="password"/>
                <label 
                    htmlFor="profilepic" 
                    className="label-file"
                >
                    <Icon>upload</Icon>
                    {file ? file.name : "Add Picture..."}
                </label>
                <input onChange={onChangeFile} className="input-file" type="file" id="profilepic" alt="image"/>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    )
}