/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useEffect} from 'react'
type Props = {
  checks: any[]
}
const ChecksComponent: FC<Props> = ({checks}) => {
  return (
    <>
      {checks.map((item: any, index) => {
        return (
          <div key={index} className='table-cell'>
            {item.name}
          </div>
        )
      })}
    </>
  )
}

export {ChecksComponent}
