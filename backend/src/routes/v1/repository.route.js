import express from 'express'

import { RepositoryController } from '~/controllers/repository.controller'
import { AuthMiddleware } from '~/middlewares/auth.middleware'
import { RoleMiddleware } from '~/middlewares/role.middleware'
import { RepositoryValidation } from '~/validations/repository.validation'

const router = express.Router()

router
    .delete('/:name', AuthMiddleware.isAuth, RoleMiddleware.isAdmin, RepositoryController.removeRepository)
    .post(
        '/',
        AuthMiddleware.isAuth,
        RoleMiddleware.isAdmin,
        RepositoryValidation.createNew,
        RepositoryController.createNew,
    )
    .put('/', AuthMiddleware.isAuth, RoleMiddleware.isAdmin, RepositoryValidation.update, RepositoryController.update)
    .get('/', AuthMiddleware.isAuth, RepositoryController.findAllRepositories)

export const RepositoryRoute = router
