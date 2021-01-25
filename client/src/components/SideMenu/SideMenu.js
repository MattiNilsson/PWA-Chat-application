import axios from "axios";
import { useState, useContext, useEffect } from "react";
import {URL} from "../../constants/constants";
import {AccountContext} from "../../context/context";
import { Icon } from "@material-ui/core";

import SideMenuButton from "../../mini-components/SideMenuBtn/SideMenuBtn";
import SideMenuFriend from "../../mini-components/SideMenuFriend/SideMenuFriend";

export default function SideMenu(){
    const {context, setContext} = useContext(AccountContext);
    const [friends, setFriends] = useState([]);
    const [hamburger, setHamburger] = useState(false);

    useEffect(() => {
        const getRooms = () =>{
            if(!context) return;
            axios
                .get(URL + "/rooms?_where[users_contains]=" + context.id, {
                    headers : {
                        'Authorization': "Bearer " + localStorage.getItem("jwt")
                    }
                })
                .then(res => {
                    setFriends(res.data);
                })
                .catch(err => console.error(err))
        }

        getRooms();
    }, [context])

    const onLogOut = (e) => {
        setContext(null);
        localStorage.removeItem("user");
        localStorage.removeItem("jwt");
    }

    const openHamburger = (e) => {
        setHamburger(!hamburger);
    }

    return(
        <aside className={hamburger ? "sidemenu-container hamburger" : "sidemenu-container"}>
            <div className="upper">
                <div className="ham" onClick={openHamburger}>
                    <Icon>{hamburger ? "clear" : "menu"}</Icon>
                </div>

                <SideMenuButton 
                    displayTo="Home"
                    icon="home"
                    to="/"
                    setCloseHam={setHamburger}
                />

                {context ? 
                    <SideMenuButton 
                        displayTo={context ? context.username : ""}
                        icon="home"
                        to={"/profile/" + context.id}
                        profile={context ? context.profilepic.url : ""}
                        setCloseHam={setHamburger}
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
                            setCloseHam={setHamburger}
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
                        setCloseHam={setHamburger}
                    />
                : 
                    <>
                    <SideMenuButton 
                        displayTo="Login"
                        icon="login"
                        to="/login"
                        setCloseHam={setHamburger}
                    />
                    <SideMenuButton 
                        displayTo="Create Account"
                        icon="person_add"
                        to="/signup"
                        setCloseHam={setHamburger}
                    />
                    </>
                }
            </div>  
        </aside>
    )
}