import { db, storage } from 'fbase';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "styles/TweetInsert.scss";

function TweetInsert({userObj}) {

  const [tweet, setTweet] = useState("");
  const [attachment, setAttachment] = useState("");

  const onSubmit = async (e) => { // submit에 입력되고
    e.preventDefault();
    try {
      let attachmentUrl = "";
      if(attachment !== ""){
      const storageRef = ref(storage, `${userObj.uid}/${uuidv4()}`); // 사진을 스토리지에 저장
      const response = await uploadString(storageRef, attachment, 'data_url');
      console.log('response->',response)
      attachmentUrl = await getDownloadURL(ref(storage, response.ref)) //다운로드하는 url https: 로 저장
  
      }
      
      const docRef = await addDoc(collection(db, "tweets"), {
        text: tweet,
        createdAt: Date.now(),
        createrId: userObj.uid,  // 문서를 누가 작성했는지 알아내야함 userObj > 로그인한 사용자 정보
        attachmentUrl
      });
      console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      setTweet("");  // 입력되면 비워야함
      setAttachment("");
    }

    const onChange = (e) => {
      e.preventDefault();
      const {target:{value}} = (e);
      setTweet(value);  
      }

    const onFilechange = (e) => { //이미지
      console.log('e->',e);
      const {target: {files}} = e;
  
      const theFile = files[0];
      console.log('theFile->',theFile); //jpg 이미지 주소
  
      const reader = new FileReader();
      
      reader.onloadend = (finishedEvent) => {
        console.log('finishedEvent->',finishedEvent);
        const {currentTarget:{result}} = finishedEvent; //data:image
        setAttachment(result); 
      }
      reader.readAsDataURL(theFile);
    }
  
    const onclearAttachment = () => {
      setAttachment("");
    }
      
  return (
  <form onSubmit={onSubmit} className="InsertForm">
    <div className='InsertInput__container'>
    <input type='text' placeholder="what's on your mind" value={tweet} onChange={onChange}
      maxLength={120} className='InsertInput__input' />
    <input type='submit' value='&rarr;' className='InsertInput__arrow' />
    </div>
    <label htmlFor="attach-file" className='InsertInput__label'>
      <span>Add Photos</span>
      <FontAwesomeIcon icon="fa-solid fa-plus" />

    </label>
    <input type='file' accept='image/*' onChange={onFilechange}
     id='attach-file' style={{opacity:0}}/> 
    {attachment && (
      <div className='Insertform__attachment'>
        <img src={attachment} style={{backgroundImage:attachment}}  alt="" />
        <div className='Insertform__clear' onClick={onclearAttachment}>
          <span>Remove</span>
          <FontAwesomeIcon icon="fa-solid fa-xmark" />
          </div>
      </div>
    )}
  </form>
  )
}

export default TweetInsert