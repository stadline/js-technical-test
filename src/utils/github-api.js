const BASE_URL = 'https://api.github.com'

const getIssueInfos = async(path) => {
    const url = `${BASE_URL}/repos${path}`;
    return await xhr(url);
}

const getComments = async(path) => {
    const url = `${BASE_URL}/repos${path}/comments`;
    return await xhr(url);
}

const xhr = async(url) => {
    try {
        const response = await fetch(url, {method: 'get'});
        if (response.status !== 200) {
            throw new Error(`Check the path ! ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error(error);
    }
}

export {getIssueInfos, getComments}