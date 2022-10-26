/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import {useIntl} from 'react-intl'
import axios from 'axios'
import {TrainAssemblyTable} from './TrainAssemby'
import {PageTitle} from '../../../_metronic/layout/core'
import {useToasts} from 'react-toast-notifications'

const SingleTrainInspectionDashboardPage: FC = () => {
  const location = useLocation()
  const {addToast} = useToasts()
  const [trains, setTrains] = useState<any>([])
  const [notes, setNotes] = useState('')
  const [apiData, setApiData] = useState({})
  const [loading, setLoading] = useState(true)
  const [activeTrain, setActiveTrain] = useState<any>(null)
  const [message, setMessage] = useState('')
  const logged_user_detail: any = localStorage.getItem('logged_user_detail')
  const loggedInUserDetails = JSON.parse(logged_user_detail)
  const userRole = localStorage.getItem('userType')

  const baseUrl = process.env.REACT_APP_API_URL
  const getLoggedInUserEndPoint = `${baseUrl}/api/Common/GetLoggedInUser`
  const getSingleTrainForInspection = `${baseUrl}/api/Common/GetTrainInspection`
  const saveInspectionEndPoint = `${baseUrl}/api/Common/SaveTrainInspection`
  const headerJson = {
    headers: {
      Authorization: `bearer ${loggedInUserDetails.access_token}`,
    },
  }

  useEffect(() => {
    getLoggedInUserdata()
    getSingleTrainDataForInspection()
  }, [])

  const getLoggedInUserdata = async () => {
    const response = await axios.post(getLoggedInUserEndPoint, {}, headerJson)

    if (response && response.data) {
      const {data} = response
    }
  }
  const getSingleTrainDataForInspection = async () => {
    let pathName = location.pathname
    let splitedPath = pathName.split('/')
    let activeTrainId = splitedPath[splitedPath.length - 1]
    let activeTrainName = splitedPath[splitedPath.length - 2]
    const urlText = activeTrainName.replaceAll('trainNameQuery', ' ')

    setActiveTrain(urlText)
    let dataToSend = {
      trainId: Number(activeTrainId),
    }
    const response = await axios.post(getSingleTrainForInspection, dataToSend, headerJson)

    if (response && response.data) {
      const {data} = response

      setNotes(data.notes)
      setTrains(data.assemblies)
      setApiData(data)
      setLoading(false)
    }
  }

  const updateStatusHandler = (data: any) => {
    let updatedTrains = trains.map((item: any) => {
      if (item.id === data.assemblyId) {
        let updatedItems = item.items.map((assembly: any) => {
          if (assembly.id === data.checkId) {
            return {
              ...assembly,
              value: data.selectedValue,
            }
          } else {
            return assembly
          }
        })
        return {
          ...item,
          items: updatedItems,
        }
      } else {
        return item
      }
    })
    setTrains(updatedTrains)
  }
  const handleSubmit = async (e: any) => {
    setLoading(true)
    e.preventDefault()
    let dataToSend = {
      ...apiData,
      assemblies: trains,
      notes: notes,
    }
    const response = await axios.post(saveInspectionEndPoint, dataToSend, headerJson)

    setLoading(false)
    addToast('הביקורת עודכנה בהצלחה', {appearance: 'success', autoDismiss: true})
  }
  const handleMarkAllChecked = (value: any) => {
    let updatedTrains = trains.map((item: any) => {
      let updatedItems = item.items.map((assembly: any) => {
        return {
          ...assembly,
          value: value,
        }
      })

      return {
        ...item,
        items: updatedItems,
      }
    })
    setTrains(updatedTrains)
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
              <h1>
                {`רכבת  ` + ' ' + activeTrain}
                {userRole === 'Cleaner' ? (
                  <span style={{float: 'left', marginLeft: '50px'}}>
                    <button
                      onClick={() => {
                        handleMarkAllChecked(false)
                      }}
                      style={{marginLeft: '20px'}}
                      className='btn btn-danger btn-sm'
                    >
                      הסר סימון{' '}
                      <i
                        className='fa fa-times'
                        style={{color: '#fff', fontWeight: 'bold', cursor: 'pointer'}}
                        aria-hidden='true'
                      ></i>
                    </button>
                    <button
                      onClick={() => {
                        handleMarkAllChecked(true)
                      }}
                      className='btn btn-success btn-sm'
                    >
                      בחר הכל{' '}
                      <i
                        className='fa fa-check'
                        style={{color: '#fff', fontWeight: 'bold', cursor: 'pointer'}}
                        aria-hidden='true'
                      ></i>
                    </button>
                  </span>
                ) : null}
              </h1>
            </div>

            <div className='row'>
              {trains &&
                trains.map((item: any) => {
                  return (
                    <TrainAssemblyTable
                      assemblyName={item.name}
                      handleStatusUpdate={updateStatusHandler}
                      className='mb-5 mb-xl-8'
                      assemblyId={item.id}
                      assemblies={item.items}
                    />
                  )
                })}
            </div>
            <div className='row' style={{marginBottom: '50px'}}>
              <label className=''>הערות</label>
              <div className='col-12'>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className='form-control'
                ></textarea>
              </div>
              <div className='mt-5 text-center'>
                {loading ? (
                  <button className='btn btn-primary mr-2'>
                    {' '}
                    <span>דף בטעינה...</span>
                  </button>
                ) : (
                  <button type='button' onClick={handleSubmit} className='btn btn-primary'>
                    שמור
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

const DriverSingleTrainInspectionWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      <SingleTrainInspectionDashboardPage />
    </>
  )
}

export {DriverSingleTrainInspectionWrapper}
