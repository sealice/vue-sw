import { session } from '@/utils/storage';
import { ASIDE_COLLAPSE_TOGGLE, TABS_ADD, TABS_INIT, TABS_REMOVE } from '../types';
import { name } from '@/../package.json';

const tabsKey = (name + '_tabs').replace(/[^\w]+/g, '-');
let tabsRecord = session.get(tabsKey);
const setTabsRecord = tabs => {
    if (tabsRecord) {
        tabsRecord.tabs = tabs;
        session.set(tabsKey, tabsRecord);
    }
};

export default {
    state: {
        // 侧边栏
        aside: {
            minWidth: 64,
            maxWidth: 250,
            isCollapse: false,
            // textColor: '#fff',
            // activeTextColor: '#409eff',
            // backgroundColor: '#304156',
        },
        // 标签页
        tabs: [],
    },
    getters: {
        asideWidth({ aside }) {
            return aside.isCollapse ? aside.minWidth : aside.maxWidth;
        },
        cachePages({ tabs }) {
            const cachePages = ['keep-view'];

            tabs.forEach(({ name, keepAlive }) => {
                if (name && (keepAlive || keepAlive == null)) {
                    cachePages.push(name);
                }
            });

            return cachePages;
        },
    },
    mutations: {
        [ASIDE_COLLAPSE_TOGGLE]({ aside }) {
            aside.isCollapse = !aside.isCollapse;
        },
        [TABS_ADD]({ tabs }, { route, oldRoute }) {
            const {
                path,
                name,
                fullPath,
                meta: { title, keepAlive },
            } = route;
            const tab = tabs.find(item => item.path === path);

            if (tab) {
                tab.title = title;
                tab.fullPath = fullPath;
                tab.keepAlive = keepAlive;
            } else {
                const oldIndex = tabs.findIndex(item => item.path == oldRoute?.path);
                tabs.splice((oldIndex >>> 0) + 1, 0, {
                    title,
                    path,
                    name,
                    fullPath,
                    keepAlive,
                });
            }

            setTabsRecord(tabs);
        },
        [TABS_REMOVE]({ tabs }, { index, mode = 'cur' }) {
            switch (mode) {
                case 'cur':
                    tabs.splice(index, 1);
                    break;
                case 'left':
                    tabs.splice(1, index - 1);
                    break;
                case 'right':
                    tabs.splice(index + 1, tabs.length);
                    break;
                case 'all':
                    tabs.splice(1, tabs.length);
                    break;
                case 'other':
                    if (index) {
                        const tab = tabs[index];
                        tabs.splice(1, tabs.length, tab);
                    } else {
                        tabs.splice(1, tabs.length);
                    }
            }

            setTabsRecord(tabs);
        },
        [TABS_INIT](state, uid) {
            if (tabsRecord && tabsRecord.uid == uid) {
                state.tabs = tabsRecord.tabs;
            } else {
                tabsRecord = { uid, tabs: [] };
            }
        },
    },
};
