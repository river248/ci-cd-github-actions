import React, { useCallback } from 'react'
import { format } from 'date-fns'
import { isEmpty } from 'lodash'
import { useNavigate } from 'react-router-dom'

import LatestBuild from '~/components/LatestBuild'
import { differenceInTime } from '~/utils/helper'
import routes from '~/configs/routes'
import { useStage } from '~/hooks'

function LatestBuildContainer() {
    const { latestBuild } = useStage()
    const navigate = useNavigate()

    const { repository, codePipelineBranch, version, commitId, startDateTime, endDateTime } = latestBuild
    const BRANCH_MAX_LENGTH = 21
    const BRANCH = 'Branch'
    const VERSION = 'Version'
    const COMMIT = 'Commit'
    const START_TIME = 'Start time'
    const DURATION = 'Duration'
    const EMPTY_STRING = ''

    const convertToMetadata = () => [
        {
            dataName: BRANCH,
            dataValue: codePipelineBranch,
            toolTipContent: codePipelineBranch?.length > BRANCH_MAX_LENGTH ? codePipelineBranch : EMPTY_STRING,
            hasLink: false,
        },
        { dataName: VERSION, dataValue: version, toolTipContent: EMPTY_STRING, hasLink: true },
        { dataName: COMMIT, dataValue: commitId.slice(0, 6), toolTipContent: EMPTY_STRING, hasLink: true },
        {
            dataName: START_TIME,
            dataValue: startDateTime ? format(new Date(startDateTime), 'dd/MM/yyyy HH:mm') : '-',
            toolTipContent: EMPTY_STRING,
            hasLink: false,
        },
        {
            dataName: DURATION,
            dataValue: endDateTime ? differenceInTime(startDateTime, endDateTime) : '-',
            toolTipContent: EMPTY_STRING,
            hasLink: false,
        },
    ]

    const handleGoTo = useCallback(
        (dataName, dataValue) => {
            if (dataName === VERSION) {
                navigate(`${routes.pipelineVerison}?version=${dataValue}`)
            } else if (dataName === COMMIT) {
                window.open(`https://github.com/river248/${repository}/commit/${commitId}`, '_blank')
            }
        },
        [repository, commitId],
    )

    if (isEmpty(latestBuild)) {
        return null
    }

    return convertToMetadata().map((item) => (
        <LatestBuild
            key={item.dataName}
            dataName={item.dataName}
            hasLink={item.hasLink}
            toolTipContent={item.toolTipContent}
            dataValue={item.dataValue}
            onGoto={handleGoTo}
        />
    ))
}

export default React.memo(LatestBuildContainer)
