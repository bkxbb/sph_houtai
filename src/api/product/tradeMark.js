//这个模块主要是获取品牌管理的数据的模块
import request from '@/utils/request'

//获取品牌列表接口 GET /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page,limit)=>request({url:`/admin/product/baseTrademark/${page}/${limit}`,method:'get'})

//处理添加品牌 POST /admin/product/baseTrademark/save  携带品牌名称、品牌LOGO  不带id，由后端生成
//修改品牌 PUT /admin/product/baseTrademark/update  携带品牌名称、品牌LOGO、id
export const reqAddOrUpdateTradeMark =(tradeMark)=>{
  //带给服务器数据携带id---修改
  if(tradeMark.id){
    return request({url:'/admin/product/baseTrademark/update',data:tradeMark,method:'put'})
  }else{
    //新增品牌
    return request({url:'/admin/product/baseTrademark/save',data:tradeMark,method:'post'})
  }
}

//删除品牌 /admin/product/baseTrademark/remove/{id}  delete
export const reqDeleteTradeMark=(id)=>request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'})

