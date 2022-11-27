/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import {useIntl} from 'react-intl'
import axios from 'axios'
import {PageTitle} from '../../../_metronic/layout/core'
import {useToasts} from 'react-toast-notifications'
import {TrainActiviationTable} from './TrainActivationTable'
import moment from 'moment'
import {confirmAlert} from 'react-confirm-alert' // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import {useNavigate} from 'react-router-dom'
const ConductorDashboard: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const {addToast} = useToasts()
  const [search, setSearch] = useState('')
  const [dataLoaded, setDataLoaded] = useState(false)
  const [dummySearch, setDummySearch] = useState('')

  const [previousDayList, setPreviousDayList] = useState<any>([])
  const [isLockedPage, setIsLockedPage] = useState<boolean>(true)
  const [selectedDate, setSelectedDate] = useState<any>('')

  const [todayList, setTodayList] = useState<any>([])

  const [ActualtodayList, setActualTodayList] = useState<any>([])
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
  const saveTrainDailyStatusEndPoint = `${baseUrl}/api/Common/SaveTrainDailyStatus`
  const SaveTrainDailyDriverEndPoint = `${baseUrl}/api/Common/SaveTrainDailyDriver`

  const headerJson = {
    headers: {
      Authorization: `bearer ${loggedInUserDetails.access_token}`,
    },
  }

  useEffect(() => {
    let date = new Date()
    let dateFormatted = moment(date).format('yyyy-MM-DD')
    setSelectedDate(dateFormatted)
    getLoggedInUserdata()
    getTrainsForActivation(dateFormatted)
    getDrivers()
  }, [])

  const getLoggedInUserdata = async () => {
    const response = await axios.post(getLoggedInUserEndPoint, {}, headerJson)

    if (response && response.data) {
      const {data} = response
    }
  }
  const getPreviosDate = () => {
    let date = new Date()
    let yesterday = new Date(date.setDate(date.getDate() - 1))
    return moment(yesterday).format('DD/MM/yyyy')
  }
  const getToday = () => {
    let date = new Date()
    return moment(date).format('DD/MM/yyyy')
  }
  useEffect(() => {
    if (dataLoaded) {
      handleSearch(search)
    }
  }, [search, dataLoaded])

  const getTrainsForActivation = async (date: any) => {
    setDataLoaded(false)
    const response = await axios.post(getTrainActivationEndPoint, {date: date}, headerJson)

    if (response && response.data) {
      const {data} = response
      setTodayList(data.todayList)
      setActualTodayList(data.todayList)
      setPreviousDayList(data.previousDayList)
      setLoading(false)
      setIsLockedPage(data.isLockedPage)
      setDataLoaded(true)
    }
  }

  const getDrivers = async () => {
    const response = await axios.post(getDriversEndPoint, {}, headerJson)

    if (response && response.data) {
      const {data} = response

      setDrivers(data.Drivers)
    }
  }
  const updateDriver = async (data: any) => {
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

    setTodayList(updatedTodaList)
    setActualTodayList(updatedTodaList)
    await updateDriverAPI(data)
  }
  const updateStatus = async (data: any) => {
    console.log({data})
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

    setTodayList(updatedTodaList)
    let date = new Date(selectedDate)
    const dateFormatted = moment(date).format('yyyy-MM-DD')
    const updateTrainData = {
      trainId: data.id,
      date: dateFormatted,
      status: data.status,
    }
    const UpdateTrainStatusResponse = await axios.post(
      saveTrainDailyStatusEndPoint,
      updateTrainData,
      headerJson
    )
    if (UpdateTrainStatusResponse.data.result === true) {
      // setLoading(true)
      await getTrainsForActivation(dateFormatted)
      addToast('Status Updated', {appearance: 'success', autoDismiss: true})
    } else {
      addToast(UpdateTrainStatusResponse.data.message, {appearance: 'error', autoDismiss: true})
    }

    console.log({UpdateTrainStatusResponse})
  }

  const updateDriverAPI = async (data: any) => {
    const date = new Date(selectedDate)
    const dateFormatted = moment(date).format('yyyy-MM-DD')
    const dataToSend: any = {
      trainId: data.trainId,
      date: dateFormatted,
      driverId: Number(data.id),
    }
    const response = await axios.post(SaveTrainDailyDriverEndPoint, dataToSend, headerJson)
    if (response?.data?.result === true) {
    }
    if (response.data.result === true) {
      // setLoading(true)
      await getTrainsForActivation(dateFormatted)
      addToast('Driver Updated', {appearance: 'success', autoDismiss: true})
    } else {
      addToast(response.data.message, {appearance: 'error', autoDismiss: true})
    }
    console.log({response})
  }
  const handleUpdateDriverAndRedirect = async (data: any) => {
    const {name, carId} = data
    const urlText = name.replaceAll(' ', 'trainNameQuery')
    navigate(`/trains-inspection/${urlText}/${data.trainId}/${carId}`)
  }
  const handleSearch = (value: any) => {
    // if (value == '') {
    //   setTodayList(ActualtodayList)
    //   return
    // }
    value = value.toLowerCase()
    let searchedTrains = ActualtodayList.filter((item: any) => {
      if (item.name.toLowerCase().indexOf(value) > -1) {
        return item
      }
    })
    console.log({searchedTrains})
    setTodayList(searchedTrains)
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
              <div className='col-md-12 col-lg-12'>
                <h3>הגדרת רכבות פעילות יומית</h3>
                <div className='row'>
                  <div className='col-md-5'>
                    <input
                      type='date'
                      className='form-control-sm mb-5'
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value)
                      }}
                    />

                    <button
                      className='btn btn-primary'
                      style={{marginRight: '30px'}}
                      onClick={(e) => {
                        let date = new Date(selectedDate)
                        let dateFormatted = moment(date).format('yyyy-MM-DD')
                        getTrainsForActivation(dateFormatted)
                      }}
                    >
                      רענן
                    </button>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-md-8 col-lg-8'>
                    <input
                      type='text'
                      className='form-control'
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value)
                        // handleSearch(e.target.value)
                      }}
                      placeholder='חיפוש'
                    />
                  </div>
                  <div className='col-md-4 col-lg-4'>
                    <button
                      type='button'
                      className='btn btn-danger mx-3'
                      onClick={(e) => {
                        setSearch('')
                      }}
                    >
                      נקה חיפוש
                    </button>
                  </div>
                </div>
                <TrainActiviationTable
                  className='mb-5 mb-xl-8'
                  drivers={drivers}
                  hasEdit={true}
                  activeTab={'today'}
                  isLockedPage={isLockedPage}
                  updateStatus={updateStatus}
                  updateDriver={updateDriver}
                  handleUpdateDriverAndRedirect={handleUpdateDriverAndRedirect}
                  trains={todayList}
                />
              </div>
            </div>
            {/* <div className='row'>
              <div className='col-12 text-center mb-5'>
                <button
                  type='button'
                  onClick={handleSubmitTrainActivation}
                  className='btn btn-primary'
                >
                  שמור{' '}
                </button>
              </div>
            </div> */}
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
