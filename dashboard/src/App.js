import React, { Fragment } from 'react'
import { Routes, Route } from 'react-router-dom'

import { privateRoutes } from './routes'

function App() {
    return (
        <Routes>
            {privateRoutes.map((route, index) => {
                const Page = route.component

                let Layout = Fragment

                if (route.layout) {
                    Layout = route.layout
                }

                return (
                    <Route
                        key={index}
                        path={route.path}
                        element={
                            <Layout>
                                <Page />
                            </Layout>
                        }
                    />
                )
            })}
        </Routes>
    )
}

export default React.memo(App)
