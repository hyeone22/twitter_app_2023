import React, { useEffect, useState } from 'react'
import { collection, onSnapshot, query, orderBy  } from "firebase/firestore";
import { db } from 'fbase';
import Tweet from 'components/Tweet';


import TweetInsert from 'components/TweetInsert';


function Home({userObj}) {
  console.log(userObj);
  
  const [tweets, setTweets] = useState([]);
  

 /*  const getTweets = async() => {
  const querySnapshot = await getDocs(collection(db, "tweets"));
  querySnapshot.forEach((doc) => {
  console.log(`${doc.id} => ${doc.data()}`);
  const tweetObject = {...doc.data(), id:doc.id}
  setTweets(prev => [tweetObject, ...prev]); //새 트윗을 가장 먼저 보여준다.
  });
  } */

  useEffect(() => { // 글을 썼을때 최신글이 맨 위로 오게 ㅇㅇ
    // getTweets();
    const q = query(collection(db, "tweets"),
                    orderBy("createdAt","desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newArray = [];
      querySnapshot.forEach((doc) => {
        newArray.push({...doc.data(), id:doc.id});
      });
      setTweets(newArray);
    });
  },[]);


  return (
    <div className='container'>
      <TweetInsert userObj={userObj}/>
      <div>
        {tweets.map(tweet => (
         //  <div key={tweet.id}>
         //   <h4>{tweet.text}</h4>
         // </div>
          <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.createrId === userObj.uid} />
        ))}
      </div>
      <footer>&copy; {new Date().getFullYear()} Twitter app</footer>
    </div>
  )
}

export default Home