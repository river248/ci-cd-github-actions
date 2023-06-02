export const HttpStatusCode = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500,
}

export const githubAPI = {
    HEADERS: {
        'X-GitHub-Api-Version': '2022-11-28',
    },
    GET_BRANCHES_ROUTE: 'GET /repos/{owner}/{repo}/branches',
    WORKFLOW_DISPATCH_ROUTE: 'POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches',
}

export const socketEvent = {
    USING_PIPELINE: 'using-pipeline',
    UPDATE_PIPELINE_DATA: 'update-pipeline-data',
}

export const clientHost = ['http://localhost:3000']

export const serverHost = 'http://localhost:8080'
