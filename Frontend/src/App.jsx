import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { loginApi } from './features/api/login';

const App = () => {

  const handleLogin=async()=>{
    const data=await signInWithPopup(auth,googleProvider)
    const token=await data.user.getIdToken()

    const loginData=await loginApi(token)

    console.log("Login data:-- ",loginData);
    
    
  }



  return (
    <div className='text-2xl p-10'>
      <button onClick={handleLogin} className='p-2 cursor-pointer active:scale-95 text-white bg-black rounded-2xl '>Continue with Google</button>
    </div>
  );
}

export default App;
