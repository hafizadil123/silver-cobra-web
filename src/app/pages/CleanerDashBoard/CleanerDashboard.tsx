/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useState, useEffect} from 'react'
import {useIntl} from 'react-intl'
import axios from 'axios'
import {PageTitle} from '../../../_metronic/layout/core'
import {TrainsTable} from './TrainsTable'
const CleanerDashboardPage: FC = () => {
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
    console.log({headerJson})
    const response = await axios.post(getLoggedInUserEndPoint, {}, headerJson)

    console.log({response})
    if (response && response.data) {
      const {data} = response
    }
  }
  const getMyTrainsForInspection = async () => {
    const response = await axios.post(getMyTrainsForInspectionEndPoint, {}, headerJson)

    if (response && response.data) {
      const {data} = response
      console.log({data})
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

  return (
    <>
      <div style={{height: 'auto'}} className='main-container-dashboard'>
        <h1>My Trains</h1>
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
                  placeholder='Search'
                />
              </div>
              <div className='col-md-2 col-lg-2'>
                <button
                  type='button'
                  className='btn btn-sm btn-danger btn-active-light-primary me-3'
                  onClick={(e) => handleSearch('')}
                >
                  Clear
                </button>
              </div>
            </div>
            {trains && trains.length === 0 && (
              <div className='d-flex justify-content-center mb-5'>
                <div className='spinner-border text-primary'>
                  <span className='sr-only'>Please wait...</span>
                </div>
              </div>
            )}
            <TrainsTable className='mb-5 mb-xl-8' trains={trains} />
          </div>
        </div>
      </div>
    </>
  )
}

const CleanerDashboardWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      <CleanerDashboardPage />
    </>
  )
}

export {CleanerDashboardWrapper}
