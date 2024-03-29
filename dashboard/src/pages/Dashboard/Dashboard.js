import React, { Fragment, useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Modal from '@mui/material/Modal'
import { connect } from 'react-redux'
import { isEmpty, isNil } from 'lodash'

import Repository from '~/components/Repository'
import Title from '~/components/Title'
import { handleFetchAllRepositories } from '~/redux/async-logics/repositoryLogic'
import AddNewRepositoryContainer from '~/containers/AddNewRepositoryContainer'
import RemoveRepositoryContainer from '~/containers/RemoveRepositoryContainer'
import { REPOSITORY } from '~/utils/apiPropTypes'

function Dashboard({ loading, repositories, getAllRepositories }) {
    const fakeRepositories = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
    const [open, setOpen] = useState(false)
    const [removedRepo, setRemovedRepo] = useState({})

    useEffect(() => {
        getAllRepositories()
    }, [])

    const handleCloseModal = useCallback(() => {
        setOpen(false)
        setRemovedRepo({})
    }, [])

    return (
        <Box padding={2}>
            <Title content={'Repositories'} />
            <Grid container spacing={2} marginTop={2}>
                {loading ? (
                    <Fragment>
                        {fakeRepositories.map((repo) => (
                            <Grid key={repo} item xl={2} lg={2.4} md={3} sm={4} xs={6}>
                                <Repository name={repo} loading />
                            </Grid>
                        ))}
                    </Fragment>
                ) : (
                    <Fragment>
                        {!isEmpty(repositories) &&
                            !isNil(repositories) &&
                            repositories.map((repository) => (
                                <Grid key={repository.name} item xl={2} lg={2.4} md={3} sm={4} xs={6}>
                                    <Repository
                                        name={repository.name}
                                        imageUrl={repository.thumbnail}
                                        onRemove={() =>
                                            setRemovedRepo({ name: repository.name, imageUrl: repository.thumbnail })
                                        }
                                    />
                                </Grid>
                            ))}
                        <Grid item xl={2} lg={2.4} md={3} sm={4} xs={6}>
                            <Repository name={'Add new repository'} newItem onAddNew={() => setOpen(true)} />
                        </Grid>
                    </Fragment>
                )}
            </Grid>
            <Modal open={open || !isEmpty(removedRepo)} onClose={handleCloseModal}>
                <Box>
                    {open && <AddNewRepositoryContainer onSubmit={() => setOpen(false)} />}
                    {!isEmpty(removedRepo) && (
                        <RemoveRepositoryContainer removedRepo={removedRepo} onRemove={() => setRemovedRepo({})} />
                    )}
                </Box>
            </Modal>
        </Box>
    )
}

Dashboard.propTypes = {
    loading: PropTypes.bool,
    repositories: PropTypes.arrayOf(REPOSITORY),
    getAllRepositories: PropTypes.func,
}

const mapStateToProps = (state) => ({
    loading: state.repository.loading,
    repositories: state.repository.repositories,
})

const mapDispatchToProps = (dispatch) => ({
    getAllRepositories: () => {
        dispatch(handleFetchAllRepositories())
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
