/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'
import {KTSVG} from '../../../_metronic/helpers'
import {Link} from 'react-router-dom'
import moment from 'moment'
type Props = {
  className: string

  trains: any[]
}

const TrainsTable: React.FC<Props> = ({className, trains}) => {
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
                <TableHeadView className='min-w-150px' text={`Train Name`} />
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {trains &&
                trains.map((item: any) => {
                  const {name, id} = item
                  return (
                    <tr>
                      <TableDataView key={id} flexValue={1} text={name} id={id} />
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
const TableDataView = (props: any) => {
  const {text, id, className} = props

  const renderFields = () => {
    return (
      <td className={`${className} `} style={{minWidth: '150px'}}>
        <span>
          {' '}
          <Link to={`/trains-inspection/${id}`}>{text}</Link>{' '}
        </span>
      </td>
    )
  }

  return <>{renderFields()}</>
}

const TableFootView = (props: any) => {
  const {flexValue, text, index, trainId} = props
  const handleUpdateNote = (value: any) => {
    setNotes(value)
    let date = new Date()
    let dateFormatted = moment(date).format('DD-MM-yyyy')
    const dataToSend = {
      trainId,
      notes: value,
      date: dateFormatted,
    }
    console.log({dataToSend})
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
