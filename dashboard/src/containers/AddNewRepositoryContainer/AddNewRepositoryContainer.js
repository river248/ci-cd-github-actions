import React, { useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { isEmpty, isNil } from 'lodash'
import { connect } from 'react-redux'

import AddNewRepository from '~/components/AddNewRepository'
import { createNewRepo } from '~/apis/repositoryAPI'
import { handleAddNewRepository } from '~/redux/async-logics/repositoryLogic'
import { fetchAllUser } from '~/apis/userAPI'

function AddNewRepositoryContainer({ onSubmit, addNewRepository }) {
    const [selectedMembers, setSetSelectedMembers] = useState([])
    const [members, setMembers] = useState([])
    const [repoName, setRepoName] = useState('')
    const [loading, setLoading] = useState(false)
    const [previewImage, setPreviewImage] = useState(null)
    const [selectedMembersError, setSetSelectedMembersError] = useState(false)
    const [repoNameError, setRepoNameError] = useState(false)
    const [fileError, setFileError] = useState(false)

    useEffect(() => {
        fetchAllUser().then((res) => {
            if (!isNil(res)) {
                setMembers(res.map((member) => ({ _id: member._id, name: member.name })))
            }
        })
    }, [])

    useEffect(() => {
        return () => {
            previewImage && URL.revokeObjectURL(previewImage.preview)
        }
    }, [previewImage])

    const handleSelectedMembers = useCallback((_event, value) => {
        const memberIds = value.map((member) => member._id)
        setSetSelectedMembers(memberIds)

        if (isEmpty(memberIds)) {
            setSetSelectedMembersError(true)
        } else {
            setSetSelectedMembersError(false)
        }
    }, [])

    const handleChangedName = useCallback((event) => {
        const value = event.target.value
        setRepoName(value)

        if (value.length < 4 || value.length > 50) {
            setRepoNameError(true)
        } else {
            setRepoNameError(false)
        }
    }, [])

    const handleChosenFile = useCallback((event) => {
        const file = event.target.files[0]
        if (file.size / 1024 / 1024 > 1) {
            setFileError(true)
            setPreviewImage(null)
        } else {
            setFileError(false)
            file.preview = URL.createObjectURL(file)
            setPreviewImage(file)
        }
    }, [])

    const handleSubmit = useCallback(() => {
        if (
            !isEmpty(repoName) &&
            !isEmpty(selectedMembers) &&
            !isNil(previewImage) &&
            !repoNameError &&
            !selectedMembersError
        ) {
            const callApi = async () => {
                setLoading(true)
                const res = await createNewRepo(repoName, previewImage, selectedMembers)
                if (!isEmpty(res)) {
                    addNewRepository(res)
                    onSubmit()
                }
                setLoading(false)
            }

            callApi()
        }
    }, [repoName, selectedMembers, previewImage, repoNameError, selectedMembersError])

    return (
        <AddNewRepository
            members={members}
            loading={loading}
            overSizeError={fileError}
            textError={repoNameError}
            multiTextError={selectedMembersError}
            previewImage={previewImage?.preview}
            onSelectMember={handleSelectedMembers}
            onChangeName={handleChangedName}
            onChooseFile={handleChosenFile}
            onSubmit={handleSubmit}
        />
    )
}

AddNewRepository.propTypes = {
    onSubmit: PropTypes.func,
    addNewRepository: PropTypes.func,
}

const mapDispatchToProps = (dispatch) => ({
    addNewRepository: (data) => {
        dispatch(handleAddNewRepository(data))
    },
})

export default connect(null, mapDispatchToProps)(React.memo(AddNewRepositoryContainer))
