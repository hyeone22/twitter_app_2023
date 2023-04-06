import { useEffect, useState } from "react";
import AppRouter from "Router";
import { authService } from "fbase";
import { onAuthStateChanged } from "firebase/auth";

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons'
library.add(fas, faTwitter, faGoogle, faGithub);

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser); // 처음엔 로그인이 안되있으니까
  console.log('authService.currentUser ->' ,authService.currentUser ) // currentUser는 현재 로그인한 사람 확인 함수
  
  const [userObj, setUserObj] = useState(null);

  useEffect(() => { 
    onAuthStateChanged(authService, (user) => {
      console.log('user->',user);
      if (user) {
          setIsLoggedIn(user);
          setUserObj(user);
      } else {
          setIsLoggedIn(false);
      }
      setInit(true);
    });    
  },[]);

  return (
  <>
    {init ? (<AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />
    ) : (
      "initalizing..."
    )}
  </>   
  );
}

export default App;
