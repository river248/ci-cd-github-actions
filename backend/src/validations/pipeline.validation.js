import Joi from 'joi'

import { HttpStatusCode } from '~/utils/constants'

const manuallyTriggerBuild = async (req, res, next) => {
    const condition = Joi.object({
        repository: Joi.string().trim().min(4).max(50).required(),
        branchName: Joi.string().trim().min(6).max(50).required(),
    })
    try {
        const validatedValue = await condition.validateAsync(req.body, { abortEarly: false })
        if (validatedValue.branchName.includes('@')) {
            throw new Error('branch name must not contain character @')
        }
        next()
    } catch (error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
            error: error.message,
        })
    }
}

const manuallyStopBuild = async (req, res, next) => {
    const condition = Joi.object({
        repository: Joi.string().trim().min(4).max(50).required(),
        executionId: Joi.string().trim().required(),
    })
    try {
        await condition.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
            error: error.message,
        })
    }
}

export const PipelineValidation = {
    manuallyTriggerBuild,
    manuallyStopBuild,
}
