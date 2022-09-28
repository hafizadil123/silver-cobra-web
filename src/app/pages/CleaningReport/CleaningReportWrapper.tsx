/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import axios from 'axios'
import { PageTitle } from '../../../_metronic/layout/core';
import {CleaningReportTable} from './CleaningReportTable'
const CleaningReportpage: FC = () => {
 const [checks,setChecks]=useState([]);
 const [thData,setThData]=useState([]);
 const [tBodyData,setBodyData]=useState([]);
 const [drivers,setDrivers]=useState<any>([]);
  const logged_user_detail: any = localStorage.getItem('logged_user_detail');
  const loggedInUserDetails = JSON.parse(logged_user_detail);

  const baseUrl = process.env.REACT_APP_API_URL;
  const getLoggedInUserEndPoint = `${baseUrl}/api/Common/GetLoggedInUser`;
  const getMyTrainsDailyCleaningReportEndPoint = `${baseUrl}/api/Common/GetTrainsDailyCleaningReport`;
  const headerJson = {
    headers: {
      Authorization: `bearer ${loggedInUserDetails.access_token}`
    }
  }

  useEffect(() => {
    GetTrainsDailyCleaningReport();
    getLoggedInUserdata();
  }, []);
 
  const getLoggedInUserdata = async () => {
    console.log({headerJson})
    const response = await axios.post(getLoggedInUserEndPoint,{},headerJson);
    
    console.log({response})
    if (response && response.data) {
      const { data } = response;
    }
  }

  const GetTrainsDailyCleaningReport =async () =>{
    const response = await axios.post(getMyTrainsDailyCleaningReportEndPoint,{},headerJson);
    
    if (response && response.data) {
      const { data } = response;
      // let thData:any=[];
      // thData.push('Header');
      // let tBodyData:any=[];
      // data.trains.forEach((item:any)=>{
      //   thData.push(item.trainName);
      // })
      // for(let i=0;i<data.checks.length;i++) {
      //   let check=data.checks[i];
      //   let trData=[];
      //   console.log({check})
      //   trData.push({
      //     carId:check.id,
      //     carName:check.name,
      //     checkId:check.id,
      //     checkValue:null,
      //   });
      //   for(let j=0;j<data.trains.length;j++) {
      //     let trainCheck=data.trains[j].Checks[i];
      //     // console.log({trainCheck})
      //     trData.push(trainCheck);
      //   }
      //   tBodyData.push(trData); 
      // }

      // // data.checks.forEach((item:any)=>{

      // // })
      // console.log({thData,tBodyData});
      // setThData(thData);
      // setBodyData(tBodyData);
      // setChecks(data.checks);

    }
  }
 
 
  return <>
    <div style={{height:'auto'}} className='main-container-dashboard'>
      <h1>My Trains</h1>
      <div className="row">
        <div className="col-lg-12">
          <div className="row">
            <div className="col-md-8 col-lg-8">
              <input type="text" className="form-control" placeholder="Search" />
            </div>
            <div className="col-md-4 col-lg-4">
                <button type="button" className="btn btn-primary">Search</button>
                <button type="button" className="btn btn-danger mx-3">Clear</button>
            </div>
          </div>
          <CleaningReportTable className='mb-5 mb-xl-8' drivers={drivers} trData={tBodyData} thData={thData} />

        </div>
      </div>
     </div>
  </>
}

const CleaningReportWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.DASHBOARD' })}</PageTitle>
      <CleaningReportpage />
    </>
  )
}

export { CleaningReportWrapper }
 