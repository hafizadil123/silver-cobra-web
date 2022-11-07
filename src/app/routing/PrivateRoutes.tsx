import {lazy, FC, Suspense} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {TrainsDailyReportWrapper} from '../pages/TrainsDailyReport/TrainsDailyReportWrapper'
import {CleaningReportWrapper} from '../pages/CleaningReport/CleaningReportWrapper'
import {CleanerDashboardWrapper} from '../pages/CleanerDashBoard/CleanerDashboard'
import {DriverDashboardWrapper} from '../pages/DriverDashBoard/DriverDashboardWrapper'
import {ConductorDashboardWrapper} from '../pages/ConductorDashboard/ConductorDashboard'
import {DriverSingleTrainInspectionWrapper} from '../pages/DriverTrainsInspection/TrainsInspection'
import {MenuTestPage} from '../pages/MenuTestPage'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {ChangePassword1} from '../modules/ChangePassword'
import {UserDetailsPage} from '../modules/user-details'
import {AdminInterface} from '../modules/admin-interface'
import {HebrewBirthDate} from '../modules/hebrew-birth-date'
import { ManageDailyAttendanceCheckTypesPageWrapper } from '../modules/manageDailyAttendanceCheckTypes'

const PrivateRoutes = () => {
  const BuilderPageWrapper = lazy(() => import('../pages/layout-builder/BuilderPageWrapper'))
  const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
  const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
  const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
  const DailyAttendancePage = lazy(() => import('../modules/main-attendance'))
  const DocumentsPage = lazy(() => import('../modules/documents'))
  const UploadDocumentSection = lazy(() => import('../modules/upload-document'))
  const ChatPage = lazy(() => import('../modules/apps/chat/ChatPage'))

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/driver-dashboard' />} />
        {/* Pages */}
        {/* <Route path='dashboard' element={<DashboardWrapper />} /> */}
        <Route path='builder' element={<BuilderPageWrapper />} />
        <Route path='menu-test' element={<MenuTestPage />} />
        <Route path='profile/*' element={<ChangePassword1 />} />
        <Route path='/user-details' element={<UserDetailsPage />} />
        <Route path='/user-management' element={<DashboardWrapper />} />
        <Route path='/trains-daily-report/*' element={<TrainsDailyReportWrapper />} />
        <Route path='/trains-cleaning-report/*' element={<CleaningReportWrapper />} />
        <Route path='driver-dashboard/*' element={<DriverDashboardWrapper />} />
        <Route path='conductor-dashboard/*' element={<ConductorDashboardWrapper />} />
        <Route path='cleaner-dashboard/*' element={<CleanerDashboardWrapper />} />
        <Route path='/trains-inspection/*' element={<DriverSingleTrainInspectionWrapper />} />
        <Route path='/main-attendance' element={<DailyAttendancePage />} />
        <Route path='/documents' element={<DocumentsPage />} />
        <Route path='/upload-document' element={<UploadDocumentSection />} />
        <Route path='/manage-daily-attendance-check-types' element={<ManageDailyAttendanceCheckTypesPageWrapper />} />
        {/* <Route path='/admin-interface' element={<HebrewBirthDate />} /> */}

        {/* Lazy Modules */}
        <Route
          path='crafted/pages/profile/*'
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/pages/wizards/*'
          element={
            <SuspensedView>
              <WizardsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/widgets/*'
          element={
            <SuspensedView>
              <WidgetsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/account/*'
          element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/chat/*'
          element={
            <SuspensedView>
              <ChatPage />
            </SuspensedView>
          }
        />
        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC = ({children}) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}
