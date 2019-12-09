export default option => {
    const { url, method = 'GET', header = {}, data, } = option;

    const cookie = `banta_access_token=${uni.getStorageSync('sessionKey')}`;
    if (cookie) {
        header['cookie'] = cookie;
    }

    return new Promise((resolve, reject) => {
        uni.request({
            url: 'http://api.oncedone.cn' + url,
            method: method,
            header: {
                'content-type': 'application/json', // "application/x-www-form-urlencoded"
                ...header,
            },
            data: {
                ...data,
            },
            success(res) {
                const { data = {}, statusCode, header } = res;

                if (statusCode !== 200) {
                    return resolve({ code: statusCode, msg: '服务端异常' });
                }

                const set_cookie = header['Set-Cookie'] || header['set-cookie'];
                if (set_cookie) {
                    // Set-Cookie: banta_access_token=uaGO6NoFr9SlIH+KLYM5nWk82nxmelEm; Max-Age=2147483647; Expires=Thu, 18-Dec-2087 20:21:16 GMT; Path=/
                    const match = set_cookie.match(/(?:\s|^)banta_access_token=([^;]*)/);
                    if (match) {
                        uni.setStorageSync('sessionKey', match[1]);
                    }
                }
                resolve(data);
            },
            fail(err) {
                resolve({ code: -1, msg: 'request调用失败' });
            },
        });
    });
};
