const _request = (pathname, data) => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: 'http://api.oncedone.cn' + pathname,
            method: 'POST',
            header: {
                'content-type': "application/json"
            },
            data: {
                ...data
            },
            success(res) {
                const { data, statusCode, header } = res;
                if (statusCode !== 200) {
                    resolve({ code: statusCode, msg: '服务端异常' });
                } else {
                    if (!data) {
                        resolve({ code: -2, msg: '没有data数据' });
                    } else {
                        resolve(data);
                    }
                }
            },
            fail(err) {
                resolve({ code: -1, msg: 'request调用失败' });
            }
        });
    });
};

// 三方登录
export const oauth_login = async data => {
    return await _request('/oauth/login', data);
};

// 登录
export const login = async () => {
    return await _request('/login', data);
};

// 注册
export const register = async () => {
    return await _request('/register', data);
};
