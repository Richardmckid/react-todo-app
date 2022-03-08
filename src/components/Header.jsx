import { signOut } from "firebase/auth"
import { auth } from "../firebaseConfig"
const Header = () => {
    return(
        <div className="todo--header">
        <span className='todo--header-item'>Todo App</span>
        <span className='todo--header-item' onClick={() => signOut(auth)}>Log Out</span>
      </div>
    )
}

export default Header