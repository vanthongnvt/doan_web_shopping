var express = require('express');
var router = express.Router();



router.get('/danh-sach', function(req, res, next) {
  const data=[
    {id:'VI001', name:'Huỳnh Đình Tiến', username:'tienibra17', email:'tienhuynh@gmail.com', phone:'0934942095', address:'TPHCM', status: 'Mở'},
    {id:'VI001', name:'Huỳnh Đình Tiến', username:'tienibra17', email:'tienhuynh@gmail.com', phone:'0934942095', address:'TPHCM', status: 'Mở'},
    {id:'VI001', name:'Huỳnh Đình Tiến', username:'tienibra17', email:'tienhuynh@gmail.com', phone:'0934942095', address:'TPHCM', status: 'Mở'},
    {id:'VI001', name:'Huỳnh Đình Tiến', username:'tienibra17', email:'tienhuynh@gmail.com', phone:'0934942095', address:'TPHCM', status: 'Khóa'},
    {id:'VI001', name:'Huỳnh Đình Tiến', username:'tienibra17', email:'tienhuynh@gmail.com', phone:'0934942095', address:'TPHCM', status: 'Mở'},
    {id:'VI001', name:'Huỳnh Đình Tiến', username:'tienibra17', email:'tienhuynh@gmail.com', phone:'0934942095', address:'TPHCM', status: 'Mở'},
    {id:'VI001', name:'Huỳnh Đình Tiến', username:'tienibra17', email:'tienhuynh@gmail.com', phone:'0934942095', address:'TPHCM', status: 'Mở'},
    {id:'VI001', name:'Huỳnh Đình Tiến', username:'tienibra17', email:'tienhuynh@gmail.com', phone:'0934942095', address:'TPHCM', status: 'Mở'},
    {id:'VI001', name:'Huỳnh Đình Tiến', username:'tienibra17', email:'tienhuynh@gmail.com', phone:'0934942095', address:'TPHCM', status: 'Mở'},
    {id:'VI001', name:'Huỳnh Đình Tiến', username:'tienibra17', email:'tienhuynh@gmail.com', phone:'0934942095', address:'TPHCM', status: 'Mở'},
    {id:'VI001', name:'Huỳnh Đình Tiến', username:'tienibra17', email:'tienhuynh@gmail.com', phone:'0934942095', address:'TPHCM', status: 'Mở'},
    {id:'VI001', name:'Huỳnh Đình Tiến', username:'tienibra17', email:'tienhuynh@gmail.com', phone:'0934942095', address:'TPHCM', status: 'Mở'},
    {id:'VI001', name:'Huỳnh Đình Tiến', username:'tienibra17', email:'tienhuynh@gmail.com', phone:'0934942095', address:'TPHCM', status: 'Mở'},
    {id:'VI001', name:'Huỳnh Đình Tiến', username:'tienibra17', email:'tienhuynh@gmail.com', phone:'0934942095', address:'TPHCM', status: 'Mở'},
    {id:'VI001', name:'Huỳnh Đình Tiến', username:'tienibra17', email:'tienhuynh@gmail.com', phone:'0934942095', address:'TPHCM', status: 'Mở'},
    {id:'VI001', name:'Huỳnh Đình Tiến', username:'tienibra17', email:'tienhuynh@gmail.com', phone:'0934942095', address:'TPHCM', status: 'Mở'},
    {id:'VI001', name:'Huỳnh Đình Tiến', username:'tienibra17', email:'tienhuynh@gmail.com', phone:'0934942095', address:'TPHCM', status: 'Mở'},
    {id:'VI001', name:'Huỳnh Đình Tiến', username:'tienibra17', email:'tienhuynh@gmail.com', phone:'0934942095', address:'TPHCM', status: 'Mở'},
    {id:'VI001', name:'Huỳnh Đình Tiến', username:'tienibra17', email:'tienhuynh@gmail.com', phone:'0934942095', address:'TPHCM', status: 'Mở'},
    {id:'VI001', name:'Huỳnh Đình Tiến', username:'tienibra17', email:'tienhuynh@gmail.com', phone:'0934942095', address:'TPHCM', status: 'Mở'},
    {id:'VI001', name:'Huỳnh Đình Tiến', username:'tienibra17', email:'tienhuynh@gmail.com', phone:'0934942095', address:'TPHCM', status: 'Mở'},
    {id:'VI001', name:'Huỳnh Đình Tiến', username:'tienibra17', email:'tienhuynh@gmail.com', phone:'0934942095', address:'TPHCM', status: 'Mở'},
    {id:'VI001', name:'Huỳnh Đình Tiến', username:'tienibra17', email:'tienhuynh@gmail.com', phone:'0934942095', address:'TPHCM', status: 'Mở'},
    {id:'VI001', name:'Huỳnh Đình Tiến', username:'tienibra17', email:'tienhuynh@gmail.com', phone:'0934942095', address:'TPHCM', status: 'Mở'},
    {id:'VI001', name:'Huỳnh Đình Tiến', username:'tienibra17', email:'tienhuynh@gmail.com', phone:'0934942095', address:'TPHCM', status: 'Mở'},
  ]
    res.render('./admin/user-list', {users:data});
  });





module.exports = router;
