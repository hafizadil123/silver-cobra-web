/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import {useIntl} from 'react-intl'
import axios from 'axios'
import {PageTitle} from '../../../_metronic/layout/core'
import {useToasts} from 'react-toast-notifications'
import {TrainActiviationTable} from './TrainActivationTable'
const ConductorDashboard: FC = () => {
  const location = useLocation()
  const {addToast} = useToasts()
  const [previousDayList, setPreviousDayList] = useState<any>([])
  const [todayList, setTodayList] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const logged_user_detail: any = localStorage.getItem('logged_user_detail')
  const loggedInUserDetails = JSON.parse(logged_user_detail)
  const userRole = localStorage.getItem('userType')

  const baseUrl = process.env.REACT_APP_API_URL
  const getLoggedInUserEndPoint = `${baseUrl}/api/Common/GetLoggedInUser`
  const getTrainActivationEndPoint = `${baseUrl}/api/Common/GetTrainsForActivation`

  const headerJson = {
    headers: {
      Authorization: `bearer ${loggedInUserDetails.access_token}`,
    },
  }

  useEffect(() => {
    getLoggedInUserdata()
    getTrainsForActivation()
  }, [])

  const getLoggedInUserdata = async () => {
    console.log({headerJson})
    const response = await axios.post(getLoggedInUserEndPoint, {}, headerJson)

    console.log({response})
    if (response && response.data) {
      const {data} = response
    }
  }

  const getTrainsForActivation = async () => {
    console.log({headerJson})
    const response = await axios.post(getTrainActivationEndPoint, {}, headerJson)

    console.log({response})
    if (response && response.data) {
      const {data} = response
      setTodayList(data.todayList)
      setPreviousDayList(data.previousDayList)
      setLoading(false)
    }
  }

  return (
    <>
      <div style={{height: 'auto'}} className='main-container-dashboard container-fluid'>
        {message !== '' ? <span className='alert alert-primary'>{message}</span> : null}
        {loading ? (
          <div className='d-flex justify-content-center mb-5'>
            <div className='spinner-border text-primary'>
              <span className='sr-only'>Please wait...</span>
            </div>
          </div>
        ) : (
          <>
            <div className='row'>
              <div className='col-md-6 col-lg-6'>
                <TrainActiviationTable
                  className='mb-5 mb-xl-8'
                  hasEdit={false}
                  trains={previousDayList}
                />
              </div>

              <div className='col-md-6 col-lg-6'>
                <TrainActiviationTable className='mb-5 mb-xl-8' hasEdit={true} trains={todayList} />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

const ConductorDashboardWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      <ConductorDashboard />
    </>
  )
}

export {ConductorDashboardWrapper}
