import React from 'react'
import '../cssStyle/login.css'
import LoginModel from '../components/loginModel'
export default function Login(props) {
  return (
    <div className='d-flex justify-content-start align-items-center bg m-0'> 
    
        <LoginModel role={props.role}/>
   
    </div>
  )
}
