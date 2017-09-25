import axios from 'axios';

export const EXPRESS_TEST_START = "EXPRESS_TEST_START";
export const expressTestStart = () => {
    return { type: EXPRESS_TEST_START }
}

export const EXPRESS_TEST_RESULTS = "EXPRESS_TEST_RESULTS";
export const expressTestResults = (data) => {
    return { type: EXPRESS_TEST_RESULTS, data }
}

export const EXPRESS_TEST_ERROR = "EXPRESS_TEST_ERROR";
export const expressTestError = (data) => {
    return { type: EXPRESS_TEST_ERROR, data }
}

export const EXPRESS_TEST = "EXPRESS_TEST";
export const expressTest = () => {
    return dispatch => {
        dispatch(expressTestStart());
        axios.get(`/api/express-test`)
            .then(res => dispatch(expressTestResults(JSON.stringify(res.data))))
            .catch(err => dispatch(expressTestError(err)))

    }
}

export const VOTER_START = "VOTER_START";
export const voterStart = () => {
    return { type: VOTER_START }
}
export const VOTER_RESULTS = "VOTER_RESULTS";
export const voterResults = (data) => {
    return { type: VOTER_RESULTS, data }
}
export const VOTER_ERROR = "VOTER_ERROR";
export const voterError = (data) => {
    return { type: VOTER_ERROR, data }
}

export const VOTER = "VOTER"
export const voter = (data) => {
    return dispatch => {
        dispatch(voterStart());
        axios.post(`/api/voting`, data)
            .then(res => dispatch(voterResults(JSON.stringify(res.data))))
            .catch(err => dispatch(voterError(err)))

    }
}

export const POOL_START = "POOL_START";
export const poolStart = () => {
    return { type: POOL_START }
}
export const POOL_RESULTS = "POOL_RESULTS";
export const poolResults = (data) => {
    return { type: POOL_RESULTS, data }
}
export const POOL_ERROR = "POOL_ERROR";
export const poolError = (data) => {
    return { type: POOL_ERROR, data }
}

export const POOL = "POOL"
export const pool = () => {
    return dispatch => {
        dispatch(poolStart());
        axios.get(`/api/voters`)
            .then(res => dispatch(poolResults(JSON.stringify(res.data))))
            .catch(err => dispatch(poolError(err)))

    }
}