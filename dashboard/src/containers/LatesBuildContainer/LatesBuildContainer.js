import React, { useCallback, useContext } from 'react'
import { format } from 'date-fns'
import { isEmpty } from 'lodash'

import LatesBuild from '~/components/LatesBuild'
import { StageContext } from '~/contexts/StageContext'
import { differenceInTime } from '~/utils/helper'

function LatesBuildContainer() {
    const { latesBuild } = useContext(StageContext)
    const { codePipelineBranch, version, commitId, startDateTime, endDateTime } = latesBuild

    if (isEmpty(latesBuild)) {
        return null
    }

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
            dataValue: format(new Date(startDateTime), 'dd/MM/yyyy HH:mm'),
            toolTipContent: EMPTY_STRING,
            hasLink: false,
        },
        {
            dataName: DURATION,
            dataValue: differenceInTime(startDateTime, endDateTime),
            toolTipContent: EMPTY_STRING,
            hasLink: false,
        },
    ]

    const handleGoTo = useCallback((dataName, dataValue) => {
        console.log(dataName, dataValue)
    }, [])

    return convertToMetadata().map((item) => (
        <LatesBuild
            key={item.dataName}
            dataName={item.dataName}
            hasLink={item.hasLink}
            toolTipContent={item.toolTipContent}
            dataValue={item.dataValue}
            onGoto={handleGoTo}
        />
    ))
}

export default React.memo(LatesBuildContainer)
