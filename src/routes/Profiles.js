import React, { useEffect, useState } from 'react'
import { authService, db } from 'fbase'
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import Tweet from 'components/Tweet';
import "styles/Profiles.scss";

import { updateProfile } from 'firebase/auth';

function Profiles({userObj}) {
  const [tweets, setTweets] = useState([]);
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const navigate =  useNavigate(); //location 객체 역활 강제로 주소를 바꿔주는

  const onLogOutClick = () => {
    authService.signOut(); //signOut 로그아웃 메서드
    navigate('/'); //첫화면으로 이동 즉 리다이렉트 기능이다.
  }

  useEffect(() => {
    const q = query(collection(db, "tweets"),
                    where("createrId", "==", userObj.uid),
                    orderBy("createdAt","desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newArray = [];
      querySnapshot.forEach((doc) => {
        newArray.push({...doc.data(), id:doc.id});
      });
      setTweets(newArray);
    });
  },[]);

  const onSubmit = async(e) => {
    e.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(userObj, {
        displayName: newDisplayName,
        //photoURL: ,
      });
    }
  }

  const onChange = (e) => {
    const {target:{value}} = e;
    setNewDisplayName(value);
  }




  return (
    <div className='container'>
       <form onSubmit={onSubmit} className='profileForm'>
          <input type='text' onChange={onChange} value={newDisplayName}
           placeholder='Display name' className='formInput' />
          <input type='submit' value='Update Profile' className='formBtn' />
        </form>
      <button onClick={onLogOutClick} className='formBtn cancelBtn logOut'>Log Out</button>
      <div>
        {tweets.map(tweet => (
          <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.createrId === userObj.uid} />  
        ))}
      </div>  
    </div>
  )
}

export default Profiles