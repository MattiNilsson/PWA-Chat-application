import axios from "axios"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import { URL } from "../../constants/constants";

export default function ProfilePage(){
    const [profile, setProfile] = useState({});
    const { id } = useParams();

    useEffect(() => {
        axios
            .get(URL + "/users/" + id)
            .then(res => {
                setProfile(res.data)
                console.log(res);
            })
            .catch(err => console.error(err))
    }, [id])

    console.log(profile);

    if(!profile.email) {
        return (<div></div>)
    }

    const {profilepic, email, firstname, lastname, username} = profile;

    return(
        <div className="profile-page">
            <div className="img-container">
                <img src={URL + profilepic.url} alt="profile" />
            </div>
            <h1>{username}</h1>
            <h2>{firstname + " " + lastname}</h2>
            <h4>{email}</h4>
        </div>
    )
}