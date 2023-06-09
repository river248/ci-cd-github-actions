import { fetchAllRepositories } from '~/apis/repositoryAPI'
import { getAllRepositories, loading } from '~/redux/actions/repositoryAction'

export const handleFetchAllRepositories = () => async (dispatch) => {
    dispatch(loading(true))
    const res = await fetchAllRepositories()
    dispatch(getAllRepositories(res))
    dispatch(loading(false))
}
