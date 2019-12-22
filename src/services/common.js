import request from '@/common/request';

export const getUserInfo = (data) => {
    return request('/users/account');
}
