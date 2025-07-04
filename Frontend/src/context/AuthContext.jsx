import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

// Not capital C in children...
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [loggedIn, setLoggedId] = useState(false)

    const setUserData = (data) => {
        if (data) {
            setUser(data);
        }
    };

    const setLoggedIdFlag = (value)=>{
        setLoggedId(value)
    }

    return <AuthContext.Provider value={{ user, setUserData, loggedIn, setLoggedIdFlag }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
