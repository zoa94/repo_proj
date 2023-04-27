let cart = [];
let modalQt = 1;
let modalKey = 0;

const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);
// Listagem do menu 
cardapioJson.map((item,index)=>{
  let cardapioItem = c('.models .cardapio-item').cloneNode(true);
  
  cardapioItem.setAttribute('data-key', index);
  cardapioItem.querySelector('.cardapio-item--img img').src = item.img;
  cardapioItem.querySelector('.cardapio-item--price').innerHTML = `R$${item.price.toFixed(2)}`;
  cardapioItem.querySelector('.cardapio-item--name').innerHTML = item.name;
  cardapioItem.querySelector('.cardapio-item--desc').innerHTML = item.description;
  cardapioItem.querySelector('a').addEventListener('click',(e)=>{
    e.preventDefault();
    let key = e.target.closest('.cardapio-item').getAttribute('data-key');
    modalQt = 1;
    modalKey = key;

    c('.cardapioBig img').src = cardapioJson[key].img;
    c('.cardapioInfo h1').innerHTML = cardapioJson[key].name;
    c('.cardapioInfo--desc').innerHTML = cardapioJson[key].description;
    c('.cardapioInfo--actualPrice').innerHTML = `R$${cardapioJson[key].price.toFixed(2)}`;
    c('.cardapioInfo--size.selected').classList.remove('selected')
    cs('.cardapioInfo--size').forEach((size,sizeIndex)=>{
      if(sizeIndex == 2){
        size.classList.add('selected');
      }
      size.querySelector('span').innerHTML = cardapioJson[key].sizes[sizeIndex];
    });

    c('.cardapioInfo--qt').innerHTML = modalQt;

    c('.cardapioWindowArea').style.opacity = 0;
    c('.cardapioWindowArea').style.display = 'flex';
    setTimeout(()=>{
      c('.cardapioWindowArea').style.opacity = 1;
    },200)
  });

  c('.cardapio-area').append(cardapioItem);
});

//Eventos modal

function closeModal(){
  c('.cardapioWindowArea').style.opacity = 0;
  setTimeout(()=>{
    c('.cardapioWindowArea').style.display = 'none';
  },500);
}

cs('.cardapioInfo--cancelButton,.cardapioInfo--cancelMobileButton').forEach((item)=>{
  item.addEventListener('click',closeModal);
});

c('.cardapioInfo--qtmenos').addEventListener('click',()=>{
  if (modalQt > 1){
    modalQt--;
    c('.cardapioInfo--qt').innerHTML = modalQt;
  }
});

c('.cardapioInfo--qtmais').addEventListener('click',()=>{
  modalQt++;
  c('.cardapioInfo--qt').innerHTML = modalQt;
});
cs('.cardapioInfo--size').forEach((size,sizeIndex)=>{
  size.addEventListener('click',(e)=>{
    c('.cardapioInfo--size.selected').classList.remove('selected');
    size.classList.add('selected');
  })
});
c('.cardapioInfo--addButton').addEventListener('click',()=>{
  let size = parseInt(c('.cardapioInfo--size.selected').getAttribute('date-key'));
  
  let identifier = cardapioJson[modalKey].id+'@'+size;
  
  let key = cart.findIndex((item)=>item.identifier == identifier);
  if(key > -1){
    cart[key].qt += modalQt;
  }else{
    cart.push({
      identifier,
      id:cardapioJson[modalKey].id,
      size,
      qt:modalQt
    });
  }
  updateCart()
  closeModal();
});

c('.menu-openner').addEventListener('click',()=>{
  if(cart.length>0){
    c('aside').style.left = '0';
  }
})

c('.menu-closer').addEventListener('click',()=>{
  c('aside').style.left = '100vw';
})

function updateCart(){
  c('.menu-openner span').innerHTML = cart.length;
  
  if(cart.length > 0){
    c('aside').classList.add('show')
    c('.cart').innerHTML = '';
    
    let subtotal = 0;
    let desconto = 0;
    let total = 0;

    for( let i in cart){
      let cardapioItem = cardapioJson.find((item)=>item.id == cart[i].id)
      subtotal+= cardapioItem.price * cart[i].qt;
      
      let cartItem = c('.models .cart--item').cloneNode(true);
      let cardapioSizeName;
      switch(cart[i].size) {
        case 0:
          cardapioSizeName = 'P';
          break;
        case 1:
          cardapioSizeName = 'M';
          break;
        case 2:
          cardapioSizeName = 'G';
          break;
      }

      let cardapioName = `${cardapioItem.name} (${cardapioSizeName})`;

      cartItem.querySelector('img').src = cardapioItem.img;
      cartItem.querySelector('.cart--item-nome').innerHTML = cardapioName;
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
      cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
        if(cart[i].qt>1){
          cart[i].qt--;
        }else{
          cart.splice(i,1);
        }
        updateCart();
      });
      cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
        cart[i].qt++;
        updateCart();
      });
      
      c('.cart').append(cartItem);
    }

    desconto = subtotal * 0.1;
    total = subtotal - desconto;

    c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
    c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
    c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

  }else {
    c('aside').classList.remove('show');
    c('aside').style.left = '100vw';
  }
}