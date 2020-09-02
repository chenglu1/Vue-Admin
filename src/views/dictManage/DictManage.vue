<template >
  <page-header-wrapper>
    <a-card :bordered="false" v-show="!record" >
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="字典名称">
                <a-input v-model="queryParam.dictName" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
        <a-button type="primary" icon="edit" @click="handleEdit">编辑</a-button>
        <a-button type="primary" icon="delete" @click="handleDel">删除</a-button>
        <!-- <a-dropdown v-action:edit >
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="handleEdit(record)"><a-icon type="edit" />修改</a-menu-item>
            <a-menu-item key="2"><a-icon type="delete" />删除</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown> -->
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="dictId"
        :columns="columns"
        :data="loadData"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="dictName" slot-scope="text">
          <ellipsis :length="16" tooltip>{{ text }}</ellipsis>
        </span>
        <span slot="subCount" slot-scope="text,record">
          <a @click="handlegotoLink(record)">子分类管理（{{ text }}）</a>
        </span>
      </s-table>

      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel"
        @ok="handleOk"
      />
      <step-by-step-modal ref="modal" @ok="handleOk"/>
    </a-card>
    <a-card :bordered="false" v-show="record && record.dictId" >
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="数据名称">
                <a-input v-model="queryParam1.dictDataName" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table1.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam1 = {}">重置</a-button>
                <!-- <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a> -->
              </span>
            </a-col>
            <a-button type="primary" @click="goBack" style="margin-right: 16px;float: right;">返回</a-button>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" >新建</a-button>
        <a-button type="primary" icon="edit">编辑</a-button>
        <a-button type="primary" icon="delete" >删除</a-button>
      </div>

      <s-table
        ref="table1"
        size="default"
        rowKey="dictId"
        :columns="columns1"
        :data="loadData1"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { addServiceList, getServiceList, getDictInfolist } from '@/api/manage'

import StepByStepModal from './modules/StepByStepModal'
import CreateForm from './modules/CreateForm'

const columns = [
  {
    title: '序号',
    dataIndex: 'ROWNUM_'
  },
  {
    title: '字典值',
    dataIndex: 'dictValue'

  },
  {
    title: '字典名称',
    dataIndex: 'dictName',
    scopedSlots: { customRender: 'dictName' }
  },
  {
    title: '字典明细项',
    dataIndex: 'subCount',
    width: '150px',
    scopedSlots: { customRender: 'subCount' }
  }
]
const columns1 = [
  {
    title: '编号',
    dataIndex: 'ROWNUM_'
  },
  {
    title: '所属字典',
    dataIndex: 'valueName'

  },
  {
    title: '数据值',
    dataIndex: 'dictDataValue'
  },
  {
    title: '数据名称',
    dataIndex: 'dictDataName',
    width: '150px'
  }
]
export default {
  name: 'DictManage',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal
  },
  data () {
    this.columns = columns
    this.columns1 = columns1
    return {
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      record: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      queryParam1: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return getServiceList(requestParameters)
          .then(res => {
            if (res.kdjson.flag === '1' && res.kdjson.items) {
             return res.kdjson
            } else {
                return []
            }
          })
      },
      // 加载数据方法 必须为 Promise 对象
      loadData1: parameter => {
        const requestParameters = Object.assign({ dictValue: this.record && this.record.dictValue }, parameter, this.queryParam1)
        console.log('loadData1 request parameters:', requestParameters)
        if (requestParameters.dictValue) {
          return getDictInfolist(requestParameters)
          .then(res => {
            if (res.kdjson.flag === '1' && res.kdjson.items) {
             return res.kdjson
            } else {
                return []
            }
          })
          }
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created () {
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    handleAdd () {
      this.mdl = null
      this.visible = true
    },
    handleEdit (record) {
      if (this.selectedRows.length !== 1) {
         this.$message.info('请选择一条记录再修改')
         return
      }
      this.visible = true
      this.mdl = { ...this.selectedRows[0] }
    },
    handlegotoLink (record) {
      this.record = record
      this.$refs.table1.refresh(true)
    },
    goBack () {
      this.record = null
    },
    handleDel () {
       if (this.selectedRows.length !== 1) {
         this.$message.info('请选择一条记录再删除')
         return
      }
      const { dictId } = this.selectedRows[0]
      const $this = this
        this.$confirm({
        title: '确定要删除此条任务吗?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
            // 删除
           addServiceList({ dictId, 'operType': 'DEL' })
            .then(res => {
            if (res.kdjson.flag === '1') {
                $this.$message.info(res.kdjson.msg)
              // 刷新表格
              $this.queryParam = {}
              $this.$refs.table.refresh()
            }
          })
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    },
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          if (values.dictId) {
            // 修改 e.g.
           addServiceList({ ...values, 'operType': 'UPD' })
          .then(res => {
            if (res.kdjson.flag === '1') {
                this.$message.info(res.kdjson.msg)
                this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()
            } else {
               this.confirmLoading = false
            }
          })
          } else {
            // 新增
           addServiceList({ ...values, 'operType': 'ADD' })
          .then(res => {
            if (res.kdjson.flag === '1') {
                this.$message.info(res.kdjson.msg)
                this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()
            } else {
               this.confirmLoading = false
            }
          })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false

      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    }
  }
}
</script>
