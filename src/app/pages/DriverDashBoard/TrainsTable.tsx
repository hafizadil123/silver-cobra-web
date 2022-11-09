/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'
import {KTSVG} from '../../../_metronic/helpers'
import {Link} from 'react-router-dom'
import moment from 'moment'
type Props = {
  className: string
  handleUpdateDriverAndRedirect: (data: any) => any
  trains: any[]
}

const TrainsTable: React.FC<Props> = ({className, trains, handleUpdateDriverAndRedirect}) => {
  return (
    <div className={`card ${className}`}>
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bolder text-muted'>
                <TableHeadView className='min-w-150px' text={`שם רכבת`} />
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {trains &&
                trains.map((item: any) => {
                  const {name, id, car1Id, car2Id, handleStatus} = item
                  return (
                    <tr>
                      <TableDataView key={id} flexValue={1} text={name} id={id} tab={'train'} />
                      <TableDataViewForButton
                        id={id}
                        car1Id={car1Id}
                        car2Id={car2Id}
                        name={name}
                        handleUpdateDriverAndRedirect={handleUpdateDriverAndRedirect}
                      />
                      <TableDataView
                        key={id}
                        flexValue={1}
                        text={handleStatus}
                        id={id}
                        tab={'handleStatus'}
                      />
                    </tr>
                  )
                })}

              {/* <tr >
                              {thData.map((item:any, index:any) => {
                                const {notes,trainId}=item;
                                return (
                                   
                                  <TableFootView index={index} trainId={trainId}  flexValue={1} text={notes}  />
                                )})}
                               </tr> */}
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  )
}

export {TrainsTable}
const TableDataViewForButton = (props: any) => {
  const {id, handleUpdateDriverAndRedirect, name, car1Id, car2Id} = props
  const createCarButtons = () => {
    return (
      <>
        {' '}
        <button
          className='btn btn-sm btn-secondary'
          style={{marginLeft: '30px'}}
          onClick={(e) => {
            handleUpdateDriverAndRedirect({
              carId: car1Id,
              name: name,
              trainId: id,
            })
          }}
        >
          {car1Id}
        </button>
        <button
          className='btn btn-sm btn-secondary'
          style={{marginLeft: '30px'}}
          onClick={(e) => {
            handleUpdateDriverAndRedirect({
              carId: car2Id,
              name: name,
              trainId: id,
            })
          }}
        >
          {car2Id}
        </button>
      </>
    )
  }
  return (
    <td>
      {/* <button
        className='btn btn-primary'
        disabled={driverId === null ? true : false}
        onClick={(e) => {
          if (driverId !== null) {
            handleUpdateDriverAndRedirect({
              trainId: id,
              driverId: driverId,
              name,
            })
          }
        }}
      >
        <span>{name}</span>
      </button> */}
      {createCarButtons()}
    </td>
  )
}
const TableDataView = (props: any) => {
  const {text, className, tab} = props
  const renderFields = () => {
    switch (tab) {
      case 'train':
        return (
          <td className={`${className} `} style={{minWidth: '150px'}}>
            <span>
              {' '}
              <span>שם רכבת {text} </span>{' '}
            </span>
          </td>
        )
      case 'handleStatus':
        return (
          <td className={`${className} `} style={{minWidth: '150px'}}>
            <span>
              {' '}
              <span>{text} </span>{' '}
            </span>
          </td>
        )
    }
  }

  return <>{renderFields()}</>
}

const TableFootView = (props: any) => {
  const {flexValue, text, index, trainId} = props
  const handleUpdateNote = (value: any) => {
    setNotes(value)
    let date = new Date()
    let dateFormatted = moment(date).format('yyyy-MM-DD')
    const dataToSend = {
      trainId,
      notes: value,
      date: dateFormatted,
    }
  }
  const [notes, setNotes] = useState('')
  useEffect(() => {
    setNotes(text)
  }, [])

  const renderFields = () => {
    return (
      <td style={{minWidth: '530px'}}>
        {index !== 0 ? (
          <input
            type='text'
            onChange={(e) => {
              handleUpdateNote(e.target.value)
            }}
            value={notes}
            className='form-control-sm'
          />
        ) : null}
      </td>
    )
  }

  return <>{renderFields()}</>
}

const TableHeadView = (props: any) => {
  const {text, className} = props

  return (
    <th style={{minWidth: '150px !important'}} className={`${className}`}>
      <span>{text}</span>
    </th>
  )
}
