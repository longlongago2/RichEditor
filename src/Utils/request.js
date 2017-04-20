export default function request(url, options) {
    return fetch(url, options)
        .then((response) => {
            // 检测是否超时
            if (response.status >= 200 && response.status < 300) {
                return response;
            }
            const error = new Error(response.statusText);
            error.response = response;
            throw error;
        })
        .then(response => response.json())
        .then(data => ({ data }))
        .catch(err => ({ err }));
}
