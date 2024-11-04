let cart = [];
let cartCountElement = document.getElementById("cart-count");
let cartItemsElement = document.getElementById("cart-items");
let totalPrice = 0; // Общая стоимость

// Функция для обновления корзины
function updateCart() {
    cartCountElement.textContent = cart.length;
    cartItemsElement.innerHTML = "";
    totalPrice = 0; // Сбрасываем общую стоимость при каждом обновлении
    cart.forEach((item) => {
        const div = document.createElement("div");
        div.textContent = `${item.name} - ${item.price} сом`;
        cartItemsElement.appendChild(div);
        totalPrice += parseFloat(item.price);
    });
    cartItemsElement.innerHTML += `<p><strong>Итоговая стоимость: ${totalPrice} сом</strong></p>`;
}

// Обработчик для кнопки "Добавить в корзину"
document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
        const productElement = this.closest(".product");
        const productName = productElement.getAttribute("data-name");
        const productPrice = productElement.getAttribute("data-price");
        cart.push({ name: productName, price: productPrice });
        updateCart();
        alert("Товар добавлен в корзину!");
    });
});

// Функция для показа/скрытия корзины
function toggleCart() {
    const cartElement = document.getElementById("cart");
    cartElement.style.display = cartElement.style.display === "none" || cartElement.style.display === "" ? "block" : "none";
}

// Добавляем обработчик клика для ссылки "Корзина"
document.getElementById("cart-toggle").addEventListener("click", function(event) {
    event.preventDefault();
    toggleCart();
});

// Функция для открытия модального окна
function openModal() {
    document.getElementById("payment-modal").style.display = "flex";
}

// Функция для закрытия модального окна
function closeModal() {
    document.getElementById("payment-modal").style.display = "none";
    document.getElementById("payment-fields").style.display = "none"; 
}

// Обработчик для кнопки "Купить"
document.getElementById("checkout-button").addEventListener("click", function () {
    if (cart.length === 0) {
        alert("Корзина пуста!");
    } else {
        openModal();
    }
});

let selectedPaymentMethod = "";

// Функция для выбора метода оплаты
function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    document.getElementById("payment-fields").style.display = "block"; 
}

// Проверка формы перед подтверждением покупки
function validateForm() {
    const requiredFields = ["card-number", "expiry-date", "ccv"];
    let allFieldsFilled = true;

    requiredFields.forEach((fieldId) => {
        const field = document.getElementById(fieldId);
        if (!field.value) {
            field.style.borderColor = "red";
            allFieldsFilled = false;
        } else {
            field.style.borderColor = "";
        }
    });

    if (!allFieldsFilled) {
        alert("Пожалуйста, заполните все обязательные поля.");
        return;
    }

    const cardNumber = document.getElementById("card-number");
    const expiryDate = document.getElementById("expiry-date");
    const ccv = document.getElementById("ccv");

    if (cardNumber.value.length !== 16 || isNaN(cardNumber.value)) {
        alert("Введите 16-значный номер карты.");
        return;
    }

    const expiryPattern = /^\d{2}\/\d{2}$/;
    if (!expiryPattern.test(expiryDate.value)) {
        alert("Введите срок действия в формате ММ/ГГ, например, 09/27.");
        return;
    }

    if (ccv.value.length !== 3 || isNaN(ccv.value)) {
        alert("Введите 3-значный код CCV.");
        return;
    }

    // Генерация сообщения для WhatsApp
    const orderDetails = `Товары: ${cart.map(item => `${item.name} - ${item.price} сом`).join(", ")}\nОплата через: ${selectedPaymentMethod}\nИтоговая стоимость: ${totalPrice} сом`;
    const encodedMessage = encodeURIComponent(orderDetails);
    const whatsappURL = `https://wa.me/996776730818?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");

    alert("Спасибо за покупку!");
    cart = [];
    updateCart();
    closeModal();
}
