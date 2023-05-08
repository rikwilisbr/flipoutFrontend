import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {useQuery} from 'react-query';
import axios from 'axios';

export default function ThirdSide(prop) {
  const navigate = useNavigate()
  const [suggestUsers, setSuggestUsers] = useState([])
  const [error, setError] = useState(false)

  useEffect(()=>{
    async function getData(){
        const myDataRes = await axios.get('http://localhost:2000/api/suggestUsers/'+prop.userId)
        const myData = myDataRes.data
        console.log(myData)
    
        if(myData) {
            setSuggestUsers(myData)
            setError(false)
        } else {
            setError(true)
        }
      }

      getData()
  },[])
  

  return (
    <div className='thirdSideContainer'>
        <div className='thirdSideHeaderContainer'>
            <h1>People to follow</h1>
        </div>
        <div className='thirdSideBodyContainer'>
            {error? <span>can't find anybody :/ </span> :
            suggestUsers.map((prop, index)=>{
                return(
                    <div key={index} className='resultsContainer'>
                        <div className='followProfile'>
                          <div></div> 
                          <div className='profilePicPOST'>
                            <img src={prop.profilePic} alt='user profile pic' />
                          </div>
                          <div className='postHeader followPostHeader'>
                            <a onClick={e => e.stopPropagation()} href={'/profile/'+prop.username}>{prop.firstname + ' ' + prop.lastname}</a>
                            <span className='username'>{'@'+prop.username}</span>
                          </div>
                          <div className='followPageContainer'>
                            <button onClick={() => {navigate('/profile/'+prop.username); window.location.reload()}} className='followPageButton'>Visit Profile</button>
                          </div>
            
                        </div>
                     </div>
                )
            })
            }
        </div>

        
    </div>
  )
}
