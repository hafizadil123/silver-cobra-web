/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import moment from 'moment'
type Props = {
  className: string
  trains: any[]
  hasEdit: boolean
  //   handleStatusUpdate: (data: any) => any
}

const TrainActiviationTable: React.FC<Props> = ({className, trains, hasEdit}) => {
  return (
    <div className={`card ${className}`}>
      {/* {HandleSelectAllButton()} */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
            <tbody>
              {trains.map((item: any) => {
                const {name, id, driver, Status} = item
                console.log({name, driver})
                return (
                  <tr>
                    <TableDataView
                      key={id}
                      flexValue={1}
                      tab={'train'}
                      Status={Status}
                      text={name}
                      id={id}
                      edit={false}
                    />
                    <TableDataView
                      key={id}
                      flexValue={1}
                      tab={'driver'}
                      Status={Status}
                      text={driver}
                      id={id}
                      edit={false}
                    />
                    {hasEdit === true ? (
                      <TableDataView
                        key={id}
                        flexValue={1}
                        tab={'driver'}
                        edit={true}
                        Status={Status}
                        text={'edit'}
                        id={id}
                      />
                    ) : null}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export {TrainActiviationTable}
const TableDataView = (props: any) => {
  const {text, className, Status, tab, edit} = props
  const handleEditDriver = () => {
    console.log({})
  }
  const renderFields = () => {
    return tab === 'train' ? (
      <td className={`${className} `} style={{minWidth: '150px'}}>
        <span> {text} </span>
        <span style={{float: 'left'}}>
          {Status === 2 ? (
            <>
              <button
                style={{marginLeft: '16px', background: '#3F4254'}} //: '#E4E6EF'
                className='btn btn-secondary btn-sm'
              >
                <i
                  className='fa fa-times'
                  style={{color: '#c18080', fontWeight: 'bold', cursor: 'pointer'}}
                ></i>
              </button>
              <button onClick={() => {}} className='btn btn-secondary btn-sm'>
                <i
                  className='fa fa-check'
                  style={{color: '#1dd61d', fontWeight: 'bold', cursor: 'pointer'}}
                  aria-hidden='true'
                ></i>
              </button>
            </>
          ) : (
            <>
              <button
                style={{marginLeft: '16px'}} //: '#E4E6EF'
                className='btn btn-secondary btn-sm'
              >
                <i
                  className='fa fa-times'
                  style={{color: '#c18080', fontWeight: 'bold', cursor: 'pointer'}}
                ></i>
              </button>
              <button
                onClick={() => {}}
                style={{background: '#3F4254'}}
                className='btn btn-secondary btn-sm'
              >
                <i
                  className='fa fa-check'
                  style={{color: '#1dd61d', fontWeight: 'bold', cursor: 'pointer'}}
                  aria-hidden='true'
                ></i>
              </button>
            </>
          )}
        </span>
      </td>
    ) : (
      <td className={`${className} `} style={{minWidth: edit === false ? '40px' : '150px'}}>
        <span style={{float: 'left'}}>
          {edit === true ? (
            <i
              style={{cursor: 'pointer'}}
              onClick={(e) => handleEditDriver()}
              className='fa fa-edit'
            ></i>
          ) : (
            text
          )}
        </span>
      </td>
    )
  }

  return <>{renderFields()}</>
}
