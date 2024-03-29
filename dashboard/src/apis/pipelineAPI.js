import { toast } from 'react-toastify'

import axios from './axiosConfig'
import API_ROOT from '~/utils/serverURL'
import { resExceptionMessageHandler } from '~/utils/helper'

export const fetchFullPipeline = async (repository) => {
    try {
        const res = await axios.get(`${API_ROOT}/v1/pipeline/${repository}`)
        return res.data
    } catch (error) {
        toast.error(resExceptionMessageHandler(error))
    }
}

export const triggerPipeline = async (repository, branchName) => {
    try {
        const res = await axios.post(`${API_ROOT}/v1/pipeline/trigger-pipeline`, {
            branchName,
            repository,
        })

        toast.success(res.data.message)
    } catch (error) {
        toast.error(resExceptionMessageHandler(error))
    }
}

export const stopBuild = async (repository, executionId) => {
    try {
        const res = await axios.post(`${API_ROOT}/v1/pipeline/stop-build`, {
            repository,
            executionId,
        })

        toast.success(res.data.message)
    } catch (error) {
        toast.error(resExceptionMessageHandler(error))
    }
}

export const fetchQueue = async (repository) => {
    try {
        const res = await axios.get(`${API_ROOT}/v1/pipeline/queue/${repository}`)
        return res.data
    } catch (error) {
        toast.error(resExceptionMessageHandler(error))
    }
}
