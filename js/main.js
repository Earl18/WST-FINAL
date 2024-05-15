//TOGGLE SEARCH BOX
let search = document.querySelector('.search-box');

document.querySelector('#search-icon').onclick = () => {
    search.classList.toggle('active');
    navbar.classList.remove('active');
}

//TOGGLE ADD TO CART
let navbar = document.querySelector('.navbar');

document.querySelector('#menu-icon').onclick = () => {
    navbar.classList.toggle('active');
    search.classList.remove('active');
}

//REMOVE WHEN SCROLLED
window.onscroll = () => {
    navbar.classList.remove('active');
    search.classList.remove('active');
    cart.classList.remove("active");
}

window.addEventListener('scroll', reveal);

//TRANSITION BETWEEN PAGES
function reveal(){
    let reveals = document.querySelectorAll('.reveal');

    for(let i = 0; i < reveals.length; i++){
        let windowheight = window.innerHeight;
        let revealtop = reveals[i].getBoundingClientRect().top;
        let revealpoint = 150;
    
        if(revealtop < windowheight - revealpoint){
            reveals[i].classList.add('active');
        }
        else {
            reveals[i].classList.remove('active');
        }
    }
}

//ADD TO CART
let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");

cartIcon.onclick = () => {
    cart.classList.add("active");
};

closeCart.onclick = () => {
    cart.classList.remove("active");
};

if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
}
else {
    ready();
}

function ready(){
    let removeCartButtons = document.getElementsByClassName('cart-remove');
    console.log(removeCartButtons);
    for (let i = 0; i < removeCartButtons.length; i++) {
        let button = removeCartButtons[i];
        button.addEventListener('click', removeCartItem);
    }
    let quantityInputs = document.getElementsByClassName("cart-quantity");
    for (let i = 0; i < quantityInputs.length; i++) {
        let input = quantityInputs[i];
        input.addEventListener("change", quantityChanged);
    }
    let addCart = document.getElementsByClassName("add-cart");
    for (let i = 0; i < addCart.length; i++) {
        let button = addCart[i];
        button.addEventListener("click", addCartClicked);
    }
    document.getElementsByClassName("btn-buy")[0].addEventListener("click", buyButtonClicked);
}

function buyButtonClicked() {
    alert("Your Order is placed");
    let cartContent = document.getElementsByClassName("cart-content")[0];
    while (cartContent.hasChildNodes()) {
        cartContent.removeChild(cartContent.firstChild);
    }
    updatetotal();
}

function removeCartItem(event){
    let buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updatetotal();
}

function quantityChanged(event) {
    let input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updatetotal();
}

function addProductToCart(title, price, productImg) {
    let cartItems = document.querySelector(".cart-content");
    let cartItemTitles = cartItems.querySelectorAll(".cart-product-title");

    for (let i = 0; i < cartItemTitles.length; i++) {
        if (cartItemTitles[i].innerText === title) {
            alert("You have already added this item to the cart");
            return;
        }
    }

    let cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cart-box");

    let cartBoxContent = `
        <img src="${productImg}" alt="" class="cart-img">
        <div class="details-box">
            <div class="cart-product-title">${title}</div>
            <div class="cart-price">${price}</div>
            <input type="number" value="1" class="cart-quantity">
        </div>
        <i class='bx bxs-trash-alt cart-remove'></i>`;
    cartShopBox.innerHTML = cartBoxContent;

    cartItems.appendChild(cartShopBox);

    cartShopBox.querySelector('.cart-remove').addEventListener('click', removeCartItem);
    cartShopBox.querySelector('.cart-quantity').addEventListener('change', quantityChanged);
}

function addCartClicked(event) {
    let button = event.target;
    let shopProducts = button.closest(".box");
    let title = shopProducts.querySelector(".product-title").innerText;
    let price = shopProducts.querySelector(".price").innerText;
    let productImg = shopProducts.querySelector(".product-img").src;
    addProductToCart(title, price, productImg);
    updatetotal();
    cart.classList.add("active");
}

//TOTAL
function updatetotal() {
    let cartContent = document.getElementsByClassName("cart-content")[0];
    let cartBoxes = cartContent.getElementsByClassName("cart-box");
    let total = 0;
    for (let i = 0; i < cartBoxes.length; i++) {
        let cartBox = cartBoxes[i];
        let priceElement = cartBox.getElementsByClassName("cart-price")[0];
        let quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
        let price = parseFloat(priceElement.innerText.replace("$", ""));
        let quantity = quantityElement.value;
        total = total + price * quantity;
    }
        total = Math.round(total * 100) / 100;

        document.getElementsByClassName("total-price")[0].innerText = "$" + total;
}

//SEARCH BAR
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('find');
    const searchResults = document.getElementById('searchResults');

    searchInput.addEventListener('input', searchlist);

    function searchlist() {
        let filter = searchInput.value.toUpperCase();

        searchResults.innerHTML = '';

        if (filter === '') {
            searchResults.classList.add('hidden');
            return;
        }

        fetch('product.html')
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const productHTMLDoc = parser.parseFromString(html, 'text/html');
                const items = productHTMLDoc.querySelectorAll('.box');
                const names = productHTMLDoc.getElementsByClassName('product-title');

                let FoundItems = 0;
                for (let i = 0; i < names.length; i++) {
                    let title = names[i];
                    let value = title.innerHTML || title.innerText || title.textContent;

                    if (value.toUpperCase().indexOf(filter) > -1) {
                        let li = document.createElement('li');
                        li.textContent = value;
                        li.addEventListener('click', function() {
                            searchInput.value = value;
                            searchResults.classList.add('hidden');

                            sessionStorage.setItem('itemToHighlight', items[i].id);

                            window.location.href = 'product.html';
                        });
                        searchResults.appendChild(li);
                        FoundItems++;
                    }
                }

                if (FoundItems > 0) {
                    searchResults.classList.remove('hidden');
                } else {
                    searchResults.classList.add('hidden');
                }
            })
            .catch(error => {
                console.error('Error fetching product.html:', error);
            });
    }
});
//SEARCH BAR HIGHLIGHT
window.addEventListener('DOMContentLoaded', function() {
    const itemToHighlightId = sessionStorage.getItem('itemToHighlight');
    if (itemToHighlightId) {
        const itemToHighlight = document.getElementById(itemToHighlightId);
        itemToHighlight.classList.add('highlight');
        itemToHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(() => {
            itemToHighlight.classList.remove('highlight');
        }, 5000);

        sessionStorage.removeItem('itemToHighlight');
    }
});

//NEWSLETTER
const scriptURL = 'https://script.google.com/macros/s/AKfycbyTfAb9rBdGCf2PUO_wGL1JTS5gitibYSr1MC0w0_mspqz9MMT4V6vzQT-R7W86n9QH/exec';
  const form = document.forms['submit-to-google-sheet'];
  const msg = document.getElementById("msg");

  form.addEventListener('submit', e => {
    e.preventDefault()
    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
      .then(response => {
        msg.innerHTML = "Thank You For Subscribing!";
        setTimeout(() => {
            msg.innerHTML = ""; // This will clear the message after 3 seconds
        }, 3000);
      })
      .catch(error => console.error('Error!', error.message))
  });

//Backup
/*
const scriptURL = 'https://script.google.com/macros/s/AKfycbyTfAb9rBdGCf2PUO_wGL1JTS5gitibYSr1MC0w0_mspqz9MMT4V6vzQT-R7W86n9QH/exec';
const form = document.forms['submit-to-google-sheet'];
const msg = document.getElementById("msg");

form.addEventListener('submit', e => {
    e.preventDefault();
    msg.innerHTML = "Thank You For Subscribing!"; // Moved outside fetch
    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
        .then(response => {
            setTimeout(() => {
                msg.innerHTML = ""; // This will clear the message after 3 seconds
            }, 1000);
        })
        .catch(error => console.error('Error!', error.message))
})
*/