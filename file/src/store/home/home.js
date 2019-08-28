import { getHistory, getSaverTimeAsyn, getOrderPage, getGameRules, getCheckDetials, getPostionInfo, getTrentLst, getAccount, getPlayRule } from '@/api/home' // API
const homeData = {
    state: {
        serviceTime: null, // 服务器时间
        lotteryPoll: null, // 彩种定时器
        flag_alert: false, // 弹出蒙层组件
        alertTit: '', // 弹出组件标题
        alertCon: '', // 弹出组件内容
        alerClass: '', // 弹出框对齐方式
        alertUrl: '', // 弹出地址连接
        alertUrlyes: 'no', //  是否跳转商户连接
        alertIcon: '', // 弹出图标
        alertBut: '确定', // 弹出按扭名
        alertShowCancel: true, // 弹出取消按钮 是否显示 true: 显示， false: 不显示
        alertShowConfirm: true, // 弹出确认按钮 是否显示

        openLotteryCode: '', // openapi彩种
        openPlayRuleCode: '', // openapi二级玩法
        openAuthtoken: '', // openapitoken
        openChannel: '', // openapi进入端口
        tempMenu: true, // 显示菜单组件
        curGameList: [], // 当前游戏列表
        hotGameList: [], // 获取推荐游戏列表
        allGameList: [], // 获取所有分类游戏列表
        historyGameList: [], // 获取历史游戏列表
        parMenu: [], // 获取父级菜单
        parMenuCurId: '', // 获取初始父级菜单Id
        parMenuActiveId: 0, // 获取初始父级菜单选中INDEX 下标
        alertMenu: false, // 菜单是否获取完毕 true:已获取完, false:未获取完
        menuActive: 1, // 当前菜单选中样式
        menu: [ // 菜单
            {
                'id': '1',
                'name': '推荐',
                'tempName': 'hotGames'
            },
            {
                'id': '2',
                'name': '分类',
                'tempName': 'classGames'
            },
            {
                'id': '3',
                'name': '历史',
                'tempName': 'historyGames'
            },
            {
                'id': '4',
                'name': '我的',
                'tempName': 'memberCenter',
            }
        ],
        balance: '', // 获取余额
        winLose: '', // 获取当日输赢
        onlineService: '', // 在线客服连接
        depositUrl: '', // 充值连接
        userName: '', // 用户名
        customerUrl: '', // 商户连接地址

        curSubMenu: '', // 当前子级菜单
        curSubMenuId: '', // 当前子级菜单Id
        curSubMenuName: '', // 当前子菜单中文名
        curDisable: true, // 当前期开盘状态  true:关盘,  false 开盘
        flag_disable: true, // 当前期状态是否正常 treu：正常，false：不正常
        nextTime: '', // 当前投注结束时间
        curIssue: '', // 当前可下注期号
        oddsArr: [], // 赔率
        curOddsArr: [], // 当前赔率
        allOddsList: [], // 所有赔率
        parPlayCur: '', // 一级玩法选中Id
        subPlayCur: '', // 二级玩法选中code
        subPlayCurId: '', // 二级玩法选中id
        parPlayCurIndex: '', // 一级玩法选中Index下标
        subPlayCurIndex: '', // 二级玩法选中Index下标
        parCurMenuArr: '', // 当前一级玩法
        subCurMenuArr: '', // 当前二级玩法
        curParMenu: '', // 当前父菜单Code
        oddActive: [], // 当前批量下注值
        allMenuTree: [], // 彩种树
        subMenuTree: [], // 二级彩种集合
        curHistoryList: [], // 当前史历开奖
        curOrderList: [], // 当前投注记录
        curGameRules: [], // 当前游戏规则
        curPlayRule: '', // 当前玩法说明规则
        curSettleStatus: 0, // 当前投注状态传参 0:未结算 3:已结算
        curParSelectMenuId: '', // 当前选中信息一级彩种ID
        curSubSelectMenuId: '', // 当前选中信息二级彩种ID
        showAllMenu: false, // 是否显示彩种选择
        tableTotalpage: '', // 总页数
        showDataDialog: false, // 是否显示时间选择框  true:显示，false:不显示
        hkShowDataDialog: false, // 是否显示香港彩时间选择框  true:显示，false:不显示
        showBg: false, // 背景层是否显示 true:显示，false:不显示
        betShowBg: false, // 下注页背景层是否显示 true:显示，false:不显示
        dateArrStore: [], // 最近10天
        hkDateArrStore: {}, // 香港彩选中的时间范围
        activeDate: '', // 选中日期下标
        infoCurParMenu: '', // 信息类一级菜单code
        infoCurSubMenuName: '', // 当前信息类二级菜单中文名
        activeCheck: 7, // 选中结算详情 7:最近七天, 0:本周, 1:上周
        urlCname: '', // 当前路径中文模板
        setLeList: '', // 结算详情列表
        setTotal: '', // 结算详情总计
        postionInfo: [], // 盘口信息集合
        showQuick: false, // 投注快捷菜单是否显示 false:不显示， true:显示
        quickActiveCode: 'trend', // 选中菜单code
        currentPage: 0, // 分页当前页码
        theTrentList: [], // 路子列表数据
        inBottom: false, // 滚动条是否到底
        allOddActive: [], // 曾被选中所有赔率
        scrollValue: 0, // 滚动条滚动值
        initializeScroll: false, // 初始化滚动条
        totalBets: 0, // 总下注条数
        totalAmount: 0, // 总下注金额
        totalWin: 0, // 总返还
        betAmount: 0, // 单条下注金额
        readyBetList: [], // 准备投注列表
        showBetList: false, // 是否显示下注列表 false:不显示， true:显示
        showKeyboard: false, // 是否显示键盘 false:不显示， true:显示
        choiceBet: 0, // 是否选择来的下注 0:不是，1:是
        betDisabled: false, // 是否可选下注项false:  继续下注, true：超过不可下注
        isSucceed: false, // 是否投注成功
        betDisabled: false, // 是否可选下注项false:  继续下注, true：超过不可下注
        urlFrom: [], // 路径来自哪个 路由
        flag_back: false, // 是否点击返回键 false: 不是返回键， true:是返回键
        pitchOnTime: '', // 结算详情选中的日期
        newAmount: '', // 临时存单注金额
        isLoading: false, // 是否显示loading
        activeDetails: '', // 是否显示当前详情
        firstHistory: true, // 历史是否第一次请求 true:第一次请求不可轮询，false:请求已结束，可轮询
        noMore: false, // 是否已加载全部
        quitImgShow: false, // 退出图片显示
        flag_urlParameter:'',// 路由跳转url判断参数据 0为现金网提供的url，1为后台自定义提供的url
    },
    mutations: {
        SET_SAVERTIME: (state, data) => { // 服务器时间
            state.serviceTime = data
        },
        SET_LOTTERYPOLL: (state, data) => { // 彩种定时器
            state.lotteryPoll = data
        },
        SET_FLAGALERT: (state, data) => { // 弹出蒙层组件
            state.flag_alert = data
        },
        SET_ALERTTIT: (state, data) => { // 弹出组件标题
            state.alertTit = data
        },
        SET_ALERTCON: (state, data) => { // 弹出组件内容
            state.alertCon = data
        },
        SET_ALERTBUT: (state, data) => { // 弹出按扭名
            state.alertBut = data
        },
        SET_ALERTSHOWCONFIRM: (state, data) => { // 弹出是否显示确认按钮
            state.alertShowConfirm = data
        },
        SET_ALERTSHOWCANCEL: (state, data) => { // 弹出是否显示取消按钮
            state.alertShowCancel = data
        },
        SET_ALERTCLASS: (state, data) => { // 弹出框对齐方式
            state.alertClass = data
        },
        SET_ALERTURL: (state, data) => { // 弹出地址连接
            state.alertUrl = data
        },
        SET_ALERTURLYES: (state, data) => { //  是否跳转商户连接
            state.alertUrlyes = data
        },
        SET_OPENLOTTERYCODE: (state, data) => { // openapi彩种
            state.openLotteryCode = data
        },
        SET_OPENPLAYRULECODE: (state, data) => { // openapi二级玩法
            state.openPlayRuleCode = data
        },
        SET_OPENAUTHTOKEN: (state, data) => { // openapitoken
            state.openAuthtoken = data
        },
        SET_OPENCHANNEL: (state, data) => { // openapi进入端口
            state.openChannel = data
        },
        SET_TEMPMENU: (state, data) => { // 显示菜单组件
            state.tempMenu = data
        },
        SET_PARMENU: (state, data) => { // 获取父级菜单
            state.parMenu = data
        },
        SET_PARMENUCURID: (state, data) => { // 获取初始父级菜单Id
            state.parMenuCurId = data
        },
        SET_PARMENUACTIVEID: (state, data) => { // 获取初始父级菜单选中INDEX 下标
            state.parMenuActiveId = data
        },
        SET_ALERTMENU: (state, data) => { // 菜单是否获取完毕 true:已获取完, false:未获取完
            state.alertMenu = data
        },
        SET_ALERTICON: (state, data) => { // 弹出图标
            state.alertIcon = data
        },
        SET_CURGAMELIST: (state, data) => { // 获取当前游戏列表
            state.curGameList = data
        },
        SET_HOTGAMELIST: (state, data) => { // 获取推荐游戏列表
            state.hotGameList = data
        },
        SET_ALLGAMELIST: (state, data) => { // 获取所有分类游戏列表
            state.allGameList = data
        },
        SET_HISTORYGAMELIST: (state, data) => { // 获取历史记录游戏列表
            state.historyGameList = data
        },
        SET_MENUACTIVE: (state, data) => { // 当前菜单选中样式
            state.menuActive = data
        },
        SET_BALANCE: (state, data) => { // 获取余额
            state.balance = data
        },
        SET_WINLOSE: (state, data) => { // 获取当日输赢
            state.winLose = data
        },
        SET_ONLINESERVICE: (state, data) => { // 在线客服连接
            state.onlineService = data
        },
        SET_DEPOSITURL: (state, data) => { // 充值连接
            state.depositUrl = data
        },
        SET_USERNAME: (state, data) => { // 用户名
            state.userName = data
        },
        SET_CUSTOMERURL: (state, data) => { // 商户连接地址
            state.customerUrl = data
        },

        SET_CURSUBMENU: (state, data) => { // 当前子菜单
            state.curSubMenu = data
        },
        SET_CURSUBMENUID: (state, data) => { // 当前子菜单Id
            state.curSubMenuId = data
        },
        SET_CURSUBMENUNAME: (state, data) => { // 当前子菜单中文名
            state.curSubMenuName = data
        },
        SET_CURDISABLE: (state, data) => { // 当前期开盘状态
            state.curDisable = data
        },
        SET_FLAGDISABLE: (state, data) => { // 当前期状态是否正常 treu：正常，false：不正常
            state.flag_disable = data
        },
        SET_NEXTTIME: (state, data) => { // 当前投注结束时间
            state.nextTime = data
        },
        SET_CURISSUE: (state, data) => { // 当前可下注期号
            state.curIssue = data
        },
        SET_ODDSARR: (state, data) => { // 赔率列表
            state.oddsArr = data
        },
        SET_CURODDSARR: (state, data) => { // 当前赔率列表
            state.curOddsArr = data
        },
        SET_ALLODDSLIST: (state, data) => { // 所有赔率
            state.allOddsList = data
        },
        SET_PARPLAYCUR: (state, data) => { // 一级玩法选中id
            state.parPlayCur = data
        },
        SET_SUBPLAYCUR: (state, data) => { // 二级玩法选中code
            state.subPlayCur = data
        },
        SET_SUBPLAYCURID: (state, data) => { // 二级玩法选中ID
            state.subPlayCurId = data
        },
        SET_PARPLAYCURINDEX: (state, data) => { // 一级玩法选中index下标
            state.parPlayCurIndex = data
        },
        SET_SUBPLAYCURINDEX: (state, data) => { // 二级玩法选中index下标
            state.subPlayCurIndex = data
        },
        SET_PARCURMENUARR: (state, data) => { // 当前一级玩法
            state.parCurMenuArr = data
        },
        SET_SUBCURMENUARR: (state, data) => { // 当前二级玩法
            state.subCurMenuArr = data
        },
        SET_CURPARMENU: (state, data) => { // 当前父菜单Code
            state.curParMenu = data
        },
        SET_ODDACTIVE: (state, data) => { // 当前批量下注值
            state.oddActive = data
        },
        SET_ALLMENUTREE: (state, data) => { // 彩种树
            state.allMenuTree = data
        },
        SET_SUBMENUTREE: (state, data) => { // 二级彩种集合
            state.subMenuTree = data
        },
        SET_CURHISTORYLIST: (state, data) => { // 当前史历开奖
            state.curHistoryList = data
        },
        SET_CURORDERLIST: (state, data) => { // 当前投注记录
            state.curOrderList = data
        },
        SET_CURGAMERULES: (state, data) => { // 当前游戏规则
            state.curGameRules = data
        },
        SET_CURPLAYRULE: (state, data) => { // 当前玩法说明
            state.curPlayRule = data
        },
        SET_CURSETTLESTATUS: (state, data) => { // 当前投注状态传参 0:未结算 3:已结算
            state.curSettleStatus = data
        },
        SET_CURPARSELECTMENUID: (state, data) => { // 当前选中信息一级彩种ID
            state.curParSelectMenuId = data
        },
        SET_CURSUBSELECTMENUID: (state, data) => { // 当前选中信息二级彩种ID
            state.curSubSelectMenuId = data
        },
        SET_SHOWALLMENU: (state, data) => { // 是否显示彩种选择
            state.showAllMenu = data
        },
        SET_TABLETOTALPAGE: (state, data) => { // 总页数
            state.tableTotalpage = data
        },
        SET_CURRENTPAGE: (state, data) => { // 分页当前页码
            state.currentPage = data
        },
        SET_SHOWDATADIALOG: (state, data) => { // 是否显示时间选择框  true:显示，false:不显示
            state.showDataDialog = data
        },
        SET_HKSHOWDATADIALOG: (state, data) => { // 是否显示香港彩时间选择框  true:显示，false:不显示
            state.hkShowDataDialog = data
        },
        SET_SHOWBG: (state, data) => { // 背景层是否显示 true:显示，false:不显示
            state.showBg = data
        },
        SET_BETSHOWBG: (state, data) => { // 下注页背景层是否显示 true:显示，false:不显示
            state.betShowBg = data
        },
        SET_DATEARRSTORE: (state, data) => { // 最近10天集合
            state.dateArrStore = data
        },
        SET_HKDATEARRSTORE: (state, data) => { // 香港彩选中的时间范围
            state.hkDateArrStore = data
        },
        SET_ACTIVEDATE: (state, data) => { // 选中日期下标
            state.activeDate = data
        },
        SET_INFOCURPARMENU: (state, data) => { // 信息类一级菜单code
            state.infoCurParMenu = data
        },
        SET_INFOCURSUBMENUNAME: (state, data) => { // 当前信息类二级菜单中文名
            state.infoCurSubMenuName = data
        },
        SET_ACTIVECHECK: (state, data) => { // 选中结算详情 7:最近七天, 0:本周, 1:上周
            state.activeCheck = data
        },
        SET_URLCNAME: (state, data) => { // 当前路径中文模板
            state.urlCname = data
        },
        SET_SETLELIST: (state, data) => { // 结算详情列表
            state.setLeList = data
        },
        SET_SETTOTAL: (state, data) => { // 结算详情总计
            state.setTotal = data
        },
        SET_POSTIONINFO: (state, data) => { // 盘口信息集合
            state.postionInfo = data
        },
        SET_SHOWQUICK: (state, data) => { // 投注快捷菜单是否显示 false:不显示， true:显示
            state.showQuick = data
        },
        SET_GETQUICKACTIVECODE: (state, data) => { // 选中菜单code
            state.quickActiveCode = data
        },
        SET_TRENTDATA: (state, data) => { // 路子列表数据
            state.theTrentList = data;
        },
        SET_INBOTTOM: (state, data) => { // 滚动条是否到底
            state.inBottom = data;
        },
        SET_ALLODDACTIVE: (state, data) => { // 曾被选中所有赔率
            state.allOddActive = data;
        },
        SET_SCROLLVALUE: (state, data) => { // 滚动条滚动值
            state.scrollValue = data;
        },
        SET_INITIALIZESCROLL: (state, data) => { // 初始化滚动条
            state.initializeScroll = data;
        },
        SET_TOTALBETS: (state, data) => { // 总下注条数
            state.totalBets = data;
        },
        SET_TOTALAMOUNT: (state, data) => { // 总下注金额
            state.totalAmount = data;
        },
        SET_TOTALWIN: (state, data) => { // 总返还
            state.totalWin = data;
        },
        SET_BETAMOUNT: (state, data) => { // 单条下注金额
            state.betAmount = data;
        },
        SET_READYBETLIST: (state, data) => { // 准备投注列表
            state.readyBetList = data;
        },
        SET_SHOWBETLIST: (state, data) => { // 是否显示下注列表 false:不显示， true:显示
            state.showBetList = data;
        },
        SET_SHOWKEYBOARD: (state, data) => { // 是否显示键盘 false:不显示， true:显示
            state.showKeyboard = data;
        },
        SET_CHOICEBET: (state, data) => { // 是否选择来的下注 0:不是，1:是
            state.choiceBet = data;
        },
        SET_BETDISABLED: (state, data) => { // 是否可选下注项false:  继续下注, true：超过不可下注
            state.betDisabled = data;
        },
        SET_ISSUCCEED: (state, data) => { // 是否投注成功
            state.isSucceed = data;
        },
        SET_URLFROM: (state, data) => { // 路径来自哪个 路由
            state.urlFrom = data;
        },
        SET_FLAGBACK: (state, data) => { // 是否点击返回键 false: 不是返回键， true:是返回键
            state.flag_back = data;
        },
        SET_PITCHONTIME: (state, data) => { // 结算详情选中的日期
            state.pitchOnTime = data;
        },
        SET_NEWAMOUNT: (state, data) => { // 临时存单注金额
            state.newAmount = data;
        },
        SET_ISLOADING: (state, data) => { // 是否显示loading
            state.isLoading = data;
        },
        SET_ACTIVEDETAILS: (state, data) => { // 是否显示当前详情
            state.activeDetails = data;
        },
        SET_FIRSTHISTORY: (state, data) => { // 历史是否第一次请求 true:第一次请求不可轮询，false:请求已结束，可轮询
            state.firstHistory = data;
        },
        SET_NOMORE: (state, data) => { // 是否已加载全部
            state.noMore = data;
        },
        SET_QUITIMGSHOW: (state, data) => { // 退出图片显示
            state.quitImgShow = data;
        },
        SET_OPENFLAG: (state, data) => { // 路由跳转url判断参数据 0为现金网提供的url，1为后台自定义提供的url
            state.flag_urlParameter = data;
        },
    },
    actions: {
        getSaverTime({ commit }, data) { // 获取服务器时间
            commit('SET_SAVERTIME', data) // 设置服务器时间
        },
        getLotteryPoll({ commit }, data) { // 彩种定时器
            commit('SET_LOTTERYPOLL', data)
        },
        getFlagalert({ commit }, data) { // 弹出组件
            // 每次弹层时，都将确认与取消按钮【重置】为“true”,
            // 注意点： store.dispatch('getFlagalert', true) 要写在这两者的前面 store.dispatch('getAlertShowCancel', )和  store.dispatch('getAlertShowConfirm',
            commit('SET_ALERTSHOWCONFIRM', true);
            commit('SET_ALERTSHOWCANCEL', true);
            commit('SET_FLAGALERT', data);
        },
        getAlertTit({ commit }, data) { // 弹出组件标题
            commit('SET_ALERTTIT', data)
        },
        getAlertCon({ commit }, data) { // 弹出组件内容
            commit('SET_ALERTCON', data)
        },
        getAlertBut({ commit }, data) { // 弹出按扭名
            commit('SET_ALERTBUT', data)
        },
        getAlertShowConfirm({ commit }, data) { // 弹出按扭名
            commit('SET_ALERTSHOWCONFIRM', data)
        },
        getAlertShowCancel({ commit }, data) { // 弹出按扭名
            commit('SET_ALERTSHOWCANCEL', data)
        },
        getAlertClass({ commit }, data) { // 弹出框对齐方式
            commit('SET_ALERTCLASS', data)
        },
        getAlertUrl({ commit }, data) { // 弹出地址连接
            commit('SET_ALERTURL', data)
        },
        getAlertUrlyes({ commit }, data) { //  是否跳转商户连接
            commit('SET_ALERTURLYES', data)
        },
        getAlertIcon({ commit }, data) { // 弹出图标
            commit('SET_ALERTICON', data)
        },
        getOpenLotteryCode({ commit }, data) { // openapi彩种
            commit('SET_OPENLOTTERYCODE', data)
        },
        getOpenPlayRuleCode({ commit }, data) { // openapi二级玩法
            commit('SET_OPENPLAYRULECODE', data)
        },
        getOpenAuthtoken({ commit }, data) { // openapitoken
            commit('SET_OPENAUTHTOKEN', data)
        },
        getOpenChannel({ commit }, data) { // openapi进入端口
            commit('SET_OPENCHANNEL', data)
        },
        getTempMenu({ commit }, data) { // 显示菜单组件
            commit('SET_TEMPMENU', data)
        },
        getParMenu({ commit }, data) { // 获取父级菜单
            commit('SET_PARMENU', data)
        },
        getParMenuCurId({ commit }, data) { // 获取初始父级菜单Id
            commit('SET_PARMENUCURID', data)
        },
        getParMenuActiveId({ commit }, data) { // 获取初始父级菜单选中INDEX 下标
            commit('SET_PARMENUACTIVEID', data)
        },
        getAlertMenu({ commit }, data) { // 菜单是否获取完毕 true:已获取完, false:未获取完
            commit('SET_ALERTMENU', data)
        },
        getCurGameList({ commit }, data) { // 获取当前游戏列表
            commit('SET_CURGAMELIST', data)
        },
        getHotGameList({ commit }, data) { // 获取历史游戏列表
            commit('SET_HOTGAMELIST', data)
        },
        getAllGameList({ commit }, data) { // 获取所有游戏
            commit('SET_ALLGAMELIST', data)
        },
        getHistoryGameList({ commit }, data) { // 获取所有游戏
            commit('SET_HISTORYGAMELIST', data)
        },
        getMenuActive({ commit }, data) { // 当前菜单选中样式
            commit('SET_MENUACTIVE', data)
        },
        getBalance: ({ commit }, data) => { // 获取余额
            commit('SET_BALANCE', data)
        },
        getWinLose: ({ commit }, data) => { // 获取当日输赢
            commit('SET_WINLOSE', data)
        },
        getOnlinService: ({ commit }, data) => { // 在线客服连接
            commit('SET_ONLINESERVICE', data)
        },
        getDepositUrl: ({ commit }, data) => { // 充值连接
            commit('SET_DEPOSITURL', data)
        },
        getUserName: ({ commit }, data) => { // 用户名
            commit('SET_USERNAME', data)
        },
        getCustomerUrl: ({ commit }, data) => { // 商户连接地址
            commit('SET_CUSTOMERURL', data)
        },
        getCurSubMenu({ commit }, data) { // 当前子级菜单
            commit('SET_CURSUBMENU', data)
        },
        getCurSubMenuId({ commit }, data) { // 当前子级菜单Id
            commit('SET_CURSUBMENUID', data)
        },
        getCurSubMenuName({ commit }, data) { // 当前子级菜单中文名
            commit('SET_CURSUBMENUNAME', data)
        },
        getCurDisable: ({ commit }, data) => { // 当前期开盘状态
            commit('SET_CURDISABLE', data)
        },
        getFlagDisable: ({ commit }, data) => { // 当前期状态是否正常 treu：正常，false：不正常
            commit('SET_FLAGDISABLE', data)
        },
        getNextTime({ commit }, data) { // 当前投注结束时间
            commit('SET_NEXTTIME', data)
        },
        getCurIssue({ commit }, data) { // 当前可下注期号
            commit('SET_CURISSUE', data)
        },
        getOdds({ commit }, data) { // 赔率列表
            commit('SET_ODDSARR', data)
        },
        getCurOdds({ commit }, data) { // 当前赔率列表
            commit('SET_CURODDSARR', data)
        },
        getAllOddsList({ commit }, data) { // 所有赔率
            commit('SET_ALLODDSLIST', data)
        },
        getParPlayCur({ commit }, data) { // 一级菜单选中id
            commit('SET_PARPLAYCUR', data)
        },
        getSubPlayCur({ commit }, data) { // 二级菜单选中code
            commit('SET_SUBPLAYCUR', data)
        },
        getSubPlayCurId({ commit }, data) { // 二级菜单选中ID
            commit('SET_SUBPLAYCURID', data)
        },
        getParPlayCurIndex({ commit }, data) { // 一级菜单选中INDEX
            commit('SET_PARPLAYCURINDEX', data)
        },
        getSubPlayCurIndex({ commit }, data) { // 二级菜单选中INDEX
            commit('SET_SUBPLAYCURINDEX', data)
        },
        getParCurMenuArr({ commit }, data) { // 当前一级玩法
            commit('SET_PARCURMENUARR', data)
        },
        getSubCurMenuArr({ commit }, data) { // 当前二级玩法
            commit('SET_SUBCURMENUARR', data)
        },
        getCurParMenu({ commit }, data) { // 获取当前一级菜单Code
            commit('SET_CURPARMENU', data)
        },
        getOddActive({ commit }, data) { // 当前批量下注值
            commit('SET_ODDACTIVE', data)
        },
        getAllMenuTree({ commit }, data) { // 彩种树
            commit('SET_ALLMENUTREE', data)
        },
        getSubMenuTree({ commit }, data) { // 二级彩种集合
            commit('SET_SUBMENUTREE', data)
        },
        getCurHistoryList({ commit }, data) { // 当前史历开奖
            commit('SET_CURHISTORYLIST', data)
        },
        getCurOrderList({ commit }, data) { // 当前投注记录 0:未结算 3:已结算
            commit('SET_CURORDERLIST', data)
        },
        getCurGameRules({ commit }, data) { // 当前游戏规则
            commit('SET_CURGAMERULES', data)
        },
        getCurPlayRule({ commit }, data) { // 当前玩法说明
            commit('SET_CURPLAYRULE', data)
        },
        getCurSettleStatus({ commit }, data) { // 当前投注状态传参  0:未结算 3:已结算
            commit('SET_CURSETTLESTATUS', data) //
        },
        getCurParSelectMenuId({ commit }, data) { // 当前选中信息一级彩种ID
            commit('SET_CURPARSELECTMENUID', data)
        },
        getCurSubSelectMenuId({ commit }, data) { // 当前选中信息二级彩种ID
            commit('SET_CURSUBSELECTMENUID', data)
        },
        getShowAllMenu({ commit }, data) { // 是否显示彩种选择  true:显示，false:不显示
            commit('SET_SHOWALLMENU', data)
        },
        getTableTotalPage({ commit }, data) { // 总页数
            commit('SET_TABLETOTALPAGE', data)
        },
        getCurrentPage({ commit }, data) { // 分页当前页码
            commit('SET_CURRENTPAGE', data)
        },
        getShowDataDialog({ commit }, data) { // 是否显示时间选择框  true:显示，false:不显示
            commit('SET_SHOWDATADIALOG', data)
        },
        getHkShowDataDialog({ commit }, data) { // 是否显示香港彩时间选择框  true:显示，false:不显示
            commit('SET_HKSHOWDATADIALOG', data)
        },
        getShowBg({ commit }, data) { // 背景层是否显示 true:显示，false:不显示
            commit('SET_SHOWBG', data)
        },
        getBetShowBg({ commit }, data) { // 下注页背景层是否显示 true:显示，false:不显示
            commit('SET_BETSHOWBG', data)
        },
        getDateArrStore({ commit }, data) { // 最近10天集合
            commit('SET_DATEARRSTORE', data)
        },
        getHkDateArrStore({ commit }, data) { // 香港彩选中的时间范围
            commit('SET_HKDATEARRSTORE', data)
        },
        getActiveDate({ commit }, data) { // 选中日期下标
            commit('SET_ACTIVEDATE', data)
        },
        getInfoCurParMenu({ commit }, data) { // 信息类一级菜单code
            commit('SET_INFOCURPARMENU', data)
        },
        getInfoCurSubMenuName({ commit }, data) { // 当前信息类二级菜单中文名
            commit('SET_INFOCURSUBMENUNAME', data)
        },
        getActiveCheck({ commit }, data) { // 选中结算详情 7:最近七天, 0:本周, 1:上周
            commit('SET_ACTIVECHECK', data)
        },
        getUrlCname({ commit }, data) { // 当前路径中文模板
            commit('SET_URLCNAME', data)
        },
        getSetLeList({ commit }, data) { // 结算详情列表
            commit('SET_SETLELIST', data)
        },
        getSetTotal({ commit }, data) { // 结算详情总计
            commit('SET_SETTOTAL', data)
        },
        getPostionInfoList({ commit }, data) { // 盘口信息集合
            commit('SET_POSTIONINFO', data)
        },
        getShowQuick({ commit }, data) { // 投注快捷菜单是否显示 false:不显示， true:显示
            commit('SET_SHOWQUICK', data)
        },
        getQuickActiveCode({ commit }, data) { // 选中菜单code
            commit('SET_GETQUICKACTIVECODE', data)
        },
        getTrentDataList({ commit }, data) { // 路子列表数据
            commit('SET_TRENTDATA', data)
        },
        getInBottom({ commit }, data) { // 获取滚动条状态
            commit('SET_INBOTTOM', data)
        },
        getAllOddActive({ commit }, data) { // 曾被选中所有赔率
            commit('SET_ALLODDACTIVE', data)
        },
        getScrollValue({ commit }, data) { // 滚动条滚动值
            commit('SET_SCROLLVALUE', data)
        },
        getInitializeScroll({ commit }, data) { // 初始化滚动条
            commit('SET_INITIALIZESCROLL', data)
        },
        getTotalBets({ commit }, data) { // 总下注条数
            commit('SET_TOTALBETS', data)
        },
        getTotalAmount({ commit }, data) { // 总下注金额
            commit('SET_TOTALAMOUNT', data)
        },
        getTotalWin({ commit }, data) { // 总返还
            commit('SET_TOTALWIN', data)
        },
        getBetAmount({ commit }, data) { // 单条下注金额
            commit('SET_BETAMOUNT', data)
        },
        getReadyBetList({ commit }, data) { // 准备投注列表
            commit('SET_READYBETLIST', data)
        },
        getShowBetList({ commit }, data) { // 是否显示下注列表 false:不显示， true:显示
            commit('SET_SHOWBETLIST', data)
        },
        getShowKeyboard({ commit }, data) { // 是否显示键盘 false:不显示， true:显示
            commit('SET_SHOWKEYBOARD', data)
        },
        getChoiceBet({ commit }, data) { // 是否选择来的下注 0:不是，1:是
            commit('SET_CHOICEBET', data)
        },
        getBetDisabled({ commit }, data) { // 是否可选下注项false:  继续下注, true：超过不可下注
            commit('SET_BETDISABLED', data)
        },
        getisSucceed({ commit }, data) { // 是否投注成功
            commit('SET_ISSUCCEED', data)
        },
        getUrlFrom({ commit }, data) { // 路径来自哪个 路由
            commit('SET_URLFROM', data)
        },
        getFlagBack({ commit }, data) { // 是否点击返回键 false: 不是返回键， true:是返回键
            commit('SET_FLAGBACK', data)
        },
        getPitchOnTime({ commit }, data) { // 结算详情选中的日期
            commit('SET_PITCHONTIME', data)
        },
        getNewAmount({ commit }, data) { // 临时存单注金额
            commit('SET_NEWAMOUNT', data)
        },
        getIsLoading({ commit }, data) { // 是否显示loading
            commit('SET_ISLOADING', data)
        },
        getActiveDetails({ commit }, data) { // 是否显示当前详情
            commit('SET_ACTIVEDETAILS', data)
        },
        getFirstHistory({ commit }, data) { // 历史是否第一次请求 true:第一次请求不可轮询，false:请求已结束，可轮询
            commit('SET_FIRSTHISTORY', data)
        },
        // SET_FIRSTHISTORY: (state, data) => { // 历史是否第一次请求 true:第一次请求不可轮询，false:请求已结束，可轮询
        //     state.firstHistory = data;
        // },
        getNoMore({ commit }, data) { // 是否已加载全部
            commit('SET_NOMORE', data)
        },
        getQuitImgShow({ commit }, data) { // 退出图片显示
            commit('SET_QUITIMGSHOW', data)
        },
        getOpenflag({ commit }, data) { // 路由跳转url判断参数据 0为现金网提供的url，1为后台自定义提供的url
            commit('SET_OPENFLAG', data)
        },
        getSaverTimeAsyn({ commit }) { // 获取服务器时间
            return new Promise((resolve, reject) => {
                getSaverTimeAsyn().then(response => {
                    let res = response
                    if (res && res.success == 1) {
                        let time = res.content.serverTime // 服务器时间
                        commit('SET_SAVERTIME', time) // 设置服务器时间
                    } else {
                        // console.log('获取服务器时间失败', res)
                    }
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },



        getTrentLst({ commit }, data) { // 路子 data:当前子菜单ID
            return new Promise((resolve, reject) => {
                getTrentLst(data).then((response) => { // 请求api
                    commit('SET_ISLOADING', false) // 隐藏loading
                    let res = response // 请求成功获取数据用变量接收
                    if (res && res.success == 1) { // 判断数据不为空并且状态为1成功
                        let s = res.content // 路子列表数据
                        commit('SET_TRENTDATA', s) // 路子列表数据
                    }
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        getHistory({ commit }, data) { // 获取历史记录
            return new Promise((resolve, reject) => {
                getHistory(data).then((response) => { // 请求api
                    let res = response // 请求成功获取数据用变量接收
                    commit("SET_ISLOADING", false) // 隐藏loading
                    if (res && res.success == 1) { // 判断状态
                        let c = res.content.content, // 当前历史列表
                            tp = res.content.totalElements // 总页数
                        commit('SET_CURHISTORYLIST', c) // 将数据存入状态库
                        commit('SET_TABLETOTALPAGE', tp) // 总页数存入状态库
                    }
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        getOrderPage({ commit }, data) { // 获取投注记录 id:当前子菜单ID
            return new Promise((resolve, reject) => {
                getOrderPage(data).then((response) => { // 请求api
                    commit("SET_ISLOADING", false) // 隐藏loading
                    let res = response // 请求成功获取数据用变量接收
                    if (res && res.success == 1) { // 判断状态
                        let c = res.content.content, // 当前历史列表
                            tp = res.content.totalElements // 总页数
                        commit('SET_CURORDERLIST', c) // 将数据存入状态库
                        commit('SET_TABLETOTALPAGE', tp) // 总页数存入状态库
                    }
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        getGameRules({ commit }, data) { // 游戏规则 data:当前子菜单ID
            return new Promise((resolve, reject) => {
                getGameRules(data).then((response) => { // 请求api
                    commit("SET_ISLOADING", false) // 隐藏loading
                    let res = response // 请求成功获取数据用变量接收
                    if (res && res.success == 1) { // 判断数据不为空并且状态为1成功
                        let c = res.content // 当前游戏规则
                        commit('SET_CURGAMERULES', c) // 将数据存入状态库
                    }
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        getPlayRule({ commit }, data) { // 游戏规则 data:当前子玩法ID
            return new Promise((resolve, reject) => {
                getPlayRule(data).then((response) => { // 请求api
                    commit("SET_ISLOADING", false) // 隐藏loading
                    let res = response // 请求成功获取数据用变量接收
                    if (res && res.success == 1) { // 判断数据不为空并且状态为1成功
                        let c = res.content.description // 当前玩法说明 curPlayRule
                        commit('SET_CURPLAYRULE', c) // 将数据存入状态库
                    }
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        getCheckDetials({ commit }, data) { // 结算详情 data:时间区间
            return new Promise((resolve, reject) => {
                getCheckDetials(data).then((response) => { // 请求api
                    commit("SET_ISLOADING", false) // 隐藏loading
                    let res = response // 请求成功获取数据用变量接收
                    if (res && res.success == 1) { // 判断数据不为空并且状态为1成功
                        let s = res.content.settleList, // 结算详情列表
                            t = res.content.total // 结算详情总计
                        commit('SET_SETLELIST', s) // 结算详情列表
                        commit('SET_SETTOTAL', t) // 结算详情总计
                    }
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },


        getPostionInfo({ commit }, data) { // 盘口信息 data:当前子菜单ID
            return new Promise((resolve, reject) => {
                getPostionInfo(data).then((response) => { // 请求api
                    commit("SET_ISLOADING", false) // 隐藏loading
                    let res = response // 请求成功获取数据用变量接收
                    if (res && res.success == 1) { // 判断数据不为空并且状态为1成功
                        let s = res.content // 盘口信息数据
                        commit('SET_POSTIONINFO', s) // 将数据存入状态库
                    }
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        getAccount({ commit }, data) { // 盘口信息 data:当前子菜单ID
            return new Promise((resolve, reject) => {
                getAccount(data).then((response) => { // 请求api
                    commit("SET_ISLOADING", false) // 隐藏loading
                    let res = response // 请求成功获取数据用变量接收
                    if (res && res.success == 1) { // 判断数据不为空并且状态为1成功
                        let s = res.content // 获取用户信息
                        commit('SET_BALANCE', s.balance) // 余额
                        commit('SET_WINLOSE', s.dayWinLoss) // 当日输赢
                        commit('SET_ONLINESERVICE', s.customerServiceUrl) // 在线客服连接
                        commit('SET_DEPOSITURL', s.depositUrl) // 充值连接
                        commit('SET_USERNAME', s.username) // 用户名
                        commit('SET_CUSTOMERURL', s.homeUrl) //  商户连接地址
                    }
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // account() { // 获取用户信息
        //     account().then((response) => {
        //         let res = response
        //         if(res && res.success == 1){
        //             let l =  res.content // 获取用户信息
        //             commit('SET_BALANCE', l.balance) // 余额
        //             commit('SET_WINLOSE', l.dayWinLoss) // 当日输赢
        //             commit('SET_ONLINESERVICE', l.customerServiceUrl) // 在线客服连接
        //             commit('SET_DEPOSITURL', l.depositUrl) // 充值连接
        //             commit('SET_USERNAME', l.username) // 用户名
        //             commit('SET_CUSTOMERURL', l.homeUrl) //  商户连接地址
        //             return res

        //             // this.$store.dispatch('getBalance', l.balance) // 余额
        //             // this.$store.dispatch('getWinLose', l.dayWinLoss) // 当日输赢
        //             // this.$store.dispatch('getOnlinService', l.customerServiceUrl) // 在线客服连接
        //             // this.$store.dispatch('getDepositUrl', l.depositUrl) // 充值连接
        //             // this.$store.dispatch('getUserName', l.username) // 用户名
        //             // this.$store.dispatch('getCustomerUrl', l.homeUrl) // 商户连接地址
        //             // this.$store.dispatch('getCustomerUrl', 'www.sina.com') // 商户连接地址

        //             this.service[0].url = l.depositUrl;
        //             this.service[1].url = l.customerServiceUrl;
        //             this.service[2].url = l.homeUrl;
        //         }
        //     })
        // }

    }
}
export default homeData