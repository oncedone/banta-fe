<template>
    <view class="tabs">
        <scroll-view
            id="tab-bar"
            class="scroll-h"
            :scroll-x="true"
            :show-scrollbar="false"
            :scroll-into-view="scrollInto"
        >
            <view
                v-for="(tab, index) in tabBars"
                :key="tab.id"
                class="uni-tab-item"
                :id="tab.id"
                :data-current="index"
                @click="ontabtap"
            >
                <text
                    class="uni-tab-item-title"
                    :class="tabIndex == index ? 'uni-tab-item-title-active' : ''"
                    >{{ tab.name }}</text
                >
            </view>
        </scroll-view>
        <!-- <view class="line-h"></view> -->
        <swiper
            :current="tabIndex"
            class="swiper-box"
            style="flex: 1;height: 100%;"
            :duration="300"
            @change="ontabchange"
            @transition="onswiperscroll"
        >
            <swiper-item class="swiper-item" v-for="(tab, index1) in newsList" :key="index1">
                <list
                    class="scroll-v list"
                    enableBackToTop="true"
                    scroll-y
                    @scrolltolower="loadMore(index1)"
                >
                    <view v-for="(newsitem, index2) in tab.data" :key="newsitem.id">
                        <media-item
                            :options="newsitem"
                            @close="dislike(index1, index2)"
                            @click="goDetail(newsitem)"
                        />
                    </view>
                    <view class="loading-more" v-if="tab.isLoading">
                        <text class="loading-more-text">{{ tab.loadingText }}</text>
                    </view>
                </list>
                <no-data class="no-data" v-if="tab.isNoData" @retry="loadMore"></no-data>
            </swiper-item>
        </swiper>
    </view>
</template>
<script>
import { getChannelList, getArticleList } from '@/services/common';
import { friendlyDate, formatDate } from '@/common/util.js';

import noData from '@/components/nodata.vue';
import mediaItem from './list-item.vue';

const ACTION_TYPE = {
    up: 1,
    down: 2,
};

// 缓存每页最多
const MAX_CACHE_DATA = 100;
// 缓存页签数量
const MAX_CACHE_PAGE = 3;

const TAB_PRELOAD_OFFSET = 5;

var dateList = [];

export default {
    components: {
        noData,
        mediaItem,
    },
    data() {
        return {
            hasInited: false,
            newsList: [],
            cacheTab: [],
            tabIndex: 0,
            tabBars: [],
            scrollInto: '',
            showTips: false,
            navigateFlag: false,
            pulling: false,
            refreshIcon:
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAB5QTFRFcHBw3Nzct7e39vb2ycnJioqK7e3tpqam29vb////D8oK7wAAAAp0Uk5T////////////ALLMLM8AAABxSURBVHja7JVBDoAgDASrjqj//7CJBi90iyYeOHTPMwmFZrHjYyyFYYUy1bwUZqtJIYVxhf1a6u0R7iUvWsCcrEtwJHp8MwMdvh2amHduiZD3rpWId9+BgPd7Cc2LIkPyqvlQvKxKBJ//Qwq/CacAAwDUv0a0YuKhzgAAAABJRU5ErkJggg==',
        };
    },
    async onLoad() {
        this.scrollTimer = null;
        this.pullTimer = null;
        this.preloading = false;

        const { data, code, message } = await getChannelList(1);

        this.tabBars = data.map(item => ({
            id: item.id,
            newsid: item.id,
            name: item.name,
        }));

        this.tabBars.forEach(tabBar => {
            this.newsList.push({
                data: [],
                refreshing: false,
                refreshFlag: false,
                refreshText: '',
                isLoading: false,
                loadingText: '加载中...',
                isNoData: false,
                pulling: false,
                angle: 0,
                requestParams: {
                    channelId: tabBar.newsid,
                    scenario: 1,
                    recoId: '', // 上一次请求返回的id
                    method: 'history', // new：下拉刷新  history：上拉刷新
                    // minId: 0,
                    // pageSize: 10,
                    // column: 'id,post_id,title,author_name,cover,published_at,comments_count',
                },
            });
        });
        this.getList(0, ACTION_TYPE.down);
    },
    methods: {
        async getList(index, action = ACTION_TYPE.up) {
            let activeTab = this.newsList[index];
            if (activeTab.isLoading) {
                return;
            }

            // activeTab.requestParams.time = new Date().getTime() + '';

            if (action === ACTION_TYPE.down) {
                activeTab.requestParams.method = 'new';
            }

            activeTab.isLoading = true;
            activeTab.isNoData = false;

            try {
                const { data, code, message } = await getArticleList(activeTab.requestParams);

                if (+code !== 0) {
                    return;
                }

                const { cards, items = [] } = data;

                activeTab.isNoData = items.length <= 0;

                const tranform_data = [];

                items.forEach(({ id, type }) => {
                    const { multi, subItems = [] } = cards[id];
                    // 组合卡片
                    subItems.forEach(item => {
                        tranform_data.push({
                            id: item.itemId,
                            publish_time: formatDate(item.gmtPublished),
                            title: item.title,
                            url: item.url,
                            summary: item.summary,
                        });
                    });
                });
                if (action === ACTION_TYPE.down) {
                    activeTab.data = tranform_data;
                } else {
                    tranform_data.forEach(news => {
                        activeTab.data.push(news);
                    });
                }
                console.log(activeTab.data);
                activeTab.requestParams.recoId = tranform_data[tranform_data.length - 1].id;
            } catch (e) {
                activeTab.isNoData = true;
            } finally {
                activeTab.isLoading = false;
                if (action === 1) {
                    if (activeTab.pullTimer) {
                        clearTimeout(activeTab.pullTimer);
                    }
                    activeTab.pullTimer = setTimeout(() => {
                        activeTab.pulling = false;
                    }, 500);
                    activeTab.refreshing = false;
                    activeTab.refreshText = '已刷新';
                    activeTab.refreshFlag = false;
                }
            }
        },
        goDetail(detail) {
            if (this.navigateFlag) {
                return;
            }
            this.navigateFlag = true;
            uni.navigateTo({
                url: '/pages/detail/detail?id=' + detail.id,
            });
            setTimeout(() => {
                this.navigateFlag = false;
            }, 200);
        },
        dislike(tabIndex, newsIndex) {
            uni.showModal({
                content: '不感兴趣？',
                success: res => {
                    if (res.confirm) {
                        this.newsList[tabIndex].data.splice(newsIndex, 1);
                    }
                },
            });
        },
        loadMore(e) {
            this.getList(this.tabIndex, 2);
        },
        onswiperscroll(e) {
            var offsetX = e.detail.dx;
            var preloadIndex = this.tabIndex;
            if (offsetX > TAB_PRELOAD_OFFSET) {
                preloadIndex++;
            } else if (offsetX < -TAB_PRELOAD_OFFSET) {
                preloadIndex--;
            }
            if (
                preloadIndex === this.tabIndex ||
                preloadIndex < 0 ||
                preloadIndex > this.newsList.length - 1
            ) {
                return;
            }
            if (this.newsList[preloadIndex].data.length === 0) {
                // TODO
                if (this.preloading) {
                    return;
                }
                this.getList(preloadIndex);
            }
        },
        ontabtap(e) {
            let index = e.target.dataset.current || e.currentTarget.dataset.current;
            this.switchTab(index);
        },
        ontabchange(e) {
            // 注意：百度小程序会触发2次
            let index = e.target.current || e.detail.current;
            if (this.scrollTimer == null) {
                clearTimeout(this.scrollTimer);
            }
            this.preloading = true;
            this.scrollTimer = setTimeout(() => {
                this.switchTab(index);
                this.preloading = false;
            }, 400);
        },
        switchTab(index) {
            if (this.newsList[index].data.length === 0) {
                this.getList(index);
            }

            if (this.tabIndex === index) {
                return;
            }

            // 缓存 tabId
            if (this.newsList[this.tabIndex].data.length > MAX_CACHE_DATA) {
                let isExist = this.cacheTab.indexOf(this.tabIndex);
                if (isExist < 0) {
                    this.cacheTab.push(this.tabIndex);
                }
            }

            this.tabIndex = index;
            this.scrollInto = this.tabBars[index].id;

            // 释放 tabId
            if (this.cacheTab.length > MAX_CACHE_PAGE) {
                let cacheIndex = this.cacheTab[0];
                this.clearTabData(cacheIndex);
                this.cacheTab.splice(0, 1);
            }
        },
        clearTabData(e) {
            this.newsList[e].data.length = 0;
            this.newsList[e].loadingText = '加载更多...';
        },
        refreshData() {
            var tab = this.newsList[this.tabIndex];
            if (tab.refreshing) {
                return;
            }
            tab.refreshing = true;
            tab.refreshText = '正在刷新...';
            this.getList(this.tabIndex, 1);
        },
        onrefresh(e) {
            var tab = this.newsList[this.tabIndex];
            this.refreshData();
            tab.pulling = true;
        },
        onpullingdown(e) {
            var tab = this.newsList[this.tabIndex];
            if (tab.refreshing) {
                return;
            }

            // var angle = (e.pullingDistance) / e.viewHeight * 180;
            // if (angle > 180) {
            // 	angle = 180;
            // }
            // tab.angle = angle;

            this.pulling = false;
            if (Math.abs(e.pullingDistance) > Math.abs(e.viewHeight)) {
                tab.refreshFlag = true;
                tab.refreshText = '释放立即刷新';
            } else {
                tab.refreshFlag = false;
                tab.refreshText = '下拉可以刷新';
            }
        },
        newGuid() {
            let s4 = function() {
                return ((65536 * (1 + Math.random())) | 0).toString(16).substring(1);
            };
            return (
                s4() +
                s4() +
                '-' +
                s4() +
                '-4' +
                s4().substr(0, 3) +
                '-' +
                s4() +
                '-' +
                s4() +
                s4() +
                s4()
            ).toUpperCase();
        },
    },
};
</script>

<style>
/* #ifndef APP-PLUS */
page {
    width: 100%;
    min-height: 100%;
    display: flex;
}

/* #endif */

.tabs {
    flex: 1;
    flex-direction: column;
    overflow: hidden;
    background-color: #ffffff;
    /* #ifdef MP-ALIPAY || MP-BAIDU */
    height: 100vh;
    /* #endif */
}

.scroll-h {
    width: 750upx;
    height: 80upx;
    flex-direction: row;
    /* #ifndef APP-PLUS */
    white-space: nowrap;
    /* #endif */
    /* flex-wrap: nowrap; */
    /* border-color: #cccccc;
		border-bottom-style: solid;
		border-bottom-width: 1px; */
}

.line-h {
    height: 1upx;
    background-color: #cccccc;
}

.no-data {
    flex: 1;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
}

.uni-tab-item {
    /* #ifndef APP-PLUS */
    display: inline-block;
    /* #endif */
    flex-wrap: nowrap;
    padding-left: 34upx;
    padding-right: 34upx;
}

.uni-tab-item-title {
    color: #555;
    font-size: 30upx;
    height: 80upx;
    line-height: 80upx;
    flex-wrap: nowrap;
    /* #ifndef APP-PLUS */
    white-space: nowrap;
    /* #endif */
}

.uni-tab-item-title-active {
    color: #e73626;
    font-weight: bold;
    font-size: 34upx;
}

.swiper-box {
    flex: 1;
}

.swiper-item {
    flex: 1;
    flex-direction: row;
}

.scroll-v {
    flex: 1;
    /* #ifndef MP-ALIPAY */
    flex-direction: column;
    /* #endif */
    width: 750upx;
    height: 100%;
}

.update-tips {
    position: absolute;
    left: 0;
    top: 41px;
    right: 0;
    padding-top: 5px;
    padding-bottom: 5px;
    background-color: #fddd9b;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.update-tips-text {
    font-size: 14px;
    color: #ffffff;
}

.refresh {
    width: 750upx;
    height: 64px;
    justify-content: center;
}

.refresh-view {
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
}

.refresh-icon {
    width: 30px;
    height: 30px;
    transition-duration: 0.5s;
    transition-property: transform;
    transform: rotate(0deg);
    transform-origin: 15px 15px;
}

.refresh-icon-active {
    transform: rotate(180deg);
}

.loading-icon {
    width: 20px;
    height: 20px;
    margin-right: 5px;
    color: gray;
}

.loading-text {
    margin-left: 2px;
    font-size: 16px;
    color: #999999;
}

.loading-more {
    align-items: center;
    justify-content: center;
    padding-top: 14px;
    padding-bottom: 14px;
    text-align: center;
}

.loading-more-text {
    font-size: 28upx;
    color: #999;
}
</style>
