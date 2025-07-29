
import Navbar from '../components/Navbar.jsx'
import AccountContext from '../contexts/AccountContext.jsx'

function Storage() {
  const [loggedInUser, setLoggedInUser] = useState("");
  useEffect(() => {
    loadLocalAccountData(setLoggedInUser);
  }, [])

  return (
    <StorageContext.Provider value={{loggedInUser, setLoggedInUser, signupUser, loginUser, logoutUser}}>
        <Navbar />
    </StorageContext.Provider>
  )
}

export default App