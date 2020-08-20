<template>
  <page-header-wrapper>
    <template v-slot:content>
      <div class="page-header-content">
        <div class="avatar">
          <a-avatar size="large" :src="currentUser.avatar"/>
        </div>
        <div class="content">
          <div class="content-title">
            {{ timeFix }}，{{ user.userName }}<span class="welcome-text">，{{ welcome }}</span>
          </div>
          <div>前端工程师 | 蚂蚁金服 - 某某某事业群 - VUE平台</div>
        </div>
      </div>
    </template>
    <template v-slot:extraContent>
      <div class="extra-content">
        <div class="stat-item">
          <a-statistic title="项目数" :value="56" />
        </div>
        <div class="stat-item">
          <a-statistic title="团队内排名" :value="8" suffix="/ 24" />
        </div>
        <div class="stat-item">
          <a-statistic title="项目访问" :value="2223" />
        </div>
      </div>
    </template>

    <div>
    </div>
    <a-card :bordered="false">
      <s-table
        ref="table"
        size="default"
        rowKey="scheduleId"
        :columns="columns"
        :data="loadData"
        showPagination="auto"
      >
        <span slot="scheduleName" slot-scope="text">
          <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
        </span>
        <span slot="beforeTime" slot-scope="text">
          {{ dateTimeFormatHelper(text) }}
        </span>
        <span slot="nextTime" slot-scope="text">
          {{ dateTimeFormatHelper(text) }}
        </span>
        <span slot="lastExecState" slot-scope="text,record">
          <a-badge :color="text | statusTypeFilter" :text="record.lastExecStateName"/>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { timeFix, dateTimeFormatHelper } from '@/utils/util'
import { mapState } from 'vuex'
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import { Radar, STable, Ellipsis } from '@/components'

// eslint-disable-next-line no-unused-vars
import { getList } from '@/api/manage'
const statusMap = {
    B: {
      color: '#ed6b75'
    },
    R: {
      color: '#659be0'
    },
    S: {
        color: '#3fc9d5'
    },
    F: {
     color: '#F1C40F'
    },
    N: {
     color: '##bac3d0'
    },
    W: {
     color: '#bac3d0'
    },
    D: {
     color: '#bac3d0'
    }
}
const columns = [

  {
    title: '编号',
    dataIndex: 'ROWNUM_'
  },
  {
    title: '计划名称',
    dataIndex: 'scheduleName',
    scopedSlots: { customRender: 'scheduleName' }
  },
  {
    title: '作业编号',
    dataIndex: 'jobNo',
    scopedSlots: { customRender: 'jobNo' }
  },
  {
    title: '作业名称',
    dataIndex: 'jobName',
    scopedSlots: { customRender: 'jobName' }
  },
  {
    title: '上次执行时间',
    dataIndex: 'beforeTime',
    scopedSlots: { customRender: 'beforeTime' }
  },
  {
    title: '最后一次执行状态',
    dataIndex: 'lastExecState',
    scopedSlots: { customRender: 'lastExecState' }
  },
  {
    title: '下次执行时间',
    dataIndex: 'nextTime',
    scopedSlots: { customRender: 'nextTime' }

  },
   {
    title: '开启状态',
    dataIndex: 'startFlagName',
    scopedSlots: { customRender: 'startFlagName' }

  }
]
export default {
  name: 'Workplace',
  components: {
    PageHeaderWrapper,
    Radar,
    STable,
    Ellipsis
  },
  data () {
    this.columns = columns
    this.dateTimeFormatHelper = dateTimeFormatHelper
    return {
      timeFix: timeFix(),
      avatar: '',
      user: {},
      loading: true,
      // 查询参数
      queryParam: {
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return getList(requestParameters)
          .then(res => {
            if (res.kdjson.flag === '1' && res.kdjson.items) {
             return res.kdjson
            } else {
                return []
            }
          })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
  statusTypeFilter (type) {
    return statusMap[type].color
  }
},
  computed: {
    ...mapState({
      nickname: (state) => state.user.nickname,
      welcome: (state) => state.user.welcome
    }),
    currentUser () {
      return {
        name: 'Serati Ma',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
      }
    },
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    this.user = this.userInfo
    this.avatar = this.userInfo.avatar
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
  @import "./Workplace.less";

  .project-list {

    .card-title {
      font-size: 0;

      a {
        color: rgba(0, 0, 0, 0.85);
        margin-left: 12px;
        line-height: 24px;
        height: 24px;
        display: inline-block;
        vertical-align: top;
        font-size: 14px;

        &:hover {
          color: #1890ff;
        }
      }
    }

    .card-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }

    .project-item {
      display: flex;
      margin-top: 8px;
      overflow: hidden;
      font-size: 12px;
      height: 20px;
      line-height: 20px;

      a {
        color: rgba(0, 0, 0, 0.45);
        display: inline-block;
        flex: 1 1 0;

        &:hover {
          color: #1890ff;
        }
      }

      .datetime {
        color: rgba(0, 0, 0, 0.25);
        flex: 0 0 auto;
        float: right;
      }
    }

    .ant-card-meta-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
  }

  .item-group {
    padding: 20px 0 8px 24px;
    font-size: 0;

    a {
      color: rgba(0, 0, 0, 0.65);
      display: inline-block;
      font-size: 14px;
      margin-bottom: 13px;
      width: 25%;
    }
  }

  .members {
    a {
      display: block;
      margin: 12px 0;
      line-height: 24px;
      height: 24px;

      .member {
        font-size: 14px;
        color: rgba(0, 0, 0, .65);
        line-height: 24px;
        max-width: 100px;
        vertical-align: top;
        margin-left: 12px;
        transition: all 0.3s;
        display: inline-block;
      }

      &:hover {
        span {
          color: #1890ff;
        }
      }
    }
  }

  .mobile {

    .project-list {

      .project-card-grid {
        width: 100%;
      }
    }

    .more-info {
      border: 0;
      padding-top: 16px;
      margin: 16px 0 16px;
    }

    .headerContent .title .welcome-text {
      display: none;
    }
  }

</style>
