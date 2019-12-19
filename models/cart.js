module.exports = function Cart(oldCart){
	this.items = oldCart.items||{};
	this.totalPrice = oldCart.totalPrice||0;
	this.totalItem = oldCart.totalItem||0;
	this.addItem = function(itemAdd,id){
		let storedItem = this.items[id];
		if(!storedItem){
			storedItem = this.items[id] = {
				item:{
					id:itemAdd.id,
					name:itemAdd.name,
					price:itemAdd.price,
					images:itemAdd.images,
					discount:itemAdd.discount,
					link:'/'+ itemAdd.categoryId.slug + '/' + itemAdd.slug
				},
				price:0,
				qty:0
			};
			this.totalItem++;
		}
		storedItem.qty++;
		storedItem.price = parseInt((storedItem.item.price*(100 - storedItem.item.discount)/100))*storedItem.qty;
		this.totalPrice += parseInt((storedItem.item.price*(100 - storedItem.item.discount)/100));
		return storedItem;
	}

	this.toArray = function(){
		var arr = [];
		for(var id in this.items){
			arr.push(this.items[id]);
		}
		return arr;
	}

	this.removeItem = function(id){
		let storedItem = this.items[id];
		if(storedItem){
			this.totalPrice -= parseInt((storedItem.item.price*(100 - storedItem.item.discount)/100))*storedItem.qty;
			delete this.items[id];
			this.totalItem--;
		}
	}

	this.clear = function(){
		this.items = {};
		this.totalPrice = 0;
		this.totalItem=0;
	}

	this.changeQty= function(id,amount){
		let storedItem = this.items[id];
		if(storedItem){
			if(amount==0){
				delete this.items[id];
				this.totalItem--;
			}
			else{
				storedItem.price = parseInt((storedItem.item.price*(100 - storedItem.item.discount)/100))*amount;
				this.totalPrice -= parseInt((storedItem.item.price*(100 - storedItem.item.discount)/100))*storedItem.qty;
				this.totalPrice += parseInt((storedItem.item.price*(100 - storedItem.item.discount)/100))*amount;
			}
			storedItem.qty = amount;
		}
	}

	this.update = function(deleteItems, updateItems){
		for(var key in deleteItems){
			this.removeItem(deleteItems[key]);
		}
		for(var id in updateItems){
			this.changeQty(id,updateItems[id]);
		}
	}
}