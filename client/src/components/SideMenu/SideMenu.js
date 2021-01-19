import SideMenuButton from "../../mini-components/SideMenuBtn/SideMenuBtn";

export default function SideMenu(){
    return(
        <aside className="sidemenu-container">
            <div className="upper">
                <SideMenuButton 
                    displayTo="Home"
                    icon="home"
                    to="/"
                />
            </div>
            <div className="lower">
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
            </div>
        </aside>
    )
}