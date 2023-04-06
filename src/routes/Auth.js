
import {authService} from 'fbase';
import { GoogleAuthProvider, GithubAuthProvider,
  signInWithPopup  } from "firebase/auth"; //신규회원가입을위해필요한함수
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthForm from 'components/Authform';
import "styles/auth.scss";

function Auth() {

  const onSocialClick = async (e) => {  //구글,깃허브 회원가입
    console.log('e.target.name->',e.target.name);
    const {target:{name}} = (e);
    let provider;
    if(name === "google"){
       provider = new GoogleAuthProvider(); // 변수 이름이 겹치니까 let provider 로 만듬
    }else if(name === "github"){
       provider = new GithubAuthProvider();
    }
    const data = await signInWithPopup(authService, provider);
    console.log('data->',data);
  }

  return (
    <div className='authContainer'>
      <FontAwesomeIcon icon="fa-brands fa-twitter" size='3x'color={"#04AAFF"}
        style={{marginBottom:30}} />
    <AuthForm />
      <div className="authBtns">
        <button onClick={onSocialClick} name="google" className="authBtn" >
          Continue with Google <FontAwesomeIcon icon="fa-brands fa-google" />
          </button>
        <button onClick={onSocialClick} name="github" className="authBtn" >
          Continue with Github <FontAwesomeIcon icon="fa-brands fa-github" />
          </button>
      </div>
    </div>
  )
}

export default Auth