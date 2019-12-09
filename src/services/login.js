import request from '@/common/request';

// 第三方登录
export const oauthLogin = (data) => {
    data = {
        ...data
    }
    return request({
        method: 'POST',
        url: '/oauth/login',
        data,
    });
};

// 获取验证码
export const getCode = mobile => {
    return request({
        url: '/validation-codes',
        method: 'POST',
        data: {
            action: 5, // 表示登录注册
            mobile,
        },
    });
};

// 获取验证码登录（或注册）的临时凭证
/*
  @params data { mobile, code }
*/
export const getCodeLoginToken = data => {
    data = {
        ...data,
    };
    return request({
        url: '/tokens',
        method: 'POST',
        data,
    });
};

// 检验登录
/*
 * @params data { mobile, code, token }
 */
export const signinOrUp = data => {
    data = {
        appId: 2, // 2标识 banta
        type: 1, // 三方授权类型 1标识微信
        ...data,
    };
    return request({
        url: '/login',
        method: 'POST',
        data,
    });
};
