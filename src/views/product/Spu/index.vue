<template>
  <div>
    <el-card style="margin: 20px 0px">
      <!-- 三级联动已经是全局组件了 -->
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scene == 0"
      ></CategorySelect>
    </el-card>
    <el-card>
      <!-- 底部这里将来是有三部分进行切换 -->
      <div v-show="scene == 0">
        <!-- 展示spu列表的结构 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 这里将来用hintButton替换 -->
              <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></hint-button>
              <hint-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></hint-button>
              <hint-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
                @click="handler(row)"
              ></hint-button>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <hint-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                  slot="reference"
                ></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->, sizes, total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
          :total="total"
        >
        </el-pagination>
      </div>
      <SpuForm v-show="scene == 1" @changeScene="changeScene" ref="spu" />
      <SkuForm v-show="scene == 2" ref="sku" @changeScenes="changeScenes" />
      <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
        <!-- table展示sku列表 -->
        <el-table :data="skuList" style="width: 100%" border v-loading="loading">
          <el-table-column
            prop="skuName"
            label="名称"
            width="width">
          </el-table-column>
          <el-table-column
            prop="price"
            label="价格"
            width="width">
          </el-table-column>
          <el-table-column
            prop="weight"
            label="重量"
            width="width">
          </el-table-column>
          <el-table-column label="默认图片" width="width">
            <template slot-scope="{row,$index}">
              <img :src="row.skuDefaultImg" style="width:100px;height:100px">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
//引入子组件
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "Spu",
  components: { SpuForm, SkuForm },
  data() {
    return {
      //分别是分类的id
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //分页器当前第几页
      page: 1,
      //每一页需要展示多少条数据
      limit: 3,
      records: [], //spu列表的数据
      total: 0, //分页器一共需要展示数据的条数
      scene: 0, //0代表展示spu列表数据  1代表添加spu或者修改spu  2代表添加sku
      //控制对话框的显示与隐藏
      dialogTableVisible:false,
      spu:{},
      skuList:[],//存储sku列表的数据
      loading:true
    };
  },
  methods: {
    //三级联动的自定义事件，可以把子组件的相应的id传递给给父组件
    getCategoryId({ categoryId, level }) {
      //categoryId:获取到一、二、三级分类的id  level：为了去区分是几级id
      if (level == 1) {
        this.category1Id = categoryId;
        //清除二和三级分类的id
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        //获取spu列表数据进行展示
        this.getSpuList();
      }
    },
    //获取spu列表数据的方法
    async getSpuList(pages = 1) {
      this.page = pages;
      const { page, limit, category3Id } = this;
      //携带三个参数：page：第几页  limit：每一页需要展示多少条数据  三级分类id
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    //当分页器每一页展示数据条数发生变化的回调
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    //添加spu按钮的回调
    addSpu() {
      this.scene = 1;
      //通知子组件SpuFrom发请求--两个
      this.$refs.spu.addSpuData(this.category3Id);
    },
    //修改某一个spu
    updateSpu(row) {
      this.scene = 1;
      //获取子组件SpuForm\
      //在父组件中可以通过$refs获取子组件
      this.$refs.spu.initSpuData(row);
    },
    //自定义事件回调（SpuForm）
    changeScene({ scene, flag }) {
      //flag这个形参为了区分保存按钮是添加还是修改
      //切换场景
      this.scene = scene;
      //子组件通知父组件切换场景，需要再次获取spu列表的数据进行展示
      if (flag == "修改") {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },
    //删除spu的按钮的回调
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功" });
        //代表spu个数大于1，删除的时候停留在当前页，如果spu个数小于1，回到上一页
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    //添加sku按钮的回调
    addSku(row) {
      //切换场景为2
      this.scene = 2;
      //父组件调用子组件的方法，让子组件发请求--三个请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    //skuFrom通知父组件修改场景
    changeScenes(scene) {
      this.scene = scene;
    },
    //查看sku的按钮的回调
    async handler(spu){
      //点击这个按钮的时候，对话框是可见的
      this.dialogTableVisible=true
      //保存spu信息
      this.spu=spu
      //获取spu列表的数据进行展示
      let result = await this.$API.spu.reqSkuList(spu.id)
      if(result.code==200){
        this.skuList=result.data
        //loading隐藏
        this.loading=false
      }
    },
    //关闭对话框的回调
    close(done){
      //loading属性再次变为真
      this.loading=true
      //清除sku列表的数据
      this.skuList=[]
      //关闭对话框
      done()
    }
  },
};
</script>

<style>
</style>