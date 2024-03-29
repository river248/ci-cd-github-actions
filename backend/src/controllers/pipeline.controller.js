import { BuildService } from '~/services/buid.service'
import { PipeLineService } from '~/services/pipeline.service'
import { HttpStatusCode, socketEvent } from '~/utils/constants'

const manuallyTriggerBuild = async (req, res) => {
    try {
        const { repository, branchName } = req.body

        const result = await BuildService.manuallyTriggerBuild(repository, branchName, req.firebaseDecode)

        res.status(HttpStatusCode.OK).json({ message: result })
    } catch (error) {
        res.status(error.statusCode()).json({
            error: error.message,
        })
    }
}

const manuallyStopBuild = async (req, res) => {
    try {
        const { repository, executionId } = req.body

        const result = await BuildService.manuallyStopBuild(repository, executionId, req.firebaseDecode)

        res.status(HttpStatusCode.ACCEPTED).json({ message: result })
    } catch (error) {
        res.status(error.statusCode()).json({
            error: error.message,
        })
    }
}

const getWorkflowDataFromGithub = async (req, res) => {
    try {
        const result = await PipeLineService.handlePipelineData(req.body)

        if (result) {
            const { repository } = result
            _io.to(repository).emit(socketEvent.UPDATE_PIPELINE_DATA, result)
        }

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(error.statusCode()).json({
            error: error.message,
        })
    }
}

const getFullPipeline = async (req, res) => {
    try {
        const result = await PipeLineService.getFullPipeline(req.params.repository)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(error.statusCode()).json({
            error: error.message,
        })
    }
}

const getQueue = async (req, res) => {
    try {
        const result = await BuildService.getQueue(req.params.repository)

        res.status(HttpStatusCode.OK).json(result)
    } catch (error) {
        res.status(error.statusCode()).json({
            error: error.message,
        })
    }
}

export const PipeLineController = {
    manuallyTriggerBuild,
    getWorkflowDataFromGithub,
    getFullPipeline,
    getQueue,
    manuallyStopBuild,
}
