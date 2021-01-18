import SideMenuButton from "../../mini-components/SideMenuBtn/SideMenuBtn";

export default function SideMenu(){
    return(
        <aside className="sidemenu-container">
            <div className="upper">
                
            </div>
            <div className="lower">
                <SideMenuButton 
                    displayTo="Sign In"
                    icon="login"
                    to="/home"
                />
                <SideMenuButton 
                    displayTo="Sign Up"
                    icon="person_add"
                    to="/home"
                />
                <SideMenuButton 
                    displayTo="Settings"
                    icon="settings"
                    to="/home"
                />
            </div>
        </aside>
    )
}