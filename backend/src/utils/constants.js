export const HttpStatusCode = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
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
    GET_COMMIT: 'GET /repos/{owner}/{repo}/commits/{ref}',
    CREATE_TAG: 'POST /repos/{owner}/{repo}/git/refs',
    GET_BRANCHES_ROUTE: 'GET /repos/{owner}/{repo}/branches',
    WORKFLOW_DISPATCH_ROUTE: 'POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches',
    GET_REPOSITORY: 'GET /repos/{owner}/{repo}',
    CANCEL_WORKFLOW: 'POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel',
}

export const workflowStatus = {
    QUEUED: 'queued',
    IN_PROGRESS: 'in_progress',
    WAITING: 'waiting',
    COMPLETED: 'completed',
    NEUTRAL: 'neutral',
    SUCCESS: 'success',
    FAILURE: 'failure',
    CANCELLED: 'cancelled',
    ACTION_REQUIRED: 'action_required',
    TIMED_OUT: 'timed_out',
    SKIPPED: 'skipped',
    STALE: 'stale',
}

export const metricEnum = {
    CODE_QUALITY: 'Code Quality',
    UNIT_TESTS: 'Unit Tests',
    UNIT_TEST_COVERAGE: 'Unit Test Coverage',
    DEPLOYMENT_CHECK: 'Deployment Check',
}

export const stageMetrics = {
    BUILD: [metricEnum.CODE_QUALITY, metricEnum.UNIT_TESTS, metricEnum.UNIT_TEST_COVERAGE],
    TEST: [metricEnum.DEPLOYMENT_CHECK],
    PRODUCTION: [metricEnum.DEPLOYMENT_CHECK],
}

export const stageName = {
    BUILD: 'build',
    TEST: 'test',
    PRODUCTION: 'production',
}

export const mainBranch = { MASTER: 'master' }

export const updateAction = {
    SET: 'set',
    PUSH: 'push',
}

export const collection = {
    METRIC: 'metrics',
    STAGE: 'stages',
    REPOSITORY: 'repositories',
    USER: 'users',
    QUEUE: 'queues',
}

export const socketEvent = {
    USING_PIPELINE: 'using-pipeline',
    UPDATE_PIPELINE_DATA: 'update-pipeline-data',
    TRIGGER_PIPELINE: 'trigger-pipeline',
    DEPLOY_TO_PRODUCTION: 'deploy-to-production',
    UPDATE_DEPLOYABLED_PRODUCTION: 'update-deployable-production',
    UPDATE_QUEUE: 'update-queue',
    STOP_BUILD: 'stop-build',
}

export const clientHost = [
    'http://localhost:3000',
    'https://ci-cd-github-actions.web.app',
    'https://ci-cd-github-actions-test.web.app',
]

export const serverHost = [
    'http://localhost:8080',
    'https://ci-cd-github-actions.onrender.com',
    'https://ci-cd-github-actions-test.onrender.com',
]
