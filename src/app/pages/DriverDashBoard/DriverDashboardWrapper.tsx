/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useState, useEffect, useLayoutEffect} from 'react'
import {useIntl} from 'react-intl'
import axios from 'axios'
import {PageTitle} from '../../../_metronic/layout/core'
import {TrainsTable} from './TrainsTable'
import {useNavigate} from 'react-router-dom'

const DriverDashboardPage: FC = () => {
  const navigate = useNavigate()

  const [trains, setTrains] = useState<any>([])
  const [actualTrains, setActualTrains] = useState<any>([])
  const logged_user_detail: any = localStorage.getItem('logged_user_detail')
  const loggedInUserDetails = JSON.parse(logged_user_detail)
  const [search, setSearch] = useState('')
  const baseUrl = process.env.REACT_APP_API_URL
  const getLoggedInUserEndPoint = `${baseUrl}/api/Common/GetLoggedInUser`
  const getMyTrainsForInspectionEndPoint = `${baseUrl}/api/Common/GetTrainsForInspection`
  const headerJson = {
    headers: {
      Authorization: `bearer ${loggedInUserDetails.access_token}`,
    },
  }

  useEffect(() => {
    getLoggedInUserdata()
    getMyTrainsForInspection()
  }, [])

  const getLoggedInUserdata = async () => {
    const response = await axios.post(getLoggedInUserEndPoint, {}, headerJson)

    if (response && response.data) {
      const {data} = response
    }
  }
  const getMyTrainsForInspection = async () => {
    const response = await axios.post(getMyTrainsForInspectionEndPoint, {}, headerJson)

    if (response && response.data) {
      const {data} = response

      setTrains(data.rows)
      setActualTrains(data.rows)
    }
  }

  const handleSearch = (value: any) => {
    let searchedTrains = actualTrains.filter((item: any) => {
      if (item.name.indexOf(value) > -1) {
        return item
      }
    })
    setSearch(value)
    setTrains(searchedTrains)
  }
  const type = localStorage.getItem('userType')
  if (type == 'Admin') {
    window.location.href = '/conductor-dashboard'
  } else if (type == 'OccUser') {
    window.location.href = '/trains-daily-report'
  } else if (type == 'Cleaner') {
    window.location.href = '/cleaner-dashboard'
  } else if (type == 'Conductor') {
    window.location.href = '/conductor-dashboard'
  }
  const handleUpdateDriverAndRedirect = async (data: any) => {
    const {name, carId} = data
    const urlText = name.replaceAll(' ', 'trainNameQuery')
    navigate(`/trains-inspection/${urlText}/${data.trainId}/${carId}`)
  }
  return (
    <>
      <div style={{height: 'auto'}} className='main-container-dashboard'>
        <h1>רשימת רכבות לבחירה</h1>
        <div className='container-fluid row'>
          <div className='col-lg-12'>
            <div className='row'>
              <div className='col-md-10 col-lg-10'>
                <input
                  type='text'
                  value={search}
                  onChange={(e) => {
                    handleSearch(e.target.value)
                  }}
                  className='form-control'
                  placeholder='חפש לפי שם רכבת'
                />
              </div>
              <div className='col-md-2 col-lg-2'>
                <button
                  type='button'
                  className='btn btn-sm btn-danger btn-active-light-primary me-3'
                  onClick={(e) => handleSearch('')}
                >
                  נקה חיפוש
                </button>
              </div>
            </div>
            {console.log({
              trains: trains.length
            })}
            {trains && trains.length === 0 ? (
              <div className='d-flex justify-content-center mb-5'>
                <div className='text-primary'>
                  <span className='' style={{fontSize: "16px", marginTop: "20px"}}>לא נמצאו רכבות פנויות לבחירה</span>
                </div>
              </div>
            ) : 
            <TrainsTable
              className='mb-5 mb-xl-8'
              trains={trains}
              handleUpdateDriverAndRedirect={handleUpdateDriverAndRedirect}
            />
}
          </div>
        </div>
      </div>
    </>
  )
}

const DriverDashboardWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      <DriverDashboardPage />
    </>
  )
}

export {DriverDashboardWrapper}
