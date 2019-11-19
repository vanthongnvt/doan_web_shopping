var express = require('express');
var slug = require('slug');
var router = express.Router();
var bcrypt   = require('bcryptjs');
var userModel=require('../../models/user');
var categoryModel=require('../../models/category');
var brandModel=require('../../models/brand');
var productModel=require('../../models/product');
var mongoose=require('mongoose');
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

router.get('/create-users',function(req,res,next){

	var arr = [{
		username: 'Nameef',
		email:'myemail@gmail.com',
		password: bcrypt.hashSync('123456', bcrypt.genSaltSync(8), null),
	},{
		username: 'gwaeg',
		email:'myemail@gmail.com',
		password: bcrypt.hashSync('123456', bcrypt.genSaltSync(8), null),
	},{
		username: 'weaner',
		email:'myemail@gmail.com',
		password: bcrypt.hashSync('123456', bcrypt.genSaltSync(8), null),
	},{
		username: 'dinker',
		email:'myemail@gmail.com',
		password: bcrypt.hashSync('123456', bcrypt.genSaltSync(8), null),
	},{
		username: 'poppee',
		email:'myemail@gmail.com',
		password: bcrypt.hashSync('123456', bcrypt.genSaltSync(8), null),
	}];

	userModel.insertMany(arr, function(error, docs) {
		if(error){
			console.log(error);
			return res.send('503');
		}
		else{
			return res.send('200 OK');
		}
		
	});
});

