//  productList : async function(req,res){
//         try{

//             var params = _.pick(
//                 req.query,
//                 'title',
//                 'isOptimized',
//                 'size',
//             );
//             var perPage = req.query.perPage > 0 ? parseInt(req.query.perPage) : 10
//             var page = req.query.page > 0 ? parseInt(req.query.page)-1 : 0

//             var matchObj={};
//             matchObj.store = req.store.store;
//             if(params.isOptimized!=undefined && params.isOptimized!=""){
//                 matchObj.isOptimized = params.isOptimized;
//             }
//             if(params.title!=undefined && params.title!=""){
//                 matchObj.title = {
//                     $regex: params.title,
//                     $options: 'i',
//                 };
//             }
//             var sortObj;
//             if(params.size!=undefined && params.size=="asc"){
//                 sortObj={
//                     size : 0
//                 }
//             }else if(params.size!=undefined && params.size=="desc"){
//                 sortObj = {
//                     size : -1
//                 }
//             }else{
//                 sortObj={
//                     productId : -1
//                 }
//             }
//             const list = await ProductsImages.find(matchObj).limit(perPage).skip(perPage * page).sort(sortObj);

//             var responseData={};
//             var productListData=[];
//             if(list.length>=1){
//                 var i
//                 for (i = 0; i < list.length; i++) {
//                     var afterImageSize=0;
//                     var optimizedPercentage=0;
//                     if(list[i].isOptimized){
//                         afterImageSize = list[i].size/2;
//                         optimizedPercentage = 60;
//                     }
//                     var product = {
//                         id:list[i]._id,
//                         optimizedPercentage: list[i].optimizedPercentage,
//                         ImageOptimizationDone_at: list[i].ImageOptimizationDone_at,
//                         isOptimized: list[i].isOptimized,
//                         productId: list[i].productId,
//                         imageId: list[i].imageId,
//                         title: list[i].title,
//                         images:list[i].src,
//                         vendor: list[i].vendor,
//                         product_type: list[i].type,
//                         totalImageSizeBefore:parseFloat(list[i].size).toFixed(2),
//                         totalImageSizeAfter:parseFloat(afterImageSize).toFixed(2),
//                     };
//                     productListData.push(product);
//                 }
//                 const TotalProductImages = await ProductsImages.find(matchObj).sort({created_at: -1,}).countDocuments();
//                 responseData.list = productListData;
//                 responseData.perPage = perPage;
//                 responseData.page = page+1;
//                 responseData.totalProduct = TotalProductImages;
//                 responseData.totalPage = Math.ceil(TotalProductImages/perPage);
//             }else{
//                 responseData.list=productListData;
//                 responseData.perPage=perPage;
//                 responseData.page=req.query.page > 0 ? parseInt(req.query.page) : 1;
//                 responseData.totalProduct = 0;
//                 responseData.totalPage = 0;
//             }
//             return res.status(200).json(Service.response(1, localization.success, responseData));

//         }catch(err){
//             console.log('ERR',err);
//             return res.status(200).json(Service.response(0,localization.ServerError,{}));
//         }
//     },