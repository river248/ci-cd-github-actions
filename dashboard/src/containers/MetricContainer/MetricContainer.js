import React, { useState, Fragment, useMemo, useCallback } from 'react'
import { cloneDeep, isEmpty, isNil } from 'lodash'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import { useTheme } from '@mui/material/styles'

import Metric from '~/components/Metric'
import AppMetricsContainer from '~/containers/AppMetricsContainer'
import { useStage } from '~/hooks'

function MetricContainer() {
    const { latestBuild, metrics } = useStage()

    const [open, setOpen] = useState(false)
    const [appMetrics, setAppMetrics] = useState([])

    const theme = useTheme()

    const { stage, version } = latestBuild

    const boxStyles = useMemo(
        () => ({
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: theme.palette.common.white,
            boxShadow: 24,
            padding: theme.spacing(4),
            borderRadius: 1,
            outline: 'none',
        }),
        [],
    )

    const sortedMetrics = useMemo(() => {
        const cloneMetrics = cloneDeep(metrics)
        cloneMetrics.sort((metricA, metricB) => metricA.rank - metricB.rank)

        return cloneMetrics
    }, [JSON.stringify(metrics)])

    const handleOpenAppMetric = useCallback(
        (metricName) => {
            const appMetricsData = metrics.find((metric) => metricName === metric.name)?.appMetrics ?? []
            const newAppMetrics = appMetricsData.map((item) => ({
                ...item,
                metric: metricName,
                stage,
                version,
                deployment: null,
            }))

            setAppMetrics(newAppMetrics)
            setOpen(true)
        },
        [stage, version, JSON.stringify(metrics)],
    )

    const handleCloseAppMetric = useCallback(() => {
        setOpen(false)
    }, [])

    if (isEmpty(metrics) || isNil(metrics)) {
        return null
    }

    return (
        <Fragment>
            <Modal open={open} onClose={handleCloseAppMetric}>
                <Box sx={boxStyles}>
                    <AppMetricsContainer appMetrics={appMetrics} />
                </Box>
            </Modal>
            {sortedMetrics.map((metric) => (
                <Metric
                    key={metric.name}
                    name={metric.name}
                    actual={metric.actual}
                    total={metric.total}
                    status={metric.status}
                    hasPopup={
                        !isEmpty(metric.appMetrics) &&
                        !isNil(metric.appMetrics) &&
                        !isNil(metric.actual) &&
                        !isNil(metric.total)
                    }
                    onOpen={handleOpenAppMetric}
                />
            ))}
        </Fragment>
    )
}

export default React.memo(MetricContainer)
