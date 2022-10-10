/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useState, useEffect} from 'react'
import {useIntl} from 'react-intl'
import axios from 'axios'
import moment from 'moment'
import {PageTitle} from '../../../_metronic/layout/core'
import {CleaningReportTable} from './CleaningReportTable'
const CleaningReportpage: FC = () => {
  const [checks, setChecks] = useState([])
  const [actualChecks, setActualChecks] = useState([])
  const [thData, setThData] = useState([])
  const [actualThData, setActualThData] = useState([])
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
    GetTrainsDailyCleaningReport()
    getLoggedInUserdata()
  }, [])

  const getLoggedInUserdata = async () => {
    console.log({headerJson})
    const response = await axios.post(getLoggedInUserEndPoint, {}, headerJson)

    console.log({response})
    if (response && response.data) {
      const {data} = response
    }
  }

  const GetTrainsDailyCleaningReport = async () => {
    let date = new Date()
    let dateFormatted = moment(date).format('yyyy-MM-DD')
    const response = await axios.post(
      getMyTrainsDailyCleaningReportEndPoint,
      {date: dateFormatted},
      // {},
      headerJson
    )

    if (response && response.data) {
      const {data} = response
      console.log({data})
      let thData: any = []
      thData.push({
        driverId: 0,
        driverName: null,
        notes: null,
        status: 1,
        trainId: 0,
        trainName: 'Header',
      })
      let tBodyData: any = []
      data.trains.forEach((item: any) => {
        thData.push({
          driverId: item.driverId,
          driverName: item.driverName,
          notes: item.notes,
          status: item.status,
          trainId: item.trainId,
          trainName: item.trainName,
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
          console.log({trainCheck})
          trData.push(trainCheck)
        }
        tBodyData.push(trData)
      }

      // data.checks.forEach((item:any)=>{

      // })
      console.log({thData, tBodyData})
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

  const updateData = (data: any, type: any) => {
    console.log({data, type})
    let updatedTrains: any = tBodyData.map((item: any) => {
      // console.log({item});
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
      trainName: 'Header',
    }
    if (value !== '') {
      searchedTrains.unshift(obj)
    }
    let trainIds = searchedTrains.map((item: any) => {
      return item.trainId
    })

    console.log({trainIds})
    let _tBodyData: any = []
    console.log({checks: checks.length})
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
          console.log({trainCheck})
          trData.push(trainCheck)
        }
      }
      s++
      _tBodyData.push(trData)
    }
    console.log({_tBodyData, tBodyData, s})
    console.log({searchedTrains})
    setSearch(value)
    setThData(searchedTrains)
    setBodyData(_tBodyData)
  }
  return (
    <>
      <div style={{height: 'auto'}} className='main-container-dashboard'>
        <h1>My Trains</h1>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='row'>
              <div className='col-md-8 col-lg-8'>
                <input
                  type='text'
                  className='form-control'
                  value={search}
                  onChange={(e) => {
                    handleSearch(e.target.value)
                  }}
                  placeholder='Search'
                />
              </div>
              <div className='col-md-4 col-lg-4'>
                <button
                  type='button'
                  onClick={(e) => handleSearch('')}
                  className='btn btn-danger mx-3'
                >
                  Clear
                </button>
              </div>
            </div>
            {loading ? (
              <div className='d-flex justify-content-center mb-5'>
                <div className='spinner-border text-primary'>
                  <span className='sr-only'>Please wait...</span>
                </div>
              </div>
            ) : (
              <CleaningReportTable
                className='mb-5 mb-xl-8'
                drivers={drivers}
                trData={tBodyData}
                thData={thData}
                updateData={updateData}
              />
            )}
          </div>
        </div>
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
