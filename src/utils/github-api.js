const BASE_URL = 'https://api.github.com'

export const getIssueInfos = async(path) => {
    const url = `${BASE_URL}/repos${path}`;

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