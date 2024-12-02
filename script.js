// Referências para manipulação
const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

// Abrir o carrinho ao clicar no botão
cartBtn.addEventListener("click", function () {
    cartModal.classList.remove("hidden"); // Remove 'hidden' para mostrar o modal
    cartModal.classList.add("flex"); // Adiciona 'flex' para centralizar
});

// Fechar o carrinho ao clicar fora dele
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.classList.add("hidden"); // Adiciona 'hidden' para esconder
        cartModal.classList.remove("flex"); // Remove 'flex'
    }
});

// Fechar ao clicar no botão "Fechar"
closeModalBtn.addEventListener("click", function () {
    cartModal.classList.add("hidden"); // Adiciona 'hidden' para esconder
    cartModal.classList.remove("flex"); // Remove 'flex'
});

// Adicionar ao carrinho ao clicar no botão
menu.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn");

    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        addToCart(name, price);
    }
});

// Função para adicionar itens ao carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;

    } else {

        cart.push({
            name,
            price,
            quantity: 1,
        });
    }

    updateCartModal() // Atualizar o modal do carrinho
}

// Atualizar o conteúdo do modal do carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = ""; // Limpar conteúdo anterior
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");

        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>QTD: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>

                
                    <button class="remove-from-cart-btn bg-red-500 text-white px-2 py-1 rounded" data-name="${item.name}">
                        Remover
                    </button>
                
            </div>
        `

        total += item.price * item.quantity;
        cartItemsContainer.appendChild(cartItemElement)

    });

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    cartCounter.innerHTML = cart.length; // Atualiza contador
}

// Remover itens do carrinho
cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name");
        removeFromCart(name);
    }
});

function removeFromCart(name) {
    const itemIndex = cart.findIndex(item => item.name === name);

    if (itemIndex !== -1) {
        const item = cart[itemIndex];

        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart.splice(itemIndex, 1);
        }

        updateCartModal(); // Atualiza modal após remoção
    }
}

// Validar endereço
addressInput.addEventListener("input", function () {
    if (addressInput.value.trim() !== "") {
        addressInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden");
    }
});

// Finalizar compra
checkoutBtn.addEventListener("click", function(){
    const isOpen = checkRestauranteOpen();
    if (!isOpen){

        //Aviso na tela com toastify.js
        Toastify({
            text: "O restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
        }).showToast();
     
    
    return;
    }


    if (cart.length === 0) return;
    if (addressInput.value.trim() === "") {
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;

    }
    

    //Enviar pedido para API do whats
    const cartItems = cart.map((item) => {
    return(
            ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("")
    const message =  encodeURIComponent(cartItems)
    const phone = "41996621226"

    window.open(`https://wa.me/${phone}?text=${message} Endereço:${addressInput.value}`, "_blank")
    alert("Pedido finalizado com sucesso!");
    cart = []; // Limpa o carrinho
    updateCartModal(); // Atualiza modal
    cartModal.style.display = "none"; // Fecha modal

})


// Função para verificar horário do restaurante
function checkRestauranteOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 16 && hora < 24;
}

const spanItem = document.getElementById("date-span");
if (checkRestauranteOpen()) {
    spanItem.classList.add("bg-green-600");
    spanItem.classList.remove("bg-red-500");
} else {
    spanItem.classList.add("bg-red-500");
    spanItem.classList.remove("bg-green-600");
}





