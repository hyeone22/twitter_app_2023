import { authService } from 'fbase';
import React, { useState } from 'react'
import {createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import "styles/authForm.scss"


function AuthForm() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); //이메일과 패스워드에 입력된 값을 가져와
  const [newAccount, setNewAccount] = useState(true); // true회원가입, false로그인
  const [error, setError] = useState('');

  const onChange = (e) => {
    console.log('e.target.name->',e.target.name);
    console.log(e);
    const {target:{name, value}} = e; //구조분해할당으로 타겟이라는 속성 중에서 name과 value를 가져온다
    if(name === 'email'){
      setEmail(value);
    }else if(name === 'password'){
      setPassword(value);
    }
  }

  const onSubmit = async(e) => {
    e.preventDefault();
    try {  // try catch 문 
      let data;
      if(newAccount){
        //회원가입
      data = await createUserWithEmailAndPassword(authService, email, password)
      }else{
        //로그인
      data = await signInWithEmailAndPassword(authService, email, password)
      }
      console.log(data);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
    
  }

  const toggleAccount = () => setNewAccount(prev => !prev);

  return (
    <>
    <form onSubmit={onSubmit} className="container">
        <input name='email' type='email' placeholder='Email' required 
        value={email} onChange={onChange} className="authInput" />

        <input name='password' type='password' placeholder='Password' required 
        value={password} onChange={onChange} className="authInput" />

        <input type='submit'className="authInput authSubmit"
         value={newAccount ? "Create Account" : "Log In"} />

        {error && <span className="authError">{error}</span>}
    </form>
    <span onClick={toggleAccount} className="authSwitch">
      {newAccount ? "Sign In" : "Create Account"}
    </span>
    </>
  )
}

export default AuthForm