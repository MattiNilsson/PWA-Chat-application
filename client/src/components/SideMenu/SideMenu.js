import axios from "axios";
import { useState, useContext, useEffect } from "react";
import {URL} from "../../constants/constants";
import {AccountContext} from "../../context/context";

import SideMenuButton from "../../mini-components/SideMenuBtn/SideMenuBtn";
import SideMenuFriend from "../../mini-components/SideMenuFriend/SideMenuFriend";

export default function SideMenu(){
    const {context, setContext} = useContext(AccountContext);
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        getRooms();
    }, [context])

    const getRooms = (e) =>{
        if(!context) return;
        axios
            .get(URL + "/rooms?_where[users_contains]=" + context.id, {
                headers : {
                    'Authorization': "Bearer " + localStorage.getItem("jwt")
                }
            })
            .then(res => {
                console.log(res);
                setFriends(res.data);
            })
            .catch(err => console.error(err))
    }

    const onLogOut = (e) => {
        console.log("hello?")
        setContext(null);
        localStorage.removeItem("user");
        localStorage.removeItem("jwt");
    }

    return(
        <aside className="sidemenu-container">
            <div className="upper">
                <SideMenuButton 
                    displayTo="Home"
                    icon="home"
                    to="/"
                />

                {context ? 
                    <SideMenuButton 
                        displayTo={context ? context.username : ""}
                        icon="home"
                        to={"/Account/" + context.id}
                        profile={context ? context.profilepic.url : ""}
                    />
                    : 
                    <></>
                }
            </div>
            <div className="middle">
                {context ? friends.map((friend) => {
                    return(
                        <SideMenuFriend
                            key={friend.id} 
                            displayTo={friend.users[0].username === context.username ? friend.users[1].username : friend.users[0].username}
                            icon="home"
                            to={"/room/" + friend.id}
                            profile={friend.users[0].username === context.username ? friend.users[1].profilepic.url :  friend.users[0].profilepic.url}
                        />
                    )
                }) : <></>}
            </div>
            <div className="lower">
                {context ? 
                    <SideMenuButton 
                        displayTo="Logout"
                        icon="logout"
                        to="/"
                        click={onLogOut}
                    />
                : 
                    <>
                    <SideMenuButton 
                        displayTo="Login"
                        icon="login"
                        to="/login"
                    />
                    <SideMenuButton 
                        displayTo="Create Account"
                        icon="person_add"
                        to="/signup"
                    />
                    </>
                }
            </div>  
        </aside>
    )
}