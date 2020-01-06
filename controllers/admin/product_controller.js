var express = require('express');
const productModel = require('../../models/product');
const categoryModel = require('../../models/category');
const brandModel = require('../../models/brand');
var slug = require('slug');
var fs = require('fs');

var MAX_PAGE_SIZE = 10
exports.listProduct = async function (req, res, next) {

	let page = 1, pageSize = MAX_PAGE_SIZE, brandList = null, findObj = {};
	let categoryList = await categoryModel.all();
	if (categoryList.error) {
		return res.render('./admin/404');
	}
	else {
		categoryList = categoryList.data;
	}
	let query = req.query;
	let url = req.baseUrl + req.path + '?';
	if (query.page) {
		page = parseInt(req.query.page);
		delete query.page;
	}
	if (query.categoryId) {
		url = url + '&categoryId=' + query.categoryId;
		findObj.categoryId = query.categoryId;
		brandList = await brandModel.getBrandsByCategory(query.categoryId);
		if (brandList.error) {
			return res.render('./admin/404');
		}
		else {
			brandList = brandList.data;
		}
	}
	if (query.brandId) {
		url = url + '&brandId=' + query.brandId;
		findObj.brandId = query.brandId;
	}
	if (query.status) {
		url = url + '&status=' + query.status;
		findObj.status = query.status;
	}
	if (query.q != null) {
		url = url + '&q=' + query.q;
		findObj.name = { '$regex': query.q, '$options': 'i' };
	}
	let sort = { created: -1 };
	if (query.sort != null) {
		url = url + '&sort=' + query.sort;
		if (query.sort == 'name') {
			sort = { slug: 1 };
		}
		else if (query.sort == 'price') {
			sort = { price: -1 };
		}
		else if (query.sort == 'qty') {
			sort = { quantity: -1 };
		}
		else if (query.sort == 'discount') {
			sort = { discount: -1 };
		}
		else if (query.sort == 'sold') {
			sort = { numberOfProductSold: -1 };
		}
		else if (query.sort == 'view') {
			sort = { view: -1 };
		}
		else if (query.sort == 'status') {
			sort = { status: -1 };
		}
		else {
			sort = { created: -1 };
		}
	}
	let rsCount = await productModel.countProduct(findObj);
	if (rsCount.error) {
		return res.send({ error: true, messsage: 'server error' });
	}
	else {
		if (Object.keys(query).length > 0) {
			url = url + '&page=';
		}
		else {
			url = url + 'page=';
		}
		let count = rsCount.count;
		let rsList = await productModel.listProduct(findObj, page, pageSize, sort);
		if (rsList.error) {
			return res.send({ error: true, messsage: 'server error' });
		}
		else {
			let pagination = { totalPage: parseInt(count / pageSize) + 1, curPage: page, totalItem: count, url: url };
			return res.render('./admin/product-list', { products: rsList.data, pagination: pagination, categoryList: categoryList, brandList: brandList, query: query });
		}
	}
}

exports.addProductPage = async function (req, res, next) {
	let page = 1, pageSize = MAX_PAGE_SIZE, findObj = {};
	let sort = { created: -1 };
	let categoryList = await categoryModel.listCategory(findObj, page, pageSize, sort);
	if (categoryList.error) {
		return res.send({ error: true, messsage: 'server error' });
	}
	else {
		let item = req.flash('item')[0] || {};
		var categoryId = item.categoryId;
		let brandList = [];
		if (categoryId) {
			let page = 1, pageSize = MAX_PAGE_SIZE, findObj = { categoryId: categoryId };
			let sort = { created: -1 };
			let rs = await brandModel.listBrand(findObj, page, pageSize, sort);
			if (!rs.error) {
				brandList = rs.data;
			}
		}
		let errorItem = req.flash('error_messsage')[0] || {};
		return res.render('./admin/product-add', { categoriesSelect: categoryList.data, brandsSelect: brandList, data: item, dataError: errorItem });
	}
}

exports.createProduct = async function (req, res, next) {
	var errorItem = {};
	var checkInput = true;
	var item = {
		images: null,
	};
	let type;
	item.images = [];
	let now = (new Date()).getTime(), streamTimes = 0;
	if (req.busboy) {
		req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
			if (streamTimes == 0) {

				type = mimetype;
				if (filename == "") {
					checkInput = false;
					errorItem.msg_noImg = "Bạn chưa chọn ảnh cho sản phẩm";
					file.resume();
				}
				else if (mimetype !== 'image/png' && mimetype !== 'image/jpg' && mimetype !== 'image/jpeg') {
					checkInput = false;
					errorItem.msg_noImg = "Hình ảnh không hợp lệ";
					file.resume();
				}
			}
			if (errorItem.msg_noImg == null) {
				if (streamTimes == 0 && filename) {
					item.images[0] = now + filename;
				}
				streamTimes++;
				fstream = fs.createWriteStream(process.cwd() + '/public/images/products/' + item.images[0]);
				file.pipe(fstream);
				fstream.on('close', function () {
					console.log("Upload Finished of " + item.images[0]);;
					if (checkInput == false) {
						fs.unlink(process.cwd() + '/public/images/products/' + item.images[0], function (err) {
							if (err) {
								//ignore error 
								console.log(err);
							};
						});
					}
				});
			}

		});
		req.busboy.on('field', async function (key, value, keyTruncated, valueTruncated) {
			if (key == 'name') {
				item.name = value;
			}
			else if (key == 'quantity') {
				item.quantity = value;
			}
			else if (key == 'price') {
				item.price = value;
			}
			else if (key == 'radioStatus') {
				if (value == "Open") item.status = true;
				else item.status = false;
			}
			else if (key == 'categorySelect') {
				item.categoryId = value;
			}
			else if (key == 'brandSelect') {
				item.brandId = value;
			}
			else if (key == 'detail') {
				item.detail = value;
			}
			else if (key == 'discount') {
				item.discount = parseInt(value);
				if (item.discount < 0) {
					item.discount = 0;
				}
				else if (item.discount > 100) {
					item.discount = 100;
				}
			}


		});

		req.busboy.on('finish', async function () {
			if (item.name == null || item.name == "") item.slug = "";
			else item.slug = slug(item.name, { lower: true });
			if (item.categoryId == undefined) {
				checkInput = false;
				errorItem.msg_noCategory = 'Bạn chưa chọn gian hàng';
			}
			if (item.brandId == undefined) {
				checkInput = false;
				errorItem.msg_noBrand = 'Bạn chưa chọn hãng';
			}
			var checkSlug = await productModel.findOne({ slug: item.slug }).exec();

			if (item.name == "") {
				checkInput = false;
				errorItem.msg_noName = 'Bạn chưa nhập tên sản phẩm';
			} else if (checkSlug != null) {
				checkInput = false;
				errorItem.msg_noName = 'Tên sản phẩm bị trùng';
			}
			if (item.price == "" || item.price == null) {
				checkInput = false;
				errorItem.msg_noPrice = 'Bạn chưa nhập giá sản phẩm';
			}
			else {
				item.price = parseInt(item.price);
				if (item.price < 0) {
					item.price = 0;
				}
			}
			if (item.detail == "" || item.detail == null) {
				checkInput = false;
				errorItem.msg_noDetail = 'Bạn chưa nhập mô tả sản phẩm';
			}
			if (item.quantity == "" || item.quantity == null) {
				checkInput = false;
				errorItem.msg_noQuantity = 'Bạn chưa nhập số lượng sản phẩm';
			}
			else {
				item.quantity = parseInt(item.quantity);
				if (item.quantity < 0) {
					item.quantity = 0;
				}
			}
			if (checkInput == false) {
				if (item.images.length > 0) {
					fs.unlink(process.cwd() + '/public/images/products/' + item.images[0], function (err) {
						if (err) {
							//ignore error 
							console.log(err)
						};
					});
				}
				req.flash('error_messsage', errorItem);
				req.flash('item', item);
				return res.redirect('/admin/san-pham/them');
			}
			else {
				type = '.' + type.substring(6);
				let oldname = item.images[0];
				let newname = item.slug + type;
				fs.rename(process.cwd() + '/public/images/products/' + oldname, process.cwd() + '/public/images/products/' + newname, function (err) {
					if (err) {
						//ignore error 
						console.log(err)
					};
				});
				item.images[0] = newname;
				var data = new productModel(item);
				data.save();
				return res.redirect('/admin/san-pham/danh-sach');
			}
		});

		req.pipe(req.busboy);
	}
	else {
		return res.redirect('/admin/san-pham/danh-sach');
	}
}

exports.changeProductStatus = async function (req, res, next) {

}

exports.updateQuantity = async function (req, res, next) {

}

exports.editProductPage = async function (req, res, next) {
	let page = 1, pageSize = MAX_PAGE_SIZE, findObj = {};
	let sort = { created: -1 };
	let categoryList = await categoryModel.listCategory(findObj, page, pageSize, sort);
	if (categoryList.error) {
		return res.send({ error: true, messsage: 'server error' });
	}
	else {
		let item = req.flash('item')[0] || null;
		let errorItem = req.flash('error_messsage')[0] || {};
		if (item == null) { // from edit in /danh sach
			var id = req.params.id;
			let updateItem = await productModel.findOne({ _id: id }).exec();
			console.log(updateItem);
			var categoryId = updateItem.categoryId;
			let page = 1, pageSize = MAX_PAGE_SIZE, findObj = { categoryId: categoryId };
			let sort = { created: -1 };
			let brandList = await brandModel.listBrand(findObj, page, pageSize, sort);

			res.render('./admin/product-edit', { categoriesSelect: categoryList.data, brandsSelect: brandList.data, data: updateItem, dataError: errorItem });
		}
		else { // load lai vi nhap loi	
			var categoryId = item.categoryId;
			let page = 1, pageSize = MAX_PAGE_SIZE, findObj = { categoryId: categoryId };
			let sort = { created: -1 };
			let brandList = await brandModel.listBrand(findObj, page, pageSize, sort);

			res.render('./admin/product-edit', { categoriesSelect: categoryList.data, brandsSelect: brandList.data, data: item, dataError: errorItem });
		}

	}
}


exports.updateProduct = async function (req, res, next) {
	var item = {};
	var errorItem = {};
	var oldSlug;
	var checkInput = true;
	let type;
	item.images = [];
	let now = (new Date()).getTime(), streamTimes = 0;
	if (req.busboy) {
		req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
			type = mimetype;

			if (filename == "" || streamTimes == 0) {
				file.resume();
			}

			if (filename != null) {
				if (streamTimes == 0 && filename) {
					item.images[0] = now + filename;
				}
				streamTimes++;
				fstream = fs.createWriteStream(process.cwd() + '/public/images/products/' + item.images[0]);
				file.pipe(fstream);
				fstream.on('close', function () {
					console.log("Upload Finished of " + item.images[0]);;
					if (checkInput == false) {
						fs.unlink(process.cwd() + '/public/images/products/' + item.images[0], function (err) {
							if (err) {
								//ignore error 
								console.log(err);
							};
						});
					}
				});
			}

		});
		req.busboy.on('field', async function (key, value, keyTruncated, valueTruncated) {
			if (key == '_id') {
				item._id = value;
			}
			else if (key == 'name') {
				item.name = value;
			}
			else if (key == 'quantity') {
				item.quantity = value;
			}
			else if (key == 'price') {
				item.price = value;
			}
			else if (key == 'radioStatus') {
				if (value == "Open") item.status = true;
				else item.status = false;
			}
			else if (key == 'categorySelect') {
				item.categoryId = value;
			}
			else if (key == 'brandSelect') {
				item.brandId = value;
			}
			else if (key == 'detail') {
				item.detail = value;
			}
			else if (key == 'discount') {
				item.discount = parseInt(value);
				if (item.discount < 0) {
					item.discount = 0;
				}
				else if (item.discount > 100) {
					item.discount = 100;
				}
			}
			if (item.name == null || item.name == "") item.slug = "";
			else item.slug = slug(item.name, { lower: true });

		});

		req.busboy.on('finish', async function () {
			let findObj = await productModel.findOne({ _id: item._id }).exec();
			oldSlug = findObj.slug;
			var oldImgName = findObj.images[0];
			findObj.name = item.name;
			findObj.slug = item.slug;
			findObj.categoryId = item.categoryId;
			findObj.brandId = item.brandId;
			findObj.price = item.price;
			findObj.detail = item.detail;
			findObj.quantity = item.quantity;
			findObj.discount = item.discount;
			findObj.status = item.status;
			if (item.images[0] != null) {
				findObj.images = Array.from(item.images);
			}

			if (item.categoryId == undefined) {
				checkInput = false;
				errorItem.msg_noCategory = 'Bạn chưa chọn gian hàng';
			}
			if (item.brandId == undefined) {
				checkInput = false;
				errorItem.msg_noBrand = 'Bạn chưa chọn hãng';
			}
			var checkSlug = await productModel.findOne({ slug: item.slug }).exec();

			if (item.name == "") {
				checkInput = false;
				errorItem.msg_noName = 'Bạn chưa nhập tên sản phẩm';
			} else if (item.slug != oldSlug && checkSlug != null) {
				checkInput = false;
				errorItem.msg_noName = 'Tên sản phẩm bị trùng';
			}
			if (item.price == "" || item.price == null) {
				checkInput = false;
				errorItem.msg_noPrice = 'Bạn chưa nhập giá sản phẩm';
			}
			else {
				item.price = parseInt(item.price);
				if (item.price < 0) {
					item.price = 0;
				}
			}
			if (item.detail == "" || item.detail == null) {
				checkInput = false;
				errorItem.msg_noDetail = 'Bạn chưa nhập mô tả sản phẩm';
			}
			if (item.quantity == "" || item.quantity == null) {
				checkInput = false;
				errorItem.msg_noQuantity = 'Bạn chưa nhập số lượng sản phẩm';
			}
			else {
				item.quantity = parseInt(item.quantity);
				if (item.quantity < 0) {
					item.quantity = 0;
				}
			}

			if (checkInput == false) {
				if (item.images.length > 0) {
					fs.unlink(process.cwd() + '/public/images/products/' + item.images[0], function (err) {
						if (err) {
							//ignore error 
							console.log(err)
						};
					});
				}
				req.flash('error_messsage', errorItem);
				req.flash('item', findObj);

				return res.redirect('/admin/san-pham/sua/' + item._id);
			}
			else {
				type = '.' + type.substring(6);
				let oldname = item.images[0];
				let newname = item.slug + type;
				fs.rename(process.cwd() + '/public/images/products/' + oldname, process.cwd() + '/public/images/products/' + newname, function (err) {
					if (err) {
						//ignore error 
						console.log(err)
					};
				});
				findObj.images[0] = newname;
				findObj.save();
				if (oldSlug != findObj.slug)
					fs.unlinkSync(process.cwd() + '/public/images/products/' + oldImgName + type);
				return res.redirect('/admin/san-pham/danh-sach');
			}
		});

		req.pipe(req.busboy);
	}
	else {
		return res.redirect('/admin/san-pham/danh-sach');
	}
}


exports.ajaxBrandOfCategory = async function (req, res, next) {
	var id = req.params.id;
	let page = 1, pageSize = MAX_PAGE_SIZE, findObj = { categoryId: id };
	let sort = { created: -1 };
	let brandList = await brandModel.listBrand(findObj, page, pageSize, sort);
	if (brandList.error) {
		return res.send({ error: true, messsage: 'server error' });
	}
	else {
		return res.send(brandList.data);
	}
}

exports.changeProductStatus = async function (req, res, next) {
	let status = req.body.status;
	let id = req.body.id;
	if (status == null || id == null) {
		return res.send({ error: true, messsage: 'invalid params' });
	}

	let result = await productModel.changeProductStatus(id, status);
	if (result.error) {
		return res.send({ error: true, messsage: 'server error' });
	}
	return res.send({ error: false, messsage: 'successfull' });

}


exports.updateProductQuantity = async function (req, res, next) {
	let quantity = req.body.quantity;
	let id = req.body.id;
	if (quantity == null || id == null) {
		return res.send({ error: true, messsage: 'invalid params' });
	}

	let result = await productModel.updateProductQuantity(id, quantity);
	if (result.error) {
		return res.send({ error: true, messsage: 'server error' });
	}
	return res.send({ error: false, messsage: 'successfull' });

}

exports.updateProductPrice = async function (req, res, next) {
	let price = req.body.price;
	let id = req.body.id;
	if (price == null || id == null) {
		return res.send({ error: true, messsage: 'invalid params' });
	}

	let result = await productModel.updateProductPrice(id, price);
	if (result.error) {
		return res.send({ error: true, messsage: 'server error' });
	}
	return res.send({ error: false, messsage: 'successfull' });

}

exports.updateProductDiscount = async function (req, res, next) {
	let discount = req.body.discount;
	let id = req.body.id;
	if (discount == null || id == null) {
		return res.send({ error: true, messsage: 'invalid params' });
	}

	let result = await productModel.updateProductDiscount(id, discount);
	if (result.error) {
		return res.send({ error: true, messsage: 'server error' });
	}
	return res.send({ error: false, messsage: 'successfull' });

}

exports.deleteProduct = async function (req, res, next) {
	let id = req.body.id;
	if (id == null) {
		return res.send({ error: true, messsage: 'invalid params' });
	}

	let result = await productModel.removeProduct(id);
	if (result.error) {
		return res.send({ error: true, messsage: 'server error' });
	}
	return res.send({ error: false, messsage: 'successfull' });

}

