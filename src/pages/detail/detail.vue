<template>
    <view class="p-wrapper">
        <!-- <view class="banner" auto-focus>
            <image class="banner-img" :src="banner.image_url"></image>
            <view class="title-area">
                <text class="title-text">{{ banner.title }}</text>
            </view>
        </view>
        <view class="article-meta">
            <text class="article-meta-text article-author">{{ banner.source }}</text>
            <text class="article-meta-text article-text">发表于</text>
            <text class="article-meta-text article-time">{{ banner.datetime }}</text>
        </view>
        <view class="article-content">
            <rich-text :nodes="content" style="font-size: 14px;"></rich-text>
        </view>
        <view class="comment-wrap"></view> -->
        <view class="p-detail">
            <view class="header">
                <view class="title">{{ article.title || 'title' }}</view>
                <view class="subtitle">{{ article.time || 'time' }}</view>
            </view>
            <view class="body">{{ article.content || 'content' }}</view>
            <view class="footer"></view>
        </view>
        <view v-if="loading" style="text-align: center;">loading</view>
    </view>
</template>

<script>
import htmlParser from '@/common/html-parser';
import { formatDate } from '@/common/util';
import { getArticleById } from '@/services/common';

const FAIL_CONTENT = '<p>获取信息失败1</p>';

function parseImgs(nodes) {
    nodes.forEach(node => {
        if (node.name === 'img' && node.attrs && node.attrs['data-img-size-val']) {
            const sizes = node.attrs['data-img-size-val'].split(',');
            const width = uni.upx2px(720 * 0.9);
            const height = parseInt(width * (sizes[1] / sizes[0]));
            node.attrs.style = `width:${width};height:${height};`;
        }
        if (Array.isArray(node.children)) {
            parseImgs(node.children);
        }
    });
    return nodes;
}

export default {
    data() {
        return {
            loading: true,
            id: '',
            article: {},
        };
    },
    onShareAppMessage() {
        return {
            title: this.banner.title,
            path: '/pages/detail/detail?query=' + JSON.stringify(this.banner),
        };
    },
    onLoad(event) {
        // 目前在某些平台参数会被主动 decode，暂时这样处理。
        // try {
        //     this.banner = JSON.parse(decodeURIComponent(event.id));
        // } catch (error) {
        //     this.banner = JSON.parse(event.query);
        // }

        this.id = event.id;
        this.getDetail();
    },
    methods: {
        async getDetail(id) {
            try {
                const { code, data, message } = await getArticleById(this.id);
                this.article = {
                    title: data.title,
                    content: data.content,
                    time: formatDate(data.gmtPublished),
                };
            } catch (e) {
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>

<style scoped>
/* #ifndef APP-PLUS */
page {
    min-height: 100%;
}

/* #endif */
.p-detail {
    padding: 0 20upx;
}

.title {
    margin-top: 40upx;
    font-size: 48upx;
    color: #000;
}

.subtitle {
    margin-top: 16upx;
    font-size: 30upx;
    color: #888;
}

.body {
    margin-top: 60upx;
    font-size: 30upx;
    color: #111111;
    letter-spacing: 0;
    text-align: left;
    line-height: 50upx;
}

.banner {
    height: 360upx;
    position: relative;
    background-color: #ccc;
    flex-direction: row;
    overflow: hidden;
}

.banner-img {
    flex: 1;
}

.title-area {
    position: absolute;
    left: 30upx;
    right: 30upx;
    bottom: 30upx;
    z-index: 11;
}

.title-text {
    font-size: 32upx;
    font-weight: 400;
    line-height: 42upx;
    lines: 2;
    color: #ffffff;
    overflow: hidden;
}

.article-meta {
    padding: 20upx 30upx;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
}

.article-meta-text {
    color: gray;
}

.article-text {
    font-size: 26upx;
    line-height: 50upx;
    margin: 0 20upx;
}

.article-author {
    font-size: 30upx;
}

.article-time {
    font-size: 30upx;
}

.article-content {
    font-size: 30upx;
    padding: 0 30upx;
    margin-bottom: 30upx;
    overflow: hidden;
}
</style>
