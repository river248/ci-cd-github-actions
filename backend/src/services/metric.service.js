import { cloneDeep, isEmpty, isNil } from 'lodash'

import { StageService } from './stage.service'
import InternalServer from '~/errors/internalServer.error'
import NotFound from '~/errors/notfound.error'
import { MetricModel } from '~/models/metric.model'
import { metricEnum, updateAction } from '~/utils/constants'

//========================================================================================+
//                                    PRIVATE FUNCTIONS                                   |
//========================================================================================+

const pushMetric = async (repository, stage, executionId, metricName, appMetricName, reportUrl, data) => {
    try {
        const dataFromJSON = JSON.parse(data)
        const appMetricData = {
            appMetrics: {
                name: appMetricName,
                reportUrl: reportUrl ? reportUrl : null,
                actual: null,
                total: null,
            },
        }

        if (metricName === metricEnum.CODE_QUALITY) {
            const qualityGates = dataFromJSON.projectStatus.conditions
            const sonarOkQualityGates = qualityGates.filter((qualityGate) => qualityGate.status === 'OK').length
            const sonarErrorQualityGates = qualityGates.filter((qualityGate) => qualityGate.status === 'ERROR').length

            appMetricData.appMetrics.actual = sonarOkQualityGates
            appMetricData.appMetrics.total = sonarOkQualityGates + sonarErrorQualityGates
        }

        if (metricName === metricEnum.UNIT_TESTS) {
            const { numPassedTests, numTotalTests } = dataFromJSON

            appMetricData.appMetrics.actual = numPassedTests
            appMetricData.appMetrics.total = numTotalTests
        }

        if (metricName === metricEnum.UNIT_TEST_COVERAGE || metricName === metricEnum.DEPLOYMENT_CHECK) {
            const { total, actual } = dataFromJSON

            appMetricData.appMetrics.actual = actual
            appMetricData.appMetrics.total = total
        }

        const [updatedAppMetric, updatedMetric] = await Promise.all([
            update(repository, stage, executionId, metricName, appMetricData, updateAction.PUSH),
            calculateMetric(repository, stage, executionId, metricName, appMetricData.appMetrics),
        ])

        return { ...updatedAppMetric, total: updatedMetric.total, actual: updatedMetric.actual }
    } catch (error) {
        if (error instanceof NotFound) {
            throw new NotFound(error.message)
        }

        throw new InternalServer(error.message)
    }
}

const calculateMetric = async (repository, stage, executionId, metricName, newAppMetric) => {
    try {
        const metrics = await MetricModel.findMetrics(repository, stage, { executionId, name: metricName })

        if (isEmpty(metrics)) {
            throw new NotFound(
                `Not found metric ${metricName} with executionId ${executionId} for stage ${stage} at repo ${repository}`,
            )
        }

        const { appMetrics } = metrics[0]
        let actual = newAppMetric.actual
        let total = newAppMetric.total

        if (!isEmpty(appMetrics)) {
            appMetrics.forEach((appMetric) => {
                if (appMetric.name !== newAppMetric.name) {
                    actual += appMetric.actual
                    total += appMetric.total
                }
            })
        }

        const res = await update(repository, stage, executionId, metricName, { actual, total }, updateAction.SET)

        return res
    } catch (error) {
        if (error instanceof NotFound) {
            throw new NotFound(error.message)
        }

        throw new InternalServer(error.message)
    }
}

//========================================================================================+
//                                    PUBLIC FUNCTIONS                                    |
//========================================================================================+

const createNew = async (data) => {
    try {
        const res = await MetricModel.createNew(data)
        return res
    } catch (error) {
        throw new InternalServer(error.message)
    }
}

const update = async (repository, stage, executionId, name, data, action) => {
    try {
        if (![updateAction.SET, updateAction.PUSH].includes(action)) {
            throw new InternalServer('Invalid action. Action must be "set" or "push"')
        }

        const res = await MetricModel.update(repository, stage, executionId, name, data, action)
        return res
    } catch (error) {
        if (error instanceof NotFound) {
            throw new NotFound(error.message)
        }

        throw new InternalServer(error.message)
    }
}

const handlePushMetric = async (repository, stage, executionId, metricName, appMetricName, reportUrl, data) => {
    try {
        const [stageData, updatedMetric] = await Promise.all([
            StageService.getStageData(repository, stage, executionId, true),
            pushMetric(repository, stage, executionId, metricName, appMetricName, reportUrl, data),
        ])

        if (isEmpty(stageData) || isNil(stageData)) {
            return null
        }

        if (isEmpty(stageData.metrics) || isNil(stageData.metrics)) {
            return null
        }

        const metrics = cloneDeep(stageData.metrics)

        const metricIndex = metrics.findIndex((metric) => metric.name === updatedMetric.name)

        if (metricIndex >= 0) {
            delete updatedMetric.repository
            delete updatedMetric.stage
            delete updatedMetric.executionId

            metrics[metricIndex] = updatedMetric
        }

        delete stageData.metrics

        return { ...stageData, metrics }
    } catch (error) {
        if (error instanceof NotFound) {
            throw new NotFound(error.message)
        }

        throw new InternalServer(error.message)
    }
}

//========================================================================================+
//                                 EXPORT PUBLIC FUNCTIONS                                |
//========================================================================================+

export const MetricService = {
    createNew,
    update,
    handlePushMetric,
}
