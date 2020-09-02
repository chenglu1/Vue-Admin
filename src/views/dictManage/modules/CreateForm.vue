<!--
 * @Author: your name
 * @Date: 2020-09-01 15:02:47
 * @LastEditTime: 2020-09-02 14:12:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Vue-Admin\src\views\dictManage\modules\CreateForm.vue
-->
<template>
  <a-modal
    :title="model && model.dictId ? '编辑':'新增'"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item v-show="model && model.dictId" label="字典ID">
          <a-input v-decorator="['dictId', { initialValue: '' }]" disabled />
        </a-form-item>
        <a-form-item label="字典值">
          <a-input v-decorator="['dictValue', {rules: [{required: true, max: 20, message: '请输入字典值，最长20个字符！'}]}]" />
        </a-form-item>
        <a-form-item label="字典名称">
          <a-input v-decorator="['dictName', {rules: [{required: true, max: 64, message: '请输入字典名称，最长64个字符！'}]}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['dictId', 'dictName', 'dictValue']

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data () {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
    return {
      form: this.$form.createForm(this)
    }
  },
  created () {
    console.log('custom modal created')

    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  }
}
</script>
