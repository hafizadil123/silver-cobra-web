/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useState, useEffect} from 'react'
import {useIntl} from 'react-intl'
import axios from 'axios'
import moment from 'moment'
import {PageTitle} from '../../../_metronic/layout/core'
import {CleaningReportTable} from './CleaningReportTable'
const CleaningReportpage: FC = () => {
  const [checks, setChecks] = useState([])
  const [selectedDate, setSelectedDate] = useState<any>('')
  const [selectedSeverity, setSelectedSeverity] = useState<any>('')

  const [actualChecks, setActualChecks] = useState([])
  const [thData, setThData] = useState<any>([])
  const [actualThData, setActualThData] = useState<any>([])
  const [tBodyData, setBodyData] = useState([])
  const [actualTBodyData, setActualBodyData] = useState([])
  const [drivers, setDrivers] = useState<any>([])
  const [trains, setTrains] = useState<any>([])

  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const logged_user_detail: any = localStorage.getItem('logged_user_detail')
  const loggedInUserDetails = JSON.parse(logged_user_detail)

  const baseUrl = process.env.REACT_APP_API_URL
  const getLoggedInUserEndPoint = `${baseUrl}/api/Common/GetLoggedInUser`
  const getMyTrainsDailyCleaningReportEndPoint = `${baseUrl}/api/Common/GetTrainsDailyCleaningReport`
  const headerJson = {
    headers: {
      Authorization: `bearer ${loggedInUserDetails.access_token}`,
    },
  }

  useEffect(() => {
    let date = new Date()
    let dateFormatted = moment(date).format('yyyy-MM-DD')
    setSelectedDate(dateFormatted)
    GetTrainsDailyCleaningReport(dateFormatted)
    getLoggedInUserdata()
  }, [])
  // useEffect(() => {
  //   let date
  //   let dateFormatted
  //   setLoading(true)
  //   if (selectedDate == '') {
  //     date = new Date()
  //     dateFormatted = moment(date).format('yyyy-MM-DD')
  //     GetTrainsDailyCleaningReport(dateFormatted)
  //     return
  //   }
  //   date = new Date(selectedDate)
  //   dateFormatted = moment(date).format('yyyy-MM-DD')
  //   GetTrainsDailyCleaningReport(dateFormatted)
  // }, [selectedDate])

  const getLoggedInUserdata = async () => {
    const response = await axios.post(getLoggedInUserEndPoint, {}, headerJson)

    if (response && response.data) {
      const {data} = response
    }
  }

  const GetTrainsDailyCleaningReport = async (date: any) => {
    setLoading(true)
    const response = await axios.post(
      getMyTrainsDailyCleaningReportEndPoint,
      {date: date},
      // {},
      headerJson
    )

    if (response && response.data) {
      const {data} = response

      let thData: any = []
      if (data.trains.length > 0 && data.checks.length > 0) {
        thData.push({
          driverId: 0,
          driverName: null,
          notes: null,
          status: 1,
          trainId: 0,
          trainName: '',
        })
      }

      let tBodyData: any = []
      data.trains.forEach((item: any) => {
        thData.push({
          driverId: item.driverId,
          driverName: item.driverName,
          notes: item.notes,
          status: item.status,
          trainId: item.trainId,
          trainName: item.trainName,
          severity: item?.severity || 0,
        })
      })
      for (let i = 0; i < data.checks.length; i++) {
        let check = data.checks[i]
        let trData = []
        trData.push({
          carId: check.id,
          carName: check.name,
          checkId: check.id,
          checkValue: null,
          trainId: 0,
        })
        for (let j = 0; j < data.trains.length; j++) {
          let trainCheck = data.trains[j].Checks[i]
          trainCheck.trainId = data.trains[j].trainId
          trainCheck.severity = trainCheck.severity || 0
          trData.push(trainCheck)
        }
        tBodyData.push(trData)
      }

      // data.checks.forEach((item:any)=>{

      // })
      console.log({tBodyData})
      setThData(thData)
      setActualThData(thData)
      setBodyData(tBodyData)
      setActualBodyData(tBodyData)
      setChecks(data.checks)
      setActualChecks(data.checks)
      setTrains(data.trains)
      setLoading(false)
    }
  }
  const handleNotesUpdate = (data: any) => {
    let updatedThData = thData.map((item: any) => {
      if (item.trainId == data.trainId) {
        return {
          ...item,
          notes: data.notes,
        }
      } else {
        return item
      }
    })
    let updatedData = trains.map((item: any) => {
      if (item.trainId == data.trainId) {
        return {
          ...item,
          notes: data.notes,
        }
      } else {
        return item
      }
    })
    let actualThDataUpdate = actualThData.map((item: any) => {
      if (item.trainId == data.trainId) {
        return {
          ...item,
          notes: data.notes,
        }
      } else {
        return item
      }
    })
    setActualThData(actualThDataUpdate)

    setTrains(updatedData)
    setThData(updatedThData)
  }
  const updateData = (data: any, type: any) => {
    if (type == 'notes') {
      handleNotesUpdate(data)
      return
    }

    let updatedTrains: any = tBodyData.map((item: any) => {
      // ;
      return item.map((_item: any) => {
        if (
          _item.trainId == data.trainId &&
          _item.checkId == data.checkid &&
          _item.carId == data.carid
        ) {
          return {
            ..._item,
            checkValue: data.checkValue,
          }
          // return _item
        } else {
          return _item
        }
      })
    })
    let updatedData = trains.map((item: any) => {
      if (item.trainId === data.trainId) {
        let updatedChecks = item.Checks.map((_item: any) => {
          if (_item.checkId == data.checkid && _item.carId == data.carid) {
            return {
              ..._item,
              checkValue: data.checkValue,
            }
          } else {
            return _item
          }
        })
        return {
          ...item,
          Checks: updatedChecks,
        }
      } else {
        return item
      }
    })
    setTrains(updatedData)
    setBodyData(updatedTrains)
  }
  useEffect(() => {
    filterAccordingToSeverity(selectedSeverity)
  }, [selectedSeverity])
  const filterAccordingToSeverity = (severity: any) => {
    let searchedTrains: any = actualThData.filter((item: any) => {
      if (item.severity == severity) {
        return item
      }
    })
    let obj = {
      driverId: 0,
      driverName: null,
      notes: null,
      status: 1,
      trainId: 0,
      trainName: '',
    }
    searchedTrains.unshift(obj)
    let trainIds = searchedTrains.map((item: any) => {
      return item.trainId
    })

    let _tBodyData: any = []

    let s = 0
    for (let i = 0; i < checks.length; i++) {
      let check: any = checks[i]
      let trData = []
      trData.push({
        carId: check.id,
        carName: check.name,
        checkId: check.id,
        checkValue: null,
        trainId: 0,
      })
      for (let j = 0; j < trains.length; j++) {
        let trainId = trains[j].trainId
        if (trainIds.includes(trainId)) {
          let trainCheck = trains[j].Checks[i]
          trainCheck.trainId = trains[j].trainId

          trData.push(trainCheck)
        }
      }
      s++
      _tBodyData.push(trData)
    }

    setThData(searchedTrains)
    setBodyData(_tBodyData)
  }
  const handleSearch = (value: any) => {
    let searchedTrains: any = actualThData.filter((item: any) => {
      if (item.trainName.indexOf(value) > -1) {
        return item
      }
    })
    let obj = {
      driverId: 0,
      driverName: null,
      notes: null,
      status: 1,
      trainId: 0,
      trainName: '',
    }
    if (value !== '') {
      searchedTrains.unshift(obj)
    }
    let trainIds = searchedTrains.map((item: any) => {
      return item.trainId
    })

    let _tBodyData: any = []

    let s = 0
    for (let i = 0; i < checks.length; i++) {
      let check: any = checks[i]
      let trData = []
      trData.push({
        carId: check.id,
        carName: check.name,
        checkId: check.id,
        checkValue: null,
        trainId: 0,
      })
      for (let j = 0; j < trains.length; j++) {
        let trainId = trains[j].trainId
        if (trainIds.includes(trainId)) {
          let trainCheck = trains[j].Checks[i]
          trainCheck.trainId = trains[j].trainId

          trData.push(trainCheck)
        }
      }
      s++
      _tBodyData.push(trData)
    }

    setSearch(value)
    setThData(searchedTrains)
    setBodyData(_tBodyData)
  }
  return (
    <>
      <div style={{height: 'auto'}} className='main-container-dashboard'>
        <h1>דיווח בדיקות ניקיון יומיות</h1>
        {loading ? (
          <div className='d-flex justify-content-center mb-5'>
            <div className='spinner-border text-primary'>
              <span className='sr-only'>Please wait...</span>
            </div>
          </div>
        ) : (
          <div className='row'>
            <div className='col-lg-12'>
              <div className='row'>
                <div className='row'>
                  <div className='col-md-5'>
                    <select
                      className='form-control-sm'
                      value={selectedSeverity}
                      onChange={(e) => setSelectedSeverity(e.target.value)}
                    >
                      <option value=''></option>
                      <option value='1'>עם שגיאות</option>
                      <option value='0'>ללא שגיאות</option>
                    </select>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-md-5'>
                    <input
                      type='date'
                      className='form-control-sm mb-5'
                      onChange={(e) => {
                        setSelectedDate(e.target.value)
                      }}
                      value={selectedDate}
                    />
                    <button
                      className='btn btn-primary'
                      style={{marginRight: '30px'}}
                      onClick={(e) => {
                        let date = new Date(selectedDate)
                        let dateFormatted = moment(date).format('yyyy-MM-DD')
                        GetTrainsDailyCleaningReport(dateFormatted)
                      }}
                    >
                      רענן
                    </button>
                  </div>
                </div>
                <div className='col-md-8 col-lg-8'>
                  <input
                    type='text'
                    className='form-control'
                    value={search}
                    onChange={(e) => {
                      handleSearch(e.target.value)
                    }}
                    placeholder='חפש לפי שם רכבת'
                  />
                </div>
                <div className='col-md-4 col-lg-4'>
                  <button
                    type='button'
                    onClick={(e) => handleSearch('')}
                    className='btn btn-danger mx-3'
                  >
                    נקה חיפוש
                  </button>
                </div>
              </div>

              <CleaningReportTable
                className='mb-5 mb-xl-8'
                drivers={drivers}
                trData={tBodyData}
                thData={thData}
                selectedDate={selectedDate}
                updateData={updateData}
              />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

const CleaningReportWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      <CleaningReportpage />
    </>
  )
}

export {CleaningReportWrapper}
