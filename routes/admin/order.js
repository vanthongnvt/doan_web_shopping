var express = require('express');
var router = express.Router();



router.get('/danh-sach', function(req, res, next) {
  const data=[
    {id:'ORD001', name:'Lê Văn Luyện', phone:'0123456789', address:'Hà Nội', totalcost: '1 000 000', status: 'Đã giao'},
    {id:'ORD001', name:'Lê Văn Luyện', phone:'0123456789', address:'Hà Nội', totalcost: '1 000 000', status: 'Đang giao'},
    {id:'ORD001', name:'Lê Văn Luyện', phone:'0123456789', address:'Hà Nội', totalcost: '1 000 000', status: 'Đã hủy'},
    {id:'ORD001', name:'Lê Văn Luyện', phone:'0123456789', address:'Hà Nội', totalcost: '1 000 000', status: 'Đã giao'},
    {id:'ORD001', name:'Lê Văn Luyện', phone:'0123456789', address:'Hà Nội', totalcost: '1 000 000', status: 'Đã giao'},
    {id:'ORD001', name:'Lê Văn Luyện', phone:'0123456789', address:'Hà Nội', totalcost: '1 000 000', status: 'Đã giao'},
    {id:'ORD001', name:'Lê Văn Luyện', phone:'0123456789', address:'Hà Nội', totalcost: '1 000 000', status: 'Đã giao'},
    {id:'ORD001', name:'Lê Văn Luyện', phone:'0123456789', address:'Hà Nội', totalcost: '1 000 000', status: 'Đã giao'},
    {id:'ORD001', name:'Lê Văn Luyện', phone:'0123456789', address:'Hà Nội', totalcost: '1 000 000', status: 'Đã giao'},
    {id:'ORD001', name:'Lê Văn Luyện', phone:'0123456789', address:'Hà Nội', totalcost: '1 000 000', status: 'Đã giao'},
    {id:'ORD001', name:'Lê Văn Luyện', phone:'0123456789', address:'Hà Nội', totalcost: '1 000 000', status: 'Đã giao'},
    {id:'ORD001', name:'Lê Văn Luyện', phone:'0123456789', address:'Hà Nội', totalcost: '1 000 000', status: 'Đã giao'},
    {id:'ORD001', name:'Lê Văn Luyện', phone:'0123456789', address:'Hà Nội', totalcost: '1 000 000', status: 'Đã giao'},
    {id:'ORD001', name:'Lê Văn Luyện', phone:'0123456789', address:'Hà Nội', totalcost: '1 000 000', status: 'Đã giao'},
    {id:'ORD001', name:'Lê Văn Luyện', phone:'0123456789', address:'Hà Nội', totalcost: '1 000 000', status: 'Đã giao'},
    {id:'ORD001', name:'Lê Văn Luyện', phone:'0123456789', address:'Hà Nội', totalcost: '1 000 000', status: 'Đã giao'},
    {id:'ORD001', name:'Lê Văn Luyện', phone:'0123456789', address:'Hà Nội', totalcost: '1 000 000', status: 'Đã giao'},
    {id:'ORD001', name:'Lê Văn Luyện', phone:'0123456789', address:'Hà Nội', totalcost: '1 000 000', status: 'Đã giao'},
    {id:'ORD001', name:'Lê Văn Luyện', phone:'0123456789', address:'Hà Nội', totalcost: '1 000 000', status: 'Đã giao'},
  ]
    res.render('./admin/order-list', {orders:data});
  });





module.exports = router;
