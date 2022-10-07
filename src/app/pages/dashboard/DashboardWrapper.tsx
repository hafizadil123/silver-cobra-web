/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useState, useEffect} from 'react'
import {useIntl} from 'react-intl'
import axios from 'axios'
import moment from 'moment'
import DataTable, {createTheme} from 'react-data-table-component'
import {PageTitle} from '../../../_metronic/layout/core'
import {ChecksComponent} from './Checks'
import './dashboard-page.css'
import {ShowDataTable} from './ShowDataTable'
import {ReportTable} from './Table'
import {useToasts} from 'react-toast-notifications'

const DashboardPage: FC = () => {
  const [users, setUsers] = useState<any>([])
  const [search, setSearch] = useState('')
  const [actualUsers, setActualUsers] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const logged_user_detail: any = localStorage.getItem('logged_user_detail')
  const loggedInUserDetails = JSON.parse(logged_user_detail)
  const {addToast} = useToasts()

  const baseUrl = process.env.REACT_APP_API_URL
  const getLoggedInUserEndPoint = `${baseUrl}/api/Common/GetLoggedInUser`
  const getDriversEndPoint = `${baseUrl}/api/Common/GetDrivers`
  const getUsersEndPoint = `${baseUrl}/api/Common/GetUsers`
  const saveUserDetailsEndPoint = `${baseUrl}/api/Common/SaveUserDetails`

  const getMyTrainsDailyReportEndPoint = `${baseUrl}/api/Common/GetTrainsDailyReport`
  const getMyTrainsDailyCleaningReportEndPoint = `${baseUrl}/api/Common/GetTrainsDailyCleaningReport`
  const headerJson = {
    headers: {
      Authorization: `bearer ${loggedInUserDetails.access_token}`,
    },
  }

  useEffect(() => {
    setLoading(true)
    getUsers()
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
  const getSelectedUser = (id: any) => {
    let user = users.find((u: any) => u.userId == id)
    return user
  }
  const getUsers = async () => {
    const response = await axios.post(getUsersEndPoint, {}, headerJson)

    if (response && response.data) {
      const {data} = response
      console.log({dataaaaa: data})
      console.log({dataaaaaaaaaaaaaaa: data.users})
      setUsers(data.users)
      setActualUsers(data.users)
      setLoading(false)
    }
  }
  const saveUserDetails = async (details: any) => {
    console.log({details})
    const response = await axios.post(saveUserDetailsEndPoint, details, headerJson)
    if (response.data.result === false) {
      response.data.validationErrors.forEach((error: any) => {
        addToast(error, {appearance: 'error'})
      })
    } else {
      setLoading(true)
      getUsers()
    }
  }
  const handleSearch = (value: any) => {
    let searchedUsers = actualUsers.filter((item: any) => {
      if (item.name.indexOf(value) > -1) {
        return item
      }
    })
    setSearch(value)
    setUsers(searchedUsers)
  }
  return (
    <>
      <div style={{height: 'auto'}} className='main-container-dashboard'>
        <h1>All Users</h1>
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
                  className='btn btn-danger mx-3'
                  onClick={(e) => handleSearch('')}
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
              <ReportTable
                className='mb-5 mb-xl-8'
                getSelectedUser={getSelectedUser}
                saveUserDetails={saveUserDetails}
                users={users}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

const DashboardWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      <DashboardPage />
    </>
  )
}

export {DashboardWrapper}
