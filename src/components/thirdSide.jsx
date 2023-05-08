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
        const myDataRes = await axios.get(process.env.REACT_APP_APIURL+'/api/suggestUsers/'+prop.userId)
        const myData = myDataRes.data

    
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
                          
            
                        </div>
                     </div>
                )
            })
            }
        </div>

        
    </div>
  )
}
