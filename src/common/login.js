const _request = code => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: '',
            method: "POST",
            header: {
                "content-type": "",
            },
            data: {
                code,
            },
            success(res) {
                resolve(res);
            },
            fail(err) {
                reject(err);
            }
        });
    });
};

export const oauth_login = async () => {
    const [loginErr, loginRes] = await uni.login();

    if (!loginErr) {
        const { authResult } = loginRes;
        console.log(authResult);
        const { code } = authResult;

        const res = await _request(code);
    }
};

export const login = async () => {};
