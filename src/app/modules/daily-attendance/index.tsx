/* eslint-disable jsx-a11y/anchor-is-valid */
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const DailyAttendancePage = () => {

  const [responseMessage, setResponseMessage] = useState('');
  const [isStartDisabled,setStartDisabled] = useState(false);
  const [startTime,setStartTime] = useState(null);
  const [isEndDisabled,setEndDisabled] = useState(false);
  const [displayWorkActivity,setDisplayWorkActivity] = useState(false);
  const [endTime,setEndTime] = useState(null);
  const [selectedOption,setSelectedOption] = useState(null);
  const [workActivityCodeItems, setWorkActivityCodeItems] = useState([]);

  const logged_user_detail: any = localStorage.getItem('logged_user_detail');
  const loggedInUserDetails = JSON.parse(logged_user_detail);

  const baseUrl = process.env.REACT_APP_API_URL;
  const getDailyAttendanceEndpoint = `${baseUrl}/Inner/GetAttendanceDaily`;
  const saveStartShiftEndpoint = `${baseUrl}/Inner/SaveStartShift`;
  const saveEndShiftEndpoint = `${baseUrl}Inner/SaveEndShift`;

  useEffect(() => {
    getDailyAttendance();
  },[]);

  const setStartTimeStatus = (time: any) => {
    setStartDisabled(time != null);
    setStartTime(time)
  }

  const setEndTimeStatus = (time: any) => {
    setEndDisabled(time != null);
    setEndTime(time)
  }

  const getDailyAttendance = async() => {
      const response = await axios.get(getDailyAttendanceEndpoint, 
        {
          headers: {
            Authorization: `bearer ${loggedInUserDetails.access_token}`
          }
        })

      if(response && response.data.result){
        const {data} = response;
        const {result, message, latestStartTime, latestEndTime, workActivityItems, displayWorkActivity} = data;
        if(result){
          setStartTimeStatus(latestStartTime)
          setEndTimeStatus(latestEndTime)
          setDisplayWorkActivity(displayWorkActivity)
          // eslint-disable-next-line no-lone-blocks
          workActivityItems && workActivityItems.length && setWorkActivityCodeItems(workActivityItems)
        }
        setResponseMessage(message)
      }
  }

  const saveStartShiftTiming = async() => {
    const response = await axios.post(saveStartShiftEndpoint,{
      workActivityCode: selectedOption
    })

    if(response && response.data.result){
      const {data} = response;
      const {result, message} = data;
      if(result){
        setStartTimeStatus(data.time)
      }
      setResponseMessage(message)
    }
  }

  const saveEndShiftTiming = async() => {
    const response = await axios.post(saveEndShiftEndpoint,{
      workActivityCode: selectedOption
    })

    if(response && response.data.result){
      const {data} = response;
      const {result, message} = data;
      if(result){
        setEndTimeStatus(data.time)
      }
      setResponseMessage(message)
    }
  }

  const handleChange = (event: any) => {
    setSelectedOption(event.target.value);
  }

  return <div>
    {displayWorkActivity && workActivityCodeItems && workActivityCodeItems.length && <select
      aria-label=''
      data-control='select2'
      data-placeholder='Work Activity Code'
      className='form-select form-select-sm form-select-solid'
      onChange={handleChange}>
      {
        workActivityCodeItems.map(({id, name}) => <option value={id}>{`${name}`}</option>)
      }
    </select>
    }

    <div style={{width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"100px", cursor:"pointer" }}>
    <button 
      onClick={() => {
        if(displayWorkActivity && selectedOption){
          saveEndShiftTiming()
        }else{

        }
      }}
      disabled={isEndDisabled || responseMessage != null}
      type='submit' 
      id='exit_time_button' 
      className='btn btn-lg btn-secondary mb-5'>
      {isEndDisabled ? endTime : `Exit`}
    </button>
    <button 
      type='submit' 
      id='entrance_time_button'  
      className='btn btn-lg btn-primary mb-5'
      disabled={isStartDisabled || responseMessage != null}
      onClick={() => {
        if(displayWorkActivity && selectedOption){
          saveStartShiftTiming()
        }else {

        }
      }}>
      {isStartDisabled ? startTime : `Entrance`}
    </button>
    </div>
    {responseMessage && <div>{responseMessage}</div>}
  </div>
}

export default DailyAttendancePage
