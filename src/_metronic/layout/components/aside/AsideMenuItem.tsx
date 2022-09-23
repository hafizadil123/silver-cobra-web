import React from 'react'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useLocation} from 'react-router'
import {checkIsActive, KTSVG,toAbsoluteUrl} from '../../../helpers'
import {useLayout} from '../../core'

type Props = {
  to: string
  title: string
  icon?: string
  fontIcon?: string
  hasBullet?: boolean
  fontAwesomeIconClass?: string
}

const AsideMenuItem: React.FC<Props> = ({
  children,
  to,
  title,
  icon,
  fontIcon,
  fontAwesomeIconClass,
  hasBullet = false,
}) => {
  const {pathname} = useLocation()
  const isActive = checkIsActive(pathname, to)
  const {config} = useLayout()
  const {aside} = config

  return (
    <div className='menu-item'>
      <Link className={clsx('menu-link without-sub', {active: isActive})} to={to}>
        {hasBullet && (
          <span className='menu-bullet'>
            <span className='bullet bullet-dot'></span>
          </span>
        )}
        {
          icon &&  <img src={toAbsoluteUrl(`/media/icons/${icon}`)} alt='metronic' style={{maxWidth:'25px'}} />
        }
       
       
        <i className="fa-solid fa-square-info"></i>
        <i className="fa-regular fa-circle-info"></i>
        <i className="fa fa-circle-info"></i>
        <i className="fa fa-square-check"></i>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        {/* <i className={`fa ${fontAwesomeIconClass}`}></i>&nbsp;&nbsp;&nbsp; */}
        <span className='menu-title'>{title}</span>
      </Link>
      {children}
    </div>
  )
}

export {AsideMenuItem}
