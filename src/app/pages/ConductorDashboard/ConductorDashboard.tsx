/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import {useIntl} from 'react-intl'
import axios from 'axios'
import {PageTitle} from '../../../_metronic/layout/core'
import {useToasts} from 'react-toast-notifications'
import {TrainActiviationTable} from './TrainActivationTable'
import moment from 'moment'

const ConductorDashboard: FC = () => {
  const location = useLocation()
  const {addToast} = useToasts()
  const [previousDayList, setPreviousDayList] = useState<any>([])
  const [todayList, setTodayList] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [drivers, setDrivers] = useState([])
  const logged_user_detail: any = localStorage.getItem('logged_user_detail')
  const loggedInUserDetails = JSON.parse(logged_user_detail)
  const userRole = localStorage.getItem('userType')

  const baseUrl = process.env.REACT_APP_API_URL
  const getLoggedInUserEndPoint = `${baseUrl}/api/Common/GetLoggedInUser`
  const getDriversEndPoint = `${baseUrl}/api/Common/GetDrivers`
  const getTrainActivationEndPoint = `${baseUrl}/api/Common/GetTrainsForActivation`
  const saveTrainActivationEndPoint = `${baseUrl}/api/Common/SaveTrainsActivation`

  const headerJson = {
    headers: {
      Authorization: `bearer ${loggedInUserDetails.access_token}`,
    },
  }

  useEffect(() => {
    getLoggedInUserdata()
    getTrainsForActivation()
    getDrivers()
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
  const getDrivers = async () => {
    console.log({headerJson})
    const response = await axios.post(getDriversEndPoint, {}, headerJson)

    if (response && response.data) {
      const {data} = response
      console.log({data})
      setDrivers(data.Drivers)
    }
  }
  const updateDriver = (data: any) => {
    console.log({data1: data})
    let updatedTodaList = todayList.map((item: any) => {
      if (item.id == data.trainId) {
        return {
          ...item,
          driver: data.name,
          driverId: data.id,
        }
      } else {
        return item
      }
    })
    console.log({updatedTodaList})
    setTodayList(updatedTodaList)
  }
  const updateStatus = (data: any) => {
    console.log({statusData: data})
    let updatedTodaList = todayList.map((item: any) => {
      if (item.id == data.id) {
        return {
          ...item,
          Status: data.status,
        }
      } else {
        return item
      }
    })
    console.log({updatedTodaList})
    setTodayList(updatedTodaList)
  }
  const handleSubmitTrainActivation = async (e: any) => {
    e.preventDefault()
    let trains = todayList
    let date = new Date()
    let dateFormatted = moment(date).format('DD-MM-yyyy')
    console.log({trains, dateFormatted})
    let dataToSend = {
      trains,
      // date: dateFormatted,
    }
    // console.log({dataToSend})
    const response = await axios.post(saveTrainActivationEndPoint, dataToSend, headerJson)
    console.log({saveResponse: response})
    addToast('Your Train Activation Has Been Updated', {appearance: 'success'})
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
              <div className='col-md-5 col-lg-5'>
                <TrainActiviationTable
                  className='mb-5 mb-xl-8'
                  hasEdit={false}
                  drivers={drivers}
                  activeTab={'previous'}
                  updateStatus={updateStatus}
                  updateDriver={updateDriver}
                  trains={previousDayList}
                />
              </div>

              <div className='col-md-7 col-lg-7'>
                <TrainActiviationTable
                  className='mb-5 mb-xl-8'
                  drivers={drivers}
                  hasEdit={true}
                  activeTab={'today'}
                  updateStatus={updateStatus}
                  updateDriver={updateDriver}
                  trains={todayList}
                />
              </div>
            </div>
            <div className='row'>
              <div className='col-12 text-center mb-5'>
                <button
                  type='button'
                  onClick={handleSubmitTrainActivation}
                  className='btn btn-primary'
                >
                  Submit
                </button>
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
