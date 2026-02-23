import React from 'react'
import Signup from '../features/auth/components/Signup'
import Signin from '../features/auth/components/Signin';
import { useSelector } from "react-redux";

export default function Authertication() {

  const { formtype } = useSelector((state) => state.auth);
  return (

    <>


    
    
    


    {formtype === "signin" ? <Signin /> : <Signup />}

    
</>
  
  );
}
