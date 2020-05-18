const cartProducts = document.querySelector('.cartProducts');
const bodyVar = document.querySelector('body');
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

const CreateAndFillTile = function(obj, targetLocation = bodyVar){
	let newTile = document.createElement('div');
	let newNameHolder = document.createElement('div');
	let newPriceHolder = document.createElement('div');
	
	newTile.style.backgroundImage = `url(${obj.image.small})`;

	newPriceHolder.textContent = `Price: ${obj.price} BGN`;
	newNameHolder.textContent = obj.name;

	newTile.classList.add('product');
	newNameHolder.classList.add('product-title');
	newPriceHolder.classList.add('product-title');

	newTile.appendChild(newNameHolder);
	newTile.appendChild(newPriceHolder);
	targetLocation.appendChild(newTile);

	newTile.objPointer = JSON.parse(JSON.stringify(obj));
	newTile.dataset.afterContent = '0';
	if(targetLocation !== bodyVar){
		newTile.classList.add('inCart'); //Allows increment/decrement, depending on where you're clicking on it.
		cartObjStorage.push(newTile);

	}else{
			newTile.classList.add('inStore');
			storeObjStorage.push(newTile);	//When loading initial tiles, it adds the divs to an array.
	}
	newTile.addEventListener('click', ShoppingCartInteractionHandler); //To change to event delegation.
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