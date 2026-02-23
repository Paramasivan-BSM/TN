import React from 'react'
import { Outlet } from 'react-router-dom'
import { WorkerTopBar } from '../features/worker/components/WorkerTopBar'
import Footer from '../components/Footer'

export const Worker = () => {
  return (
    <>
      <header>
        <WorkerTopBar />
      </header>
      <main style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', background: '#0a0e1a' }}>
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  )
}
