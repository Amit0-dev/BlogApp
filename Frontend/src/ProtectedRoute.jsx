import { useEffect, useState } from "react"
import { useAuth } from "./context/AuthContext"
import { useNavigate } from "react-router-dom"

const ProtectedRoute = ({children}) => {

    const {loggedIn} = useAuth() // state
    const navigate = useNavigate()
    const [loader, setLoader] = useState(false)

    const token = localStorage.getItem("token")

    useEffect(()=>{
        setLoader(true)

        if(!token && !loggedIn){
            navigate("/")
        }

        setLoader(false)
    }, [loggedIn])

  return (
    loader ? <h2>Loading...</h2> : <>{children}</>
  )
}

export default ProtectedRoute
