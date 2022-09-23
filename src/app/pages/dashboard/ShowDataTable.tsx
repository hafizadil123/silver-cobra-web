/* eslint-disable jsx-a11y/anchor-is-valid */
import React ,{useState} from 'react';
import {Link} from 'react-router-dom';
// import {KTSVG} from '../../../../_metronic/helpers'
// import { colors, listData, parentKeys, fieldTypes, listOneFields, listTwoFields, listThreeFields, listFourFields, listFiveTypeOneFields, listFiveTypeNintyNineFields } from './../data'
type Props = {
  className: string,
  listData: any[],
}

const ShowDataTable: React.FC<Props> = ({className,listData}) => {
  return (
    <div className={`card ${className}`}>

    
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3' style={{  width:"100%"}}>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bolder text-muted'>
                <TableHeadView className="min-w-150px text-center" text={'פעילות'} />
                <TableHeadView className="min-w-150px text-center" text="שעת התחלה<" />
                <TableHeadView className="min-w-150px text-center" text=" שעת סיום" />
                <TableHeadView className="min-w-150px text-center" text="סוג היעדרות" />
                <TableHeadView className="min-w-150px text-center" text="הערה לפעילות" />
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
            {listData.map((item) => {
                                 const {activity, startTime,endTime,absenceName,note } = item
                                return <tr  >
                                       <DataView className="text-center" dataText={activity || ''}  />
                                    <DataView className="text-center" dataText={startTime || ''}  />
                                    <DataView  className="text-center" dataText={ endTime || ''} />
                                    <DataView  className="text-center" dataText={absenceName || ''}   />
                                    <DataView  className="text-center" dataText={note || ''} />
                                </tr>
                            })}
             
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

export {ShowDataTable}
const DataView = (props: any) => {
    const {dataText ,className } = props;
    return (
        <>
            {
               <td style={{ whiteSpace:'nowrap', padding: '5px 5px' }}  className={`${className}`}>{dataText}</td>
            }
        </>
    )
}

const TableHeadView = (props: any) => {
  const {  text,className } = props;
  return (
      <th className={`${className}`}>{text}</th>
  )
}