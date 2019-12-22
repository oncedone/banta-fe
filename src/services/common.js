import request from '@/common/request';

export const getUserInfo = data => {
    return request({
        url: '/users/account'
    });
};

// 获取频道列表
export const getChannelList = (type = 0) => {
    // 0 tuijie  1 banshi
    return request({
        url: '/channels',
        data: { scenario: type },
    });
};

// 通过频道id 获取文章列表
export const getArticleList = (data) => {
    return request({
        url: '/channel',
        data,
    });
};

// 通过id 获取详情
export const getArticleById = (id) => {
    return request({
        url: `/iflows/${id}`,
    })
}
