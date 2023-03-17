import {Suspense} from 'react'
import {Outlet} from 'react-router-dom'
import {I18nProvider} from '../_metronic/i18n/i18nProvider'
import {LayoutProvider, LayoutSplashScreen} from '../_metronic/layout/core'
import {MasterInit} from '../_metronic/layout/MasterInit'
import AuthInit from './modules/auth/redux/AuthInit'
import {ToastProvider} from 'react-toast-notifications'

const App = () => {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <ToastProvider>
        <I18nProvider>
          <LayoutProvider>
            <AuthInit>
              <Outlet />
              <MasterInit />
            </AuthInit>
          </LayoutProvider>
        </I18nProvider>
      </ToastProvider>
    </Suspense>
  )
}

export {App}