router.get('/create-category',function(req,res,next){
	var arr = [{
		name: 'Điện thoại',
		slug: slug('Điện thoại',{lower:true}),
	},{
		name: 'Tablet',
		slug: slug('Tablet',{lower:true}),
	},{
		name: 'Laptop',
		slug: slug('Laptop',{lower:true}),
	},{
		name: 'Tivi',
		slug: slug('Tivi',{lower:true}),
	}];

	categoryModel.insertMany(arr, function(error, docs) {
		if(error){
			console.log(error);
			return res.send('503');
		}
		else{
			return res.send('200 OK');
		}
		
	});

});
router.get('/create-brand',function(req,res,next){
	// let categories;
	categoryModel.find({},function(err,docs){
		if(err){
			console.log(err);
			return res.send('503');
		}
		else{
			// categories=docs;
			insert(docs);
			// console.log(categories.length);
		}
	});
	const insert = function(categories){
		let phoneId,laptopId,tiviId,tabletId;

		categories.forEach(function(category){
			if(category.slug=='dien-thoai'){
				phoneId=category._id;
			}
			else if(category.slug=='laptop'){
				laptopId=category._id;
			}
			else if(category.slug=='tablet'){
				tabletId=category._id;
			}
			else if(category.slug=='tivi'){
				tiviId=category._id;
			}
		})

		var arr = [{
			name: 'Samsung',
			slug: slug('Samsung',{lower:true}),
			categoryId:phoneId,
		},{
			name: 'Apple',
			slug: slug('Apple',{lower:true}),
			categoryId:phoneId,
		},{
			name: 'Vivo',
			slug: slug('Vivo',{lower:true}),
			categoryId:phoneId,
		},{
			name: 'Xiaomi',
			slug: slug('Xiaomi',{lower:true}),
			categoryId:phoneId,
		},{
			name: 'Oppo',
			slug: slug('Oppo',{lower:true}),
			categoryId:phoneId,
		},{
			name: 'Huawei',
			slug: slug('Huawei',{lower:true}),
			categoryId:phoneId,
		},{
			name: 'Nokia',
			slug: slug('Nokia',{lower:true}),
			categoryId:phoneId,
		},{
			name: 'Samsung',
			slug: slug('Samsung',{lower:true}),
			categoryId:tiviId,
		},{
			name: 'LG',
			slug: slug('LG',{lower:true}),
			categoryId:tiviId,
		},{
			name: 'Sony',
			slug: slug('Sony',{lower:true}),
			categoryId:tiviId,
		},{
			name: 'Panasonic',
			slug: slug('Panasonic',{lower:true}),
			categoryId:tiviId,
		},{
			name: 'Dell',
			slug: slug('Dell',{lower:true}),
			categoryId:laptopId,
		},{
			name: 'Apple',
			slug: slug('Apple',{lower:true}),
			categoryId:laptopId,
		},{
			name: 'Asus',
			slug: slug('Asus',{lower:true}),
			categoryId:laptopId,
		},{
			name: 'Acer',
			slug: slug('Acer',{lower:true}),
			categoryId:laptopId,
		},{
			name: 'HP',
			slug: slug('HP',{lower:true}),
			categoryId:laptopId,
		},{
			name: 'Lenovo',
			slug: slug('Lenovo',{lower:true}),
			categoryId:laptopId,
		},{
			name: 'MSI',
			slug: slug('MSI',{lower:true}),
			categoryId:laptopId,
		},,{
			name: 'Apple',
			slug: slug('Apple',{lower:true}),
			categoryId:tabletId,
		},,{
			name: 'Samsung',
			slug: slug('Samsung',{lower:true}),
			categoryId:tabletId,
		},{
			name: 'Huawei',
			slug: slug('Huawei',{lower:true}),
			categoryId:tabletId,
		},{
			name: 'Lenovo',
			slug: slug('Lenovo',{lower:true}),
			categoryId:tabletId,
		}];

		brandModel.insertMany(arr, function(error, docs) {
			if(error){
				console.log(error);
				return res.send('503');
			}
			else{
				return res.send('200 OK');
			}
			
		});
	}

});
router.get('/create-product',function(req,res,next){
	brandModel.find({}).populate('categoryId').exec(function(err,docs){
		if(err){
			console.log(err);
			return res.send('503');
		}
		else{
			// console.log(docs);
			insert(docs);
		}
	});
	let insert = function(brands){
		let phoneApple,phoneSamSung, laptopDell, laptopAsus, laptopApple,
		phoneHuawei,phoneXiaomi, tiviLG, tiviSamSung,tiviSony,tabletApple;
		brands.forEach(function(brand){
			if(brand.slug=='apple'&&brand.categoryId.slug=='dien-thoai'){
				phoneApple=brand;
			}
			else if(brand.slug=='samsung'&&brand.categoryId.slug=='dien-thoai'){
				phoneSamSung=brand;
			}
			else if(brand.slug=='dell'&&brand.categoryId.slug=='laptop'){
				laptopDell=brand;
			}
			else if(brand.slug=='asus'&&brand.categoryId.slug=='laptop'){
				laptopAsus=brand;
			}
			else if(brand.slug=='apple'&&brand.categoryId.slug=='laptop'){
				laptopApple=brand;
			}
			else if(brand.slug=='huawei'&&brand.categoryId.slug=='dien-thoai'){
				phoneHuawei=brand;
			}
			else if(brand.slug=='xiaomi'&&brand.categoryId.slug=='dien-thoai'){
				phoneXiaomi=brand;
			}
			else if(brand.slug=='lg'&&brand.categoryId.slug=='tivi'){
				tiviLG=brand;
			}
			else if(brand.slug=='samsung'&&brand.categoryId.slug=='tivi'){
				tiviSamSung=brand;
			}
			else if(brand.slug=='sony'&&brand.categoryId.slug=='tivi'){
				tiviSony=brand;
			}
			else if(brand.slug=='apple'&&brand.categoryId.slug=='tablet'){
				tabletApple=brand;
			}

		})
		var arr = [{
			name: 'Samsung Galaxy Note 10',
			slug: slug('Samsung Galaxy Note 10',{lower:true}),
			brandId:phoneSamSung._id,
			categoryId:phoneSamSung.categoryId._id,
			images:'samsung-galaxy-note-10-i1.png',
			price:22990000,
			detail:'Màn hình:	Dynamic AMOLED, 6.3", Full HD+. Hệ điều hành:	Android 9.0 (Pie). Camera sau:	Chính 12 MP & Phụ 12 MP, 16 MP',
		},{
			name: 'Samsung Galaxy A80',
			slug: slug('Samsung Galaxy A80',{lower:true}),
			brandId:phoneSamSung._id,
			categoryId:phoneSamSung.categoryId._id,
			images:'samsung-galaxy-a80-i1.png',
			price:14990000,
			detail:'Màn hình:	Super AMOLED, 6.7", Full HD+. Hệ điều hành:	Android 9.0 (Pie). Camera sau:	Chính 48 MP & Phụ 8 MP, TOF 3D',
		},{
			name: 'Samsung Galaxy S10+',
			slug: slug('Samsung Galaxy S10+',{lower:true}),
			brandId:phoneSamSung._id,
			categoryId:phoneSamSung.categoryId._id,
			images:'samsung-galaxy-s10-plus-i1.png',
			price:22990000,
			detail:'Màn hình:	Dynamic AMOLED, 6.4", Quad HD+ (2K+). Hệ điều hành:	Android 9.0 (Pie). Camera sau:	Chính 12 MP & Phụ 12 MP, 16 MP',
		},{
			name: 'iPhone 11 Pro Max 512GB',
			slug: slug('iPhone 11 Pro Max 512GB',{lower:true}),
			brandId:phoneApple._id,
			categoryId:phoneApple.categoryId._id,
			images:'iphone-11-pro-max-512gb-i1.png',
			price:43990000,
			detail:'Màn hình:	OLED, 6.5", Super Retina XDR. Hệ điều hành:	iOS 13. Camera sau:	3 camera 12 MP',
		},{
			name: 'iPhone 8 Plus 64GB',
			slug: slug('iPhone 8 Plus 64GB',{lower:true}),
			brandId:phoneApple._id,
			categoryId:phoneApple.categoryId._id,
			images:'iphone-8-plus-i1.png',
			price:15990000,
			detail:'Màn hình:	LED-backlit IPS LCD, 5.5", Retina HD. Hệ điều hành:	iOS 12. Camera sau:	Chính 12 MP & Phụ 12 MP',
		},{
			name: 'iPhone 6s Plus 32GB',
			slug: slug('iPhone 6s Plus 32GB',{lower:true}),
			brandId:phoneApple._id,
			categoryId:phoneApple.categoryId._id,
			images:'iphone-6s-plus-32gb-i1.png',
			price:8990000,
			detail:'Màn hình:	LED-backlit IPS LCD, 5.5", Retina HD. Hệ điều hành:	iOS 12. Camera sau:	12 MP',
		},{
			name: 'Dell Vostro 3468 i3 7020U (70161069)',
			slug: slug('Dell Vostro 3468 i3 7020U (70161069)',{lower:true}),
			brandId:laptopDell._id,
			categoryId:laptopDell.categoryId._id,
			images:'dell-vostro-3468-i3-7020u-70161069-i1.jpg',
			price:11690000,
			detail:'CPU:	Intel Core i3 Kabylake, 7020U, 2.30 GHz. RAM:	4 GB, DDR4 (2 khe), 2400 MHz. Ổ cứng:	HDD: 1 TB',
		},{
			name: 'Dell Vostro 14 3480 i5 8265U/4GB/1TB/Win10 (70187647)',
			slug: slug('Dell Vostro 14 3480 i5 8265U/4GB/1TB/Win10 (70187647)',{lower:true}),
			brandId:laptopDell._id,
			categoryId:laptopDell.categoryId._id,
			images:'dell-vostro-3480-i5-8265u-4gb-1tb-14-win10-7018377-i1.jpg',
			price:15990000,
			detail:'CPU:	Intel Core i5 Coffee Lake, 8265U, 1.60 GHz. RAM:	4 GB, DDR4 (2 khe), 2666 MHz. Ổ cứng:	HDD: 1 TB SATA3, Hỗ trợ khe cắm SSD M.2 PCIe',
		},{
			name: 'Dell Inspiron 5593 i5 1035G1 (7WGNV1)',
			slug: slug('Dell Inspiron 5593 i5 1035G1 (7WGNV1)',{lower:true}),
			brandId:laptopDell._id,
			categoryId:laptopDell.categoryId._id,
			images:'dell-inspiron-5593-i5-1035g1-8gb-512gb-win10-7wgn-i1.jpg',
			price:19390000,
			detail:'CPU:	Intel Core i5 Ice Lake, 1035G1, 1.00 GHz. RAM:	8 GB, DDR4 (On board +1 khe), 2666 MHz. Ổ cứng:	SSD 512 GB M.2 PCIe',
		},{
			name: 'Asus VivoBook X507MA N4000 (BR318T)',
			slug: slug('Asus VivoBook X507MA N4000 (BR318T)',{lower:true}),
			brandId:laptopAsus._id,
			categoryId:laptopAsus.categoryId._id,
			images:'asus-x507ma-n4000-4gb-256gb-win10-i1.jpg',
			price:6490000,
			detail:'CPU:	Intel Celeron, N4000, 1.10 GHz. RAM:	4 GB, DDR4 (1 khe), 2400 MHz. Ổ cứng:	SSD: 256 GB M2',
		},{
			name: 'Asus VivoBook A512FA i5 8265U (EJ552T)',
			slug: slug('Asus VivoBook A512FA i5 8265U (EJ552T)',{lower:true}),
			brandId:laptopAsus._id,
			categoryId:laptopAsus.categoryId._id,
			images:'asus-a512fa-i5-8265u-i1.jpg',
			price:16290000,
			detail:'CPU:	Intel Core i5 Coffee Lake, 8265U, 1.60 GHz. RAM:	8 GB, DDR4 (On board +1 khe), 2400 MHz. Ổ cứng:	HDD: 1 TB SATA3',
		},{
			name: 'MacBook Air 2017 128GB (MQD32SA/A)',
			slug: slug('MacBook Air 2017 128GB (MQD32SA/A)',{lower:true}),
			brandId:laptopApple._id,
			categoryId:laptopApple.categoryId._id,
			images:'apple-macbook-air-mqd32sa-a-i5-5350u-i1.jpg',
			price:21490000,
			detail:'CPU:	Intel Core i5 Broadwell, 1.80 GHz. RAM:	8 GB, DDR3L(On board), 1600 MHz. Ổ cứng:	SSD: 128 GB',
		},{
			name: 'Macbook Air 2019 1.6GHz 128GB (MVFM2SA/A)',
			slug: slug('Macbook Air 2019 1.6GHz 128GB (MVFM2SA/A)',{lower:true}),
			brandId:laptopApple._id,
			categoryId:laptopApple.categoryId._id,
			images:'apple-macbook-air-2019-i5-16ghz-i1.jpg',
			price:27990000,
			detail:'CPU:	Intel Core i5 Coffee Lake, 1.60 GHz. RAM:	8 GB, DDR3, 2133 MHz. Ổ cứng:	SSD: 128 GB',
		},{
			name: 'Macbook Pro Touch 2019 (MUHP2SA/A)',
			slug: slug('Macbook Pro Touch 2019 (MUHP2SA/A)',{lower:true}),
			brandId:laptopApple._id,
			categoryId:laptopApple.categoryId._id,
			images:'apple-macbook-pro-touch-2019-i5-14ghz-8gb-256gb-i1a.jpg',
			price:39990000,
			detail:'CPU:	Intel Core i5 Coffee Lake, 1.40 GHz. RAM:	8 GB, DDR3L, 2133 MHz. Ổ cứng:	SSD 256GB NVMe PCIe',
		},{
			name: 'Huawei P30 Pro',
			slug: slug('Huawei P30 Pro',{lower:true}),
			brandId:phoneHuawei._id,
			categoryId:phoneHuawei.categoryId._id,
			images:'huawei-p30-pro-i1.png',
			price:20690000,
			detail:'Màn hình:	OLED, 6.47", Full HD+. Hệ điều hành:	Android 9.0 (Pie). Camera sau:	Chính 40 MP & Phụ 20 MP, 8 MP, TOF 3D',
		},{
			name: 'Huawei P30 Lite',
			slug: slug('Huawei P30 Lite',{lower:true}),
			brandId:phoneHuawei._id,
			categoryId:phoneHuawei.categoryId._id,
			images:'huawei-p30-lite-i1.png',
			price:6020000,
			detail:'Màn hình:	IPS LCD, 6.15", Full HD+. Hệ điều hành:	Android 9.0 (Pie). Camera sau:	Chính 24 MP & Phụ 8 MP, 2 MP',
		},{
			name: 'Huawei Nova 3i',
			slug: slug('Huawei Nova 3i',{lower:true}),
			brandId:phoneHuawei._id,
			categoryId:phoneHuawei.categoryId._id,
			images:'huawei-nova-3i-i1.png',
			price:5390000,
			detail:'Màn hình:	LTPS LCD, 6.3", Full HD+. Hệ điều hành:	Android 8.1 (Oreo). Camera sau:	Chính 16 MP & Phụ 2 MP',
		},{
			name: 'Xiaomi Mi 9 SE',
			slug: slug('Xiaomi Mi 9 SE',{lower:true}),
			brandId:phoneXiaomi._id,
			categoryId:phoneXiaomi.categoryId._id,
			images:'xiaomi-mi-9-se-i1.png',
			price:7490000,
			detail:'Màn hình:	Super AMOLED, 5.97", Full HD+. Hệ điều hành:	Android 9.0 (Pie). Camera sau:	Chính 48 MP & Phụ 13 MP, 8 MP',
		},{
			name: 'Xiaomi Mi 9T',
			slug: slug('Xiaomi Mi 9T',{lower:true}),
			brandId:phoneXiaomi._id,
			categoryId:phoneXiaomi.categoryId._id,
			images:'xiaomi-mi-9t-i1.png',
			price:7990000,
			detail:'Màn hình:	AMOLED, 6.39", Full HD+. Hệ điều hành:	Android 9.0 (Pie). Camera sau:	Chính 48 MP & Phụ 13 MP, 8 MP',
		},{
			name: 'Xiaomi Redmi Note 8 Pro (6GB/128GB)',
			slug: slug('Xiaomi Redmi Note 8 Pro (6GB/128GB)',{lower:true}),
			brandId:phoneXiaomi._id,
			categoryId:phoneXiaomi.categoryId._id,
			images:'xiaomi-redmi-note-8-pro-6gb-128gb-i1.png',
			price:6490000,
			detail:'Màn hình:	IPS LCD, 6.53", Full HD+. Hệ điều hành:	Android 9.0 (Pie). Camera sau:	Chính 64 MP & Phụ 8 MP, 2 MP, 2 MP',
		},{
			name: 'Smart TV 4K LG 55 inch 55UM7400PTA',
			slug: slug('Smart TV 4K LG 55 inch 55UM7400PTA',{lower:true}),
			brandId:tiviLG._id,
			categoryId:tiviLG.categoryId._id,
			images:'smart-tv-4k-lg-55-inch-55um7400pta-i1.jpg',
			price:12399000,
			detail:'Trọng lượng	Không chân đế: 14.6kg. Có chân đế: 15.6kg. Kích thước màn hình	:55 inches',
		},{
			name: 'Smart TV 4K SUHD 43inch LG 43UJ750T',
			slug: slug('Smart TV 4K SUHD 43inch LG 43UJ750T',{lower:true}),
			brandId:tiviLG._id,
			categoryId:tiviLG.categoryId._id,
			images:'smart-tv-4k-suhd-43inch-lg-43uj750t-i1.jpg',
			price:7990000,
			detail:'Kích thước màn hình	:43 inches. Kích thước	Kích thước (không chân đế) 967.6 x 62.1 x 566.4 mm Kích thước (bao gồm đế) 967.6 x 217.9 x 625.1 mm',
		},{
			name: 'Smart TV LED 4K HDR Sony 65 inch KD-65X7000G (2019)',
			slug: slug('Smart TV LED 4K HDR Sony 65 inch KD-65X7000G (2019)',{lower:true}),
			brandId:tiviSony._id,
			categoryId:tiviSony.categoryId._id,
			images:'smart-tv-led-4k-hdr-sony-65-inch-kd-65x7000g-2019-i1.jpg',
			price:6490000,
			detail:'Trọng lượng: Không chân đế: 20.5 kg. Có chân đế: 21.6 kg. Kích thước màn hình',
		},{
			name: 'Smart Tivi Samsung 43 inch UA43N5500',
			slug: slug('Smart Tivi Samsung 43 inch UA43N5500',{lower:true}),
			brandId:tiviSamSung._id,
			categoryId:tiviSamSung.categoryId._id,
			images:'tivi-samsung-ua43n5500-i1.jpg',
			price:9090000,
			detail:'Loại Tivi:Smart Tivi. Kích cỡ màn hình:43 inch. Độ phân giải:Full HD. Kết nối: Kết nối Internet:Cổng LAN, Wifi',
		},{
			name: 'Smart Tivi Samsung 32 inch UA32N4300',
			slug: slug('Smart Tivi Samsung 32 inch UA32N4300',{lower:true}),
			brandId:tiviSamSung._id,
			categoryId:tiviSamSung.categoryId._id,
			images:'tivi-samsung-ua32n4300-i1.jpg',
			price:5890000,
			detail:'Loại Tivi:Smart Tivi. Kích cỡ màn hình:32 inch. Độ phân giải:HD. Kết nối Internet:Cổng LAN, Wifi',
		},{
			name: 'Smart Tivi Samsung 4K 55 inch UA55RU7200',
			slug: slug('Smart Tivi Samsung 4K 55 inch UA55RU7200',{lower:true}),
			brandId:tiviSamSung._id,
			categoryId:tiviSamSung.categoryId._id,
			images:'samsung-ua55ru7200-i1.jpg',
			price:16990000,
			detail:'Loại tivi:Smart Tivi, 55 inch. Độ phân giải:Ultra HD 4K. Hệ điều hành:Tizen OS',
		},{
			name: 'iPad Pro 11 inch Wifi 64GB (2018)',
			slug: slug('iPad Pro 11 inch Wifi 64GB (2018)',{lower:true}),
			brandId:tabletApple._id,
			categoryId:tabletApple.categoryId._id,
			images:'ipad-pro-11-inch-2018-64gb-wifi-i1.png',
			price:21990000,
			detail:'Màn hình	Liquid Retina, 11". Hệ điều hành	iOS 12. CPU	Apple A12X Bionic 64-bit',
		},{
			name: 'iPad 10.2 inch Wifi Cellular 128GB (2019)',
			slug: slug('iPad 10.2 inch Wifi Cellular 128GB (2019)',{lower:true}),
			brandId:tabletApple._id,
			categoryId:tabletApple.categoryId._id,
			images:'ipad-10-2-inch-wifi-cellular-128gb-2019-i1.png',
			price:14990000,
			detail:'Màn hình	LED backlit LCD, 10.2". Hệ điều hành	iOS 13. CPU	Apple A10 Fusion, 2.34 GHz',
		},{
			name: 'iPad Mini 7.9 inch Wifi 64GB (2019)',
			slug: slug('iPad Mini 7.9 inch Wifi 64GB (2019)',{lower:true}),
			brandId:tabletApple._id,
			categoryId:tabletApple.categoryId._id,
			images:'ipad-mini-79-inch-wifi-2019-i1.png',
			price:10990000,
			detail:'Màn hình	LED backlit LCD, 7.9". Hệ điều hành	iOS 12. CPU	Apple A12 Bionic 6 nhân, 2 nhân 2.5 GHz Vortex & 4 nhân 1.6 GHz Tempest',
		}];

		productModel.insertMany(arr, function(error, docs) {
			if(error){
				console.log(error);
				return res.send('503');
			}
			else{
				return res.send('200 OK');
			}

		});
	}
});

module.exports = router;