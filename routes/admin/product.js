var express = require('express');
var router = express.Router();



router.get('/danh-sach', function(req, res, next) {
  const data=[
    {category:'Quần áo',id:'AX007',name:'Super Full set Điệp Viên',cost:'200,000',quantity:10,status:'Mở'},
    {category:'Dày dép',id:'GD003',name:'Giày bay cao cấp',cost:'20,000,000',quantity:2,status:'Mở'},
    {category:'Vũ khí',id:'VK002',name:'Wow Bummerang',cost:'1,200,000',quantity:10,status:'Mở'},
    {category:'Bí kíp võ công',id:'BK009',name:'Giáng long thập bát chưởng',cost:'2,000,000',quantity:1,status:'Mở'},
    {category:'Linh đan',id:'LD001',name:'Trường sinh dược',cost:'100,200,000',quantity:3,status:'Mở'},
    {category:'Vũ khí',id:'VK007',name:'Vip lu gạch',cost:'200,000',quantity:50,status:'Mở'},
    {category:'Quần áo',id:'AX012',name:'Áo tàng hình Harry Potter',cost:'2,900,000',quantity:1,status:'Mở'},
    {category:'Bảo thạch',id:'BT004',name:'Hồng Bảo thạch',cost:'200,000',quantity:10,status:'Mở'},
    {category:'Vũ khí',id:'VK001',name:'Đả cẩu bổng',cost:'12,000,000',quantity:1,status:'Mở'},
    {category:'Điện thoại',id:'DT007',name:'Nokia 1080',cost:'200,000',quantity:10,status:'Mở'},
    {category:'Quần áo',id:'AX007',name:'Super Full set Điệp Viên',cost:'200,000',quantity:10,status:'Mở'},
    {category:'Dày dép',id:'GD003',name:'Giày bay cao cấp',cost:'20,000,000',quantity:2,status:'Mở'},
    {category:'Vũ khí',id:'VK002',name:'Wow Bummerang',cost:'1,200,000',quantity:10,status:'Mở'},
    {category:'Bí kíp võ công',id:'BK009',name:'Giáng long thập bát chưởng',cost:'2,000,000',quantity:1,status:'Mở'},
    {category:'Linh đan',id:'LD001',name:'Trường sinh dược',cost:'100,200,000',quantity:3,status:'Mở'},
    {category:'Vũ khí',id:'VK007',name:'Vip lu gạch',cost:'200,000',quantity:50,status:'Mở'},
    {category:'Quần áo',id:'AX012',name:'Áo tàng hình Harry Potter',cost:'2,900,000',quantity:1,status:'Mở'},
    {category:'Bảo thạch',id:'BT004',name:'Hồng Bảo thạch',cost:'200,000',quantity:10,status:'Đóng'},
    {category:'Vũ khí',id:'VK001',name:'Đả cẩu bổng',cost:'12,000,000',quantity:1,status:'Mở'},
    {category:'Điện thoại',id:'DT007',name:'Nokia 1080',cost:'200,000',quantity:10,status:'Mở'},{category:'Quần áo',id:'AX007',name:'Super Full set Điệp Viên',cost:'200,000',quantity:10,status:'Mở'},
    {category:'Dày dép',id:'GD003',name:'Giày bay cao cấp',cost:'20,000,000',quantity:2,status:'Mở'},
    {category:'Vũ khí',id:'VK002',name:'Wow Bummerang',cost:'1,200,000',quantity:10,status:'Mở'},
    {category:'Bí kíp võ công',id:'BK009',name:'Giáng long thập bát chưởng',cost:'2,000,000',quantity:1,status:'Mở'},
    {category:'Linh đan',id:'LD001',name:'Trường sinh dược',cost:'100,200,000',quantity:3,status:'Mở'},
    {category:'Vũ khí',id:'VK007',name:'Vip lu gạch',cost:'200,000',quantity:50,status:'Mở'},
    {category:'Quần áo',id:'AX012',name:'Áo tàng hình Harry Potter',cost:'2,900,000',quantity:1,status:'Mở'},
    {category:'Bảo thạch',id:'BT004',name:'Hồng Bảo thạch',cost:'200,000',quantity:10,status:'Mở'},
    {category:'Vũ khí',id:'VK001',name:'Đả cẩu bổng',cost:'12,000,000',quantity:1,status:'Mở'},
    {category:'Điện thoại',id:'DT007',name:'Nokia 1080',cost:'200,000',quantity:10,status:'Mở'}

    ]
res.render('./admin/product-list',{products:data});
  });

  router.get('/them', function(req, res, next) {
    res.render('./admin/product-add');
  });




module.exports = router;
