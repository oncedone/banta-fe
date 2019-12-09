import _request from '@/common/request';

// 更新用户信息
export const updateUser = data => {
    return _request({
        url: '/users/account',
        data,
    });
};
