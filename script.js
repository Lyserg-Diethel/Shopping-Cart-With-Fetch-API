const cartProducts = document.querySelector('.cartProducts');
const bodyProducts = document.querySelector('.buy-now');
const totalSumSpan = document.querySelector('.totalSumSpan');
const totalSumTaxSpan = document.querySelector('.totalSumTax');
let localJsonStorage;
let cartObjStorage = [];
let storeObjStorage = [];

fetch("https://raw.githubusercontent.com/ProgressBG-WWW-Courses/JavaScript-Advanced/gh-pages/downloads/products.json")
.then(function(response) {
	return response.text();
})
.then(function(retRespText){
	localJsonStorage = JSON.parse(retRespText);
	populateStore(localJsonStorage);
})

const populateStore = function(localJsonStorage){
	for(obj of localJsonStorage){
		CreateAndFillTile(obj);
	}
}

const CreateAndFillTile = function(obj, targetLocation = bodyProducts){
	let fillerTile = document.createElement('div');
	let productTile = document.createElement('div'); //So they can later be displaeyd under the product tile.
	let newNameHolder = document.createElement('div');
	let newPriceHolder = document.createElement('div');
	
	productTile.style.backgroundImage = `url(${obj.image.small})`;

	newPriceHolder.textContent = `Price: ${obj.price} lv.`;
	newNameHolder.textContent = obj.name;

	productTile.classList.add('product');
	newNameHolder.classList.add('product-title');
	newPriceHolder.classList.add('product-title');
	newPriceHolder.classList.add('displayUnder');
	fillerTile.classList.add('fillParent');

	productTile.appendChild(fillerTile);
	productTile.appendChild(newNameHolder);
	productTile.appendChild(newPriceHolder);
	
	targetLocation.appendChild(productTile);

	productTile.objPointer = JSON.parse(JSON.stringify(obj));
	productTile.dataset.afterContent = '0';
	if(targetLocation !== bodyProducts){
		productTile.classList.add('inCart'); //Allows increment/decrement, depending on where you're clicking on it.
		cartObjStorage.push(productTile);

	}else{
			productTile.classList.add('inStore');
			storeObjStorage.push(productTile);	//When loading initial tiles, it adds the divs to an array.
	}
	productTile.addEventListener('click', ShoppingCartInteractionHandler); //To change to event delegation.
}

const ShoppingCartInteractionHandler = function(){
	const productID = this.objPointer.id;
	/*TODO: CONSIDER SEPARATING THESE INTO SEPARARE FUNCTIONS TO IMPROVE CODE CLARITY.*/
	if(findItemInCart(productID)){	//change to target via the .inCart true or false property?
		if(this.classList.contains('inCart')){	//if you're clicking on the item in the cart.
			if((+this.dataset.afterContent - 1) >= 0){
				this.dataset.afterContent = +(this.dataset.afterContent) - 1;
				findItemInStore(this.objPointer.id).dataset.afterContent -= 1; //find it in store and decrement that object's ::after.
			}
			if((+this.dataset.afterContent) <= 0){
				cartProducts.removeChild(this);
				cartObjStorage.splice(cartObjStorage.indexOf(this), 1)
			}

		}else if(this.classList.contains('inStore')){
			this.dataset.afterContent = +(this.dataset.afterContent) + 1;
			findItemInCart(this.objPointer.id).dataset.afterContent = +findItemInCart(this.objPointer.id).dataset.afterContent +1;

		};

	}else{
		CreateAndFillTile(this.objPointer, cartProducts);

		this.dataset.afterContent = +(this.dataset.afterContent) + 1;
		findItemInCart(this.objPointer.id).dataset.afterContent = +findItemInCart(this.objPointer.id).dataset.afterContent +1;
	}
	calculateTotal();
}

const findItemInCart = function(id){
	for(let i=0; i<cartObjStorage.length; i+=1){

		if(cartObjStorage[i].objPointer.id === id){
			return cartObjStorage[i];
		}		
	}
	return false;
}
const findItemInStore = function(id){
	for(let i=0; i<storeObjStorage.length; i+=1){

		if(storeObjStorage[i].objPointer.id === id){
			return storeObjStorage[i];
		}		
	}
	return false;
}

//const addToCart = function(item){}
const calculateTotal = function(){
	let total = 0;
	for(let item of cartObjStorage){ 
		total += (item.objPointer.price * item.dataset.afterContent);
	}
	totalSumSpan.textContent = `Total price before VAT: ${total}`;
	totalSumTaxSpan.textContent = `Total price after VAT: ${(total * 1.2).toFixed(2)}`;
}
	;