var mongoose = require('mongoose');
// var mongoosePaginate = require('mongoose-paginate-v2');
var categorySchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	slug:{
		type:String,
		required:true
	},
	status:{
		type: Boolean,
		required:true,
		default:true
	},
	isAccessories:{
		type: Boolean,
		required:true,
		default:false
	},
	created: { 
		type: Date,
		default: Date.now
	}
},{collection:'categories'});
categorySchema.virtual('products', {
	ref: 'Product',
	localField: '_id',
	foreignField: 'categoryId',
});

categorySchema.virtual('brands', {
	ref: 'Brand',
	localField: '_id',
	foreignField: 'categoryId',
});

categorySchema.virtual('numProducts', {
	ref: 'Product',
	localField: '_id',
	foreignField: 'categoryId',
	count:true,
});

// categorySchema.plugin(mongoosePaginate);

categorySchema.set('toObject', { virtuals: true });
// categorySchema.set('toJSON', { virtuals: true });

categorySchema.statics.getNewProduct= async function(){
	try{
		var result = await this.aggregate([{
			$match: {
				isAccessories: false,
				status:true,
			}
		},
		{
			$sort: {
				created: 1,
			}
		},
		{
			$lookup: {
				from: "products",
				as: "products",
				let: { indicator_id: '$_id' },
				pipeline: [
				{ 
					$match: {
						'status':true,
						$expr: { $eq: [ '$categoryId', '$$indicator_id' ]}
					}
				},
				{ $limit: 4 }
				]
			}
		},
		]).exec();
		return {error:false,data:result};
	}catch{
		console.log(err);
		return {error:true,message:err};
	}
}

categorySchema.statics.paginateFilterProducts= async function(category,sort,eqs,page){
	try{
		var countProduct = await this.findOne({slug:category,status:true}).populate({path:'numProducts',match:eqs}).exec();
		if(countProduct==null){
			return {error:false,data:null};
		}
		else{
			let count=countProduct.numProducts;
			var products = await this.findOne({slug:category,status:true}).populate({path:'products',match:eqs,options:{skip:9*(page-1),limit:9,sort:sort}}).populate('brands').exec();
			return {error:false,data:products,total:count};
		}
	}catch(err){
		console.log(err);
		return {error:true,message:err};
	}

}
categorySchema.statics.countCategory = async function(findObj){
	try{
		let result = await this.countDocuments(findObj).exec();
		return {error:false,count:result};
	}catch(err){
		console.log(err);
		return {error:true,message:err};
	}
}

categorySchema.statics.listCategory = async function(findObj,page,pageSize,sort){
	try{
		let result = await this.find(findObj).skip((page-1)*pageSize).limit(pageSize).populate('numProducts').sort(sort).exec();
		return {error:false,data:result};

	}catch(err){
		console.log(err);
		return {error:true,message:err};
	}
}

categorySchema.statics.all = async function(){
	try{
		let result = await this.find({}).sort({created:1}).exec();
		return {error:false,data:result};

	}catch(err){
		console.log(err);
		return {error:true,message:err};
	}
}

var Category = mongoose.model('Category', categorySchema);

module.exports = Category;