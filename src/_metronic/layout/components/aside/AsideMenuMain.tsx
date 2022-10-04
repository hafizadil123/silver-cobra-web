/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import {FormattedMessage, useIntl} from 'react-intl'
import {KTSVG} from '../../../helpers'
import {useSelector} from 'react-redux'
import {UserModel} from '../../../../app/modules/auth/models/UserModel'
import {RootState} from '../../../../setup'
import {AsideMenuItemWithSub} from './AsideMenuItemWithSub'
import {AsideMenuItem} from './AsideMenuItem'
import {Routes} from './data'

export interface objectV {
  access_token?: string
}
export function AsideMenuMain() {
  const intl = useIntl()
  const userRole = localStorage.getItem('userType')
  const myRoutes = Routes(userRole)
  console.log({myRoutes})
  return (
    <>
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          {/* <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Crafted</span> */}
        </div>
      </div>

      {/* <AsideMenuItem to={`/builder`} title='בּוֹנֶה' hasBullet={true}></AsideMenuItem> */}
      {/* <AsideMenuItem to={`/menu-test`} title='תַפרִיט' hasBullet={true}></AsideMenuItem> */}
      {/* {
        userRole === 'OccUser' ?

      } */}
      {myRoutes.map((item: any) => {
        return <AsideMenuItem to={item.route} title={item.title} hasBullet={true}></AsideMenuItem>
      })}
    </>
  )
}
