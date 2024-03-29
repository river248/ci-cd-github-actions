import Joi from 'joi'

import { getDB } from '~/configs/mongodb'
import { collection, stageName } from '~/utils/constants'

const repositoryCollectionSchema = Joi.object({
    name: Joi.string().trim().min(4).max(50).required(),
    thumbnail: Joi.string()
        .pattern(/^(.+)\/([^/]+)(.jpg|.png|.jpeg)$/i)
        .trim()
        .required(),
    members: Joi.array().items(Joi.string().trim().required()).required(),
    stages: Joi.array()
        .items(Joi.string().valid(stageName.BUILD, stageName.TEST, stageName.PRODUCTION).required())
        .required(),
})

const validateSchema = async (data) => {
    return await repositoryCollectionSchema.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
    try {
        const value = await validateSchema(data)
        const res = await getDB().collection(collection.REPOSITORY).insertOne(value)
        return { ...value, _id: res.insertedId.toString() }
    } catch (error) {
        throw new Error(error)
    }
}

const update = async (name, data) => {
    try {
        await getDB()
            .collection(collection.REPOSITORY)
            .findOneAndUpdate({ name }, { $set: data }, { returnOriginal: false })
    } catch (error) {
        throw new Error(error)
    }
}

const findAllRepositories = async () => {
    try {
        const res = await getDB().collection(collection.REPOSITORY).find({}).toArray()
        return res
    } catch (error) {
        throw new Error(error)
    }
}

const findRepository = async (name) => {
    try {
        const res = await getDB().collection(collection.REPOSITORY).findOne({ name })
        return res
    } catch (error) {
        throw new Error(error)
    }
}

const removeRepository = async (name) => {
    try {
        const res = await getDB().collection(collection.REPOSITORY).deleteOne({ name })

        return res
    } catch (error) {
        throw new Error(error)
    }
}

export const RepositoryModel = {
    createNew,
    update,
    findAllRepositories,
    findRepository,
    removeRepository,
}
