// ===============================
// MOBILE MENU
// ===============================

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        navLinks.classList.toggle("active");
    });
}


// ===============================
// CLOSE MOBILE MENU AFTER CLICK
// ===============================

if (navLinks) {
    navLinks.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            navLinks.classList.remove("active");
        });
    });
}


// ===============================
// CART ELEMENTS
// ===============================

const cartBtn = document.querySelector(".cart-btn");
const cartPanel = document.querySelector(".cart-panel");
const closeCart = document.querySelector(".close-cart");

const cartCount = document.querySelector("#cart-count");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector("#cart-total");

let cart = JSON.parse(localStorage.getItem("foodCart")) || [];


// ===============================
// OPEN CART
// ===============================

if (cartBtn && cartPanel) {
    cartBtn.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        cartPanel.classList.add("active");
    });
}


// ===============================
// CLOSE CART
// ===============================

if (closeCart && cartPanel) {
    closeCart.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        cartPanel.classList.remove("active");
    });
}


// ===============================
// DON'T CLOSE CART INSIDE
// ===============================

if (cartPanel) {
    cartPanel.addEventListener("click", function (event) {
        event.stopPropagation();
    });
}


// ===============================
// CLOSE CART OUTSIDE
// ===============================

document.addEventListener("click", function (event) {

    if (!cartPanel) return;

    if (!cartPanel.classList.contains("active")) {
        return;
    }

    if (
        cartBtn &&
        !cartPanel.contains(event.target) &&
        !cartBtn.contains(event.target)
    ) {
        cartPanel.classList.remove("active");
    }

});


// ===============================
// ADD TO CART
// ===============================

const cartButtons =
    document.querySelectorAll(".food-bottom button");

cartButtons.forEach(function (button) {

    button.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        const card =
            button.closest(".food-card");

        if (!card) return;

        const nameElement =
            card.querySelector("h3");

        const priceElement =
            card.querySelector("strong");

        const imageElement =
            card.querySelector("img");

        if (
            !nameElement ||
            !priceElement ||
            !imageElement
        ) {
            return;
        }

        const name =
            nameElement.textContent.trim();

        const price =
            Number(
                priceElement.textContent
                    .replace(/[₦,]/g, "")
            );

        const image =
            imageElement.src;

        const existingItem =
            cart.find(function (item) {
                return item.name === name;
            });

        if (existingItem) {
            existingItem.quantity++;
        } else {

            cart.push({
                name: name,
                price: price,
                image: image,
                quantity: 1
            });

        }

        updateCart();

        showToast(name + " added to cart!");

        button.textContent = "Added ✓";

        setTimeout(function () {
            button.textContent = "Add to Cart";
        }, 700);

    });

});


// ===============================
// UPDATE CART
// ===============================

function updateCart() {

    localStorage.setItem(
        "foodCart",
        JSON.stringify(cart)
    );

    if (
        !cartItems ||
        !cartCount ||
        !cartTotal
    ) {
        return;
    }

    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(function (item) {

        totalItems += Number(item.quantity);

        totalPrice +=
            Number(item.price) *
            Number(item.quantity);

    });

    cartCount.textContent = totalItems;

    cartItems.innerHTML = "";

    // EMPTY CART

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty.
            </p>
        `;

        cartTotal.textContent = "₦0";

        return;
    }


    // DISPLAY CART ITEMS

    cart.forEach(function (item, index) {

        cartItems.innerHTML += `

            <div class="cart-item">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >

                <div class="cart-item-info">

                    <h4>
                        ${item.name}
                    </h4>

                    <p>
                        ₦${(
                            Number(item.price) *
                            Number(item.quantity)
                        ).toLocaleString()}
                    </p>

                    <div class="quantity-controls">

                        <button
                            class="minus-btn"
                            data-index="${index}"
                            type="button"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            class="plus-btn"
                            data-index="${index}"
                            type="button"
                        >
                            +
                        </button>

                    </div>

                </div>

                <button
                    class="remove-item"
                    data-index="${index}"
                    type="button"
                >
                    ×
                </button>

            </div>

        `;

    });


    cartTotal.textContent =
        `₦${totalPrice.toLocaleString()}`;


    // PLUS BUTTON

    document.querySelectorAll(".plus-btn")
        .forEach(function (button) {

            button.addEventListener("click", function (event) {

                event.preventDefault();
                event.stopPropagation();

                const index =
                    Number(button.dataset.index);

                if (!cart[index]) return;

                cart[index].quantity++;

                updateCart();

                if (cartPanel) {
                    cartPanel.classList.add("active");
                }

            });

        });


    // MINUS BUTTON

    document.querySelectorAll(".minus-btn")
        .forEach(function (button) {

            button.addEventListener("click", function (event) {

                event.preventDefault();
                event.stopPropagation();

                const index =
                    Number(button.dataset.index);

                if (!cart[index]) return;

                cart[index].quantity--;

                if (cart[index].quantity <= 0) {
                    cart.splice(index, 1);
                }

                updateCart();

                if (
                    cartPanel &&
                    cart.length > 0
                ) {
                    cartPanel.classList.add("active");
                }

            });

        });


    // REMOVE ITEM

    document.querySelectorAll(".remove-item")
        .forEach(function (button) {

            button.addEventListener("click", function (event) {

                event.preventDefault();
                event.stopPropagation();

                const index =
                    Number(button.dataset.index);

                if (!cart[index]) return;

                cart.splice(index, 1);

                updateCart();

            });

        });

}


// ===============================
// CATEGORY FILTER
// ===============================

const categoryButtons =
    document.querySelectorAll(".category");

const foodCards =
    document.querySelectorAll(".food-card");

categoryButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const selectedCategory =
            button.dataset.category;

        categoryButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        foodCards.forEach(function (card) {

            if (
                selectedCategory === "all" ||
                card.dataset.category === selectedCategory
            ) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }

        });

    });

});


// ===============================
// FOOD SEARCH
// ===============================

const foodSearch =
    document.querySelector("#food-search");

if (foodSearch) {

    foodSearch.addEventListener("input", function () {

        const searchText =
            foodSearch.value
                .toLowerCase()
                .trim();

        foodCards.forEach(function (card) {

            const nameElement =
                card.querySelector("h3");

            if (!nameElement) return;

            const foodName =
                nameElement.textContent
                    .toLowerCase();

            if (foodName.includes(searchText)) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }

        });

    });

}


// ===============================
// CHECKOUT ELEMENTS
// ===============================

const checkoutBtn =
    document.querySelector(".checkout-btn");

const checkoutModal =
    document.querySelector(".checkout-modal");

const closeCheckout =
    document.querySelector(".close-checkout");

const checkoutForm =
    document.querySelector(".checkout-form");

const checkoutItems =
    document.querySelector("#checkout-items");

const checkoutTotal =
    document.querySelector("#checkout-total");


// ===============================
// UPDATE CHECKOUT SUMMARY
// ===============================

function updateCheckoutSummary() {

    if (!checkoutItems || !checkoutTotal) {
        return;
    }

    checkoutItems.innerHTML = "";

    let checkoutSubtotal = 0;

    cart.forEach(function (item) {

        const price =
            Number(item.price);

        const quantity =
            Number(item.quantity);

        const itemTotal =
            price * quantity;

        checkoutSubtotal += itemTotal;

        checkoutItems.innerHTML += `

            <div class="checkout-item">

                <div>

                    <strong>
                        ${item.name}
                    </strong>

                    <p>
                        ${quantity}
                        ×
                        ₦${price.toLocaleString()}
                    </p>

                </div>

                <strong>
                    ₦${itemTotal.toLocaleString()}
                </strong>

            </div>

        `;

    });

    checkoutTotal.textContent =
        `₦${checkoutSubtotal.toLocaleString()}`;

}


// ===============================
// OPEN CHECKOUT
// ===============================

if (checkoutBtn && checkoutModal) {

    checkoutBtn.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        if (cart.length === 0) {

            showToast("Your cart is empty!");

            return;
        }

        updateCheckoutSummary();

        if (cartPanel) {
            cartPanel.classList.remove("active");
        }

        checkoutModal.classList.add("active");

    });

}


// ===============================
// CLOSE CHECKOUT
// ===============================

if (closeCheckout && checkoutModal) {

    closeCheckout.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        checkoutModal.classList.remove("active");

    });

}


// ===============================
// CLOSE CHECKOUT OUTSIDE
// ===============================

if (checkoutModal) {

    checkoutModal.addEventListener("click", function (event) {

        if (event.target === checkoutModal) {

            checkoutModal.classList.remove("active");

        }

    });

}


// ===============================
// SUCCESS MODAL
// ===============================

const successModal =
    document.querySelector(".success-modal");

const backMenuBtn =
    document.querySelector(".back-menu-btn");

const successOrderNumber =
    document.querySelector("#success-order-number");


// ===============================
// PLACE ORDER
// ===============================
// PAYSTACK PAYMENT INTEGRATION
// ===============================

const paymentMethodSelect = document.querySelector("#payment");

// IMPORTANT: Replace this with your actual Paystack public key from https://dashboard.paystack.com/
// Format: pk_live_xxxxx (for production) or pk_test_xxxxx (for testing)
const PAYSTACK_PUBLIC_KEY = 'pk_live_514b71130cfeab5e4af0223c047e1f8207eb9b25';

// Check if Paystack is loaded
if (typeof PaystackPop === 'undefined') {
    console.error('Paystack library not loaded. Make sure the script is loaded in the head of index.html');
}

// ===============================
// CHECKOUT FORM SUBMISSION
// ===============================

if (checkoutForm) {

    checkoutForm.addEventListener("submit", function (event) {

        event.preventDefault();
        event.stopPropagation();

        if (cart.length === 0) {

            showToast("Your cart is empty!");

            return;
        }

        const paymentMethod = paymentMethodSelect.value;
        
        // Calculate total
        const finalTotal =
            cart.reduce(function (sum, item) {
                return (
                    sum +
                    (
                        Number(item.price) *
                        Number(item.quantity)
                    )
                );
            }, 0);

        // Get form data
        const name = document.querySelector("#name").value;
        const phone = document.querySelector("#phone").value;
        const email = document.querySelector("#email").value;
        const address = document.querySelector("#address").value;

        if (paymentMethod === "paystack") {
            // Process Paystack payment
            processPaystackPayment(finalTotal, name, phone, email, address);
        } else {
            // Process cash payment
            completeOrder(finalTotal, name, phone, address, paymentMethod);
        }

    });

}

// ===============================
// PROCESS PAYSTACK PAYMENT
// ===============================

function processPaystackPayment(amount, name, phone, email, address) {
    
    // Validate required fields
    if (!email || !email.includes('@')) {
        showToast("Please enter a valid email address");
        return;
    }

    if (!name || !phone || !address) {
        showToast("Please fill in all required fields");
        return;
    }

    // Check if Paystack is available
    if (typeof PaystackPop === 'undefined') {
        showToast("Payment service not available. Please refresh the page.");
        return;
    }
    
    // Disable the submit button to prevent multiple submissions
    const submitBtn = checkoutForm.querySelector(".place-order-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Processing...";

    try {
        // Initialize Paystack payment
        const handler = PaystackPop.setup({
            key: PAYSTACK_PUBLIC_KEY,
            email: email,
            amount: Math.round(amount * 100), // Amount in kobo (cents)
            ref: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
            currency: 'NGN',
            onClose: function() {
                submitBtn.disabled = false;
                submitBtn.textContent = "Place Order";
                showToast("Payment window closed.");
            },
            onSuccess: function(response) {
                // Payment successful - complete the order
                showToast("Payment successful! Order confirmed.");
                completeOrder(amount, name, phone, address, "paystack", response.reference);
                submitBtn.disabled = false;
                submitBtn.textContent = "Place Order";
            },
            onError: function(error) {
                submitBtn.disabled = false;
                submitBtn.textContent = "Place Order";
                console.error("Paystack Error:", error);
                showToast("Payment failed: " + (error.message || "Please try again"));
            }
        });
        
        handler.openIframe();
    } catch (error) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Place Order";
        console.error("Paystack Setup Error:", error);
        showToast("Payment error: " + error.message);
    }
}

// ===============================
// COMPLETE ORDER
// ===============================

function completeOrder(finalTotal, name, phone, address, paymentMethod, paymentId) {
    
    const orders =
        JSON.parse(
            localStorage.getItem("orders")
        ) || [];

    // CREATE ORDER
    const newOrder = {

        orderNumber:
            "ORD-" +
            Math.floor(
                100000 +
                Math.random() * 900000
            ),

        date:
            new Date().toLocaleString(),

        status: "received",
        
        paymentMethod: paymentMethod,
        
        customerName: name,
        
        customerPhone: phone,
        
        deliveryAddress: address,
        
        paymentId: paymentId || null,

        items:
            cart.map(function (item) {

                return {

                    name: item.name,

                    price:
                        Number(item.price),

                    quantity:
                        Number(item.quantity),

                    image:
                        item.image

                };

            }),

        total:
            finalTotal

    };

    // SAVE ORDER
    orders.unshift(newOrder);

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

    // SHOW ORDER NUMBER
    if (successOrderNumber) {
        successOrderNumber.textContent =
            newOrder.orderNumber;
    }

    // CLOSE CHECKOUT
    if (checkoutModal) {
        checkoutModal.classList.remove("active");
    }

    // EMPTY CART
    cart = [];

    updateCart();

    // RESET FORM
    checkoutForm.reset();

    // SHOW SUCCESS
    if (successModal) {
        successModal.classList.add("active");
    }

    displayOrders();

}


// ===============================
// BACK TO MENU
// ===============================

if (backMenuBtn && successModal) {

    backMenuBtn.addEventListener("click", function (event) {

        event.preventDefault();

        successModal.classList.remove("active");

        const menuSection =
            document.querySelector("#menu");

        if (menuSection) {

            menuSection.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

}


// ===============================
// ORDER NOW BUTTONS
// ===============================

const orderButtons =
    document.querySelectorAll(
        ".order-btn, .hero-btn, .cta-btn"
    );

orderButtons.forEach(function (button) {

    button.addEventListener("click", function (event) {

        event.preventDefault();

        const menuSection =
            document.querySelector("#menu");

        if (menuSection) {

            menuSection.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

});


// ===============================
// FAVORITES
// ===============================

const favoriteButtons =
    document.querySelectorAll(".favorite-btn");

favoriteButtons.forEach(function (button) {

    const card =
        button.closest(".food-card");

    if (!card) return;

    const nameElement =
        card.querySelector("h3");

    if (!nameElement) return;

    const foodName =
        nameElement.textContent.trim();

    const savedFavorites =
        JSON.parse(
            localStorage.getItem("favorites")
        ) || [];


    if (savedFavorites.includes(foodName)) {

        button.classList.add("active");

        button.textContent = "♥";

    }


    button.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        let favorites =
            JSON.parse(
                localStorage.getItem("favorites")
            ) || [];


        if (favorites.includes(foodName)) {

            favorites =
                favorites.filter(function (name) {
                    return name !== foodName;
                });

            button.classList.remove("active");

            button.textContent = "♡";

        } else {

            favorites.push(foodName);

            button.classList.add("active");

            button.textContent = "♥";

        }


        localStorage.setItem(
            "favorites",
            JSON.stringify(favorites)
        );

        displayFavorites();

        updateFavoritesCount();

    });

});


// ===============================
// DISPLAY FAVORITES
// ===============================

function displayFavorites() {

    const favoritesContainer =
        document.querySelector("#favorites-container");

    if (!favoritesContainer) return;

    const favorites =
        JSON.parse(
            localStorage.getItem("favorites")
        ) || [];

    const cards =
        document.querySelectorAll(".food-card");

    favoritesContainer.innerHTML = "";

    if (favorites.length === 0) {

        favoritesContainer.innerHTML = `
            <p class="no-favorites">
                You haven't added any favorites yet.
            </p>
        `;

        return;
    }


    favorites.forEach(function (favoriteName) {

        let foundCard = null;

        cards.forEach(function (card) {

            const nameElement =
                card.querySelector("h3");

            if (!nameElement) return;

            const name =
                nameElement.textContent.trim();

            if (name === favoriteName) {
                foundCard = card;
            }

        });


        if (!foundCard) return;


        const image =
            foundCard.querySelector("img").src;

        const price =
            foundCard.querySelector("strong").textContent;


        const favoriteCard =
            document.createElement("div");

        favoriteCard.className =
            "favorite-card";


        favoriteCard.innerHTML = `

            <img
                src="${image}"
                alt="${favoriteName}"
            >

            <div class="favorite-card-info">

                <h3>
                    ${favoriteName}
                </h3>

                <p>
                    ${price}
                </p>

                <button
                    class="favorite-add-btn"
                    type="button"
                >
                    Add to Cart
                </button>

            </div>

        `;


        const addButton =
            favoriteCard.querySelector(
                ".favorite-add-btn"
            );


        addButton.addEventListener("click", function () {

            const originalButton =
                foundCard.querySelector(
                    ".food-bottom button"
                );

            if (originalButton) {
                originalButton.click();
            }

        });


        favoritesContainer.appendChild(
            favoriteCard
        );

    });

}


// ===============================
// UPDATE FAVORITES COUNT
// ===============================

function updateFavoritesCount() {

    const favoritesCount =
        document.querySelector("#favorites-count");

    if (!favoritesCount) return;

    const favorites =
        JSON.parse(
            localStorage.getItem("favorites")
        ) || [];

    favoritesCount.textContent =
        favorites.length;

}

// ===============================
// DISPLAY ORDER HISTORY
// ===============================

function displayOrders() {

    const ordersContainer =
        document.querySelector("#orders-container");

    if (!ordersContainer) return;


    const orders =
        JSON.parse(
            localStorage.getItem("orders")
        ) || [];


    ordersContainer.innerHTML = "";


    // ===============================
    // NO ORDERS
    // ===============================

    if (orders.length === 0) {

        ordersContainer.innerHTML = `
            <p class="no-orders">
                You haven't placed any orders yet.
            </p>
        `;

        return;
    }


    // ===============================
    // SHOW ONLY 3 ORDERS
    // ===============================

    const visibleOrders =
        orders.slice(0, 3);


    visibleOrders.forEach(function (order) {

        const orderCard =
            document.createElement("div");

        orderCard.className =
            "order-card";


        let itemsHTML = "";


        // ===============================
        // ORDER ITEMS
        // ===============================

        order.items.forEach(function (item) {

            itemsHTML += `

                <div class="order-item">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >

                    <div class="order-item-info">

                        <h4>
                            ${item.name}
                        </h4>

                        <p>
                            ${item.quantity}
                            ×
                            ₦${Number(
                                item.price
                            ).toLocaleString()}
                        </p>

                    </div>

                </div>

            `;

        });


        // ===============================
        // ORDER CARD
        // ===============================

        orderCard.innerHTML = `

            <div class="order-card-header">

                <div>

                    <h3>
                        ${order.orderNumber}
                    </h3>

                    <p class="order-date">
                        ${order.date}
                    </p>

                </div>

                <span class="order-status">
                    ✓ Completed
                </span>

            </div>


            <div class="order-actions">

                <button
                    class="view-order-btn"
                    type="button"
                >
                    View Order
                </button>

                <button
                    class="track-order-btn"
                    type="button"
                >
                    Track Order
                </button>

            </div>


            <div class="order-details">

                ${itemsHTML}

                <div class="order-card-total">

                    <span>
                        Total
                    </span>

                    <span>
                        ₦${Number(
                            order.total
                        ).toLocaleString()}
                    </span>

                </div>

            </div>

        `;


        // ===============================
        // VIEW ORDER
        // ===============================

        const viewButton =
            orderCard.querySelector(
                ".view-order-btn"
            );


        const orderDetails =
            orderCard.querySelector(
                ".order-details"
            );


        if (viewButton && orderDetails) {

            viewButton.addEventListener(
                "click",
                function () {

                    orderDetails.classList.toggle(
                        "active"
                    );


                    if (
                        orderDetails.classList.contains(
                            "active"
                        )
                    ) {

                        viewButton.textContent =
                            "Hide Order";

                    } else {

                        viewButton.textContent =
                            "View Order";

                    }

                }
            );

        }


        ordersContainer.appendChild(
            orderCard
        );

    });


    // ===============================
    // VIEW ALL ORDERS BUTTON
    // ===============================

    if (orders.length > 3) {

        const viewAllButton =
            document.createElement("button");


        viewAllButton.className =
            "view-all-orders-btn";


        viewAllButton.type =
            "button";


        viewAllButton.textContent =
            "View All Orders";


        viewAllButton.addEventListener(
            "click",
            function () {

                // Show all orders

                ordersContainer.innerHTML = "";


                orders.forEach(function (order) {

                    const orderCard =
                        document.createElement("div");

                    orderCard.className =
                        "order-card";


                    let itemsHTML = "";


                    order.items.forEach(
                        function (item) {

                            itemsHTML += `

                                <div class="order-item">

                                    <img
                                        src="${item.image}"
                                        alt="${item.name}"
                                    >

                                    <div class="order-item-info">

                                        <h4>
                                            ${item.name}
                                        </h4>

                                        <p>
                                            ${item.quantity}
                                            ×
                                            ₦${Number(
                                                item.price
                                            ).toLocaleString()}
                                        </p>

                                    </div>

                                </div>

                            `;

                        }
                    );


                    orderCard.innerHTML = `

                        <div class="order-card-header">

                            <div>

                                <h3>
                                    ${order.orderNumber}
                                </h3>

                                <p class="order-date">
                                    ${order.date}
                                </p>

                            </div>

                            <span class="order-status">
                                ✓ Completed
                            </span>

                        </div>


                        <div class="order-actions">

                            <button
                                class="view-order-btn"
                                type="button"
                            >
                                View Order
                            </button>

                            <button
                                class="track-order-btn"
                                type="button"
                            >
                                Track Order
                            </button>

                        </div>


                        <div class="order-details">

                            ${itemsHTML}

                            <div class="order-card-total">

                                <span>
                                    Total
                                </span>

                                <span>
                                    ₦${Number(
                                        order.total
                                    ).toLocaleString()}
                                </span>

                            </div>

                        </div>

                    `;


                    const viewButton =
                        orderCard.querySelector(
                            ".view-order-btn"
                        );


                    const orderDetails =
                        orderCard.querySelector(
                            ".order-details"
                        );


                    if (
                        viewButton &&
                        orderDetails
                    ) {

                        viewButton.addEventListener(
                            "click",
                            function () {

                                orderDetails.classList.toggle(
                                    "active"
                                );


                                if (
                                    orderDetails.classList.contains(
                                        "active"
                                    )
                                ) {

                                    viewButton.textContent =
                                        "Hide Order";

                                } else {

                                    viewButton.textContent =
                                        "View Order";

                                }

                            }
                        );

                    }


                    ordersContainer.appendChild(
                        orderCard
                    );

                });


                // Hide the button after expanding

                viewAllButton.style.display =
                    "none";

            }
        );


        ordersContainer.appendChild(
            viewAllButton
        );

    }

}


// ===============================
// TOAST
// ===============================

function showToast(message) {

    let toast =
        document.querySelector(".toast");


    if (!toast) {

        toast =
            document.createElement("div");

        toast.className =
            "toast";

        document.body.appendChild(toast);

    }


    toast.textContent =
        message;

    toast.classList.add("show");


    setTimeout(function () {

        toast.classList.remove("show");

    }, 2500);

}


// ===============================
// CLEAR ENTIRE CART
// ===============================

const clearCartBtn =
    document.querySelector(".clear-cart-btn");


if (clearCartBtn) {

    clearCartBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            if (cart.length === 0) {

                showToast(
                    "Your cart is already empty!"
                );

                return;
            }

            cart = [];

            updateCart();

            showToast("Cart cleared!");

        }
    );

}


// ===============================
// DARK MODE
// ===============================

const themeToggle =
    document.querySelector("#theme-toggle");

const savedTheme =
    localStorage.getItem("theme");


if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");

    if (themeToggle) {
        themeToggle.textContent = "☀️";
    }

}


if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "dark-mode"
            );

            const isDark =
                document.body.classList.contains(
                    "dark-mode"
                );


            if (isDark) {

                themeToggle.textContent = "☀️";

                localStorage.setItem(
                    "theme",
                    "dark"
                );

            } else {

                themeToggle.textContent = "🌙";

                localStorage.setItem(
                    "theme",
                    "light"
                );

            }

        }
    );

}


// ===============================
// ORDER TRACKING
// ===============================

const trackingModal =
    document.querySelector(".tracking-modal");

const closeTracking =
    document.querySelector(".close-tracking");

const trackingOrderNumber =
    document.querySelector("#tracking-order-number");


// ===============================
// OPEN TRACKING
// ===============================

document.addEventListener("click", function (event) {

    const trackButton =
        event.target.closest(".track-order-btn");

    if (!trackButton) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();


    const orderCard =
        trackButton.closest(".order-card");

    if (!orderCard) {
        return;
    }


    const orderNumberElement =
        orderCard.querySelector(
            ".order-card-header h3"
        );

    if (!orderNumberElement) {
        return;
    }


    const orderNumber =
        orderNumberElement.textContent.trim();


    const orders =
        JSON.parse(
            localStorage.getItem("orders")
        ) || [];


    const order =
        orders.find(function (item) {

            return item.orderNumber === orderNumber;

        });


    if (!order) {

        showToast("Order not found.");

        return;
    }


    if (trackingOrderNumber) {

        trackingOrderNumber.textContent =
            order.orderNumber;

    }


    updateTrackingStatus(order);


    if (trackingModal) {

        trackingModal.classList.add("active");

    }

});


// ===============================
// CLOSE TRACKING
// ===============================

if (closeTracking && trackingModal) {

    closeTracking.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            trackingModal.classList.remove(
                "active"
            );

        }
    );

}


// ===============================
// CLOSE TRACKING OUTSIDE
// ===============================

if (trackingModal) {

    trackingModal.addEventListener(
        "click",
        function (event) {

            if (event.target === trackingModal) {

                trackingModal.classList.remove(
                    "active"
                );

            }

        }
    );

}


// ===============================
// UPDATE TRACKING STATUS
// ===============================

function updateTrackingStatus(order) {

    const steps =
        document.querySelectorAll(
            ".tracking-step"
        );

    const lines =
        document.querySelectorAll(
            ".tracking-line"
        );


    if (!steps.length) {
        return;
    }


    const statusOrder = [
        "received",
        "preparing",
        "out_for_delivery",
        "delivered"
    ];


    let currentIndex =
        statusOrder.indexOf(order.status);


    if (currentIndex === -1) {
        currentIndex = 0;
    }


    // UPDATE STEPS

    steps.forEach(function (step, index) {

        step.classList.remove("active");
        step.classList.remove("completed");


        if (index < currentIndex) {

            step.classList.add("completed");

        }


        if (index === currentIndex) {

            step.classList.add("active");

        }

    });


    // UPDATE LINES

    lines.forEach(function (line, index) {

        line.classList.remove("active");


        if (index < currentIndex) {

            line.classList.add("active");

        }

    });

}


// ===============================
// START
// ===============================

updateCart();

displayFavorites();

updateFavoritesCount();

displayOrders();

/* ===============================
CUSTOMER PROFILE
================================ */

const profileBtn = document.getElementById("profile-btn");
const profileModal = document.getElementById("profile-modal");
const closeProfile = document.getElementById("close-profile");
const profileForm = document.getElementById("profile-form");

const profileName = document.getElementById("profile-name");
const profileEmail = document.getElementById("profile-email");
const profilePhone = document.getElementById("profile-phone");
const profileAddress = document.getElementById("profile-address");

const profileOrdersCount =
    document.getElementById("profile-orders-count");

const profileFavoritesCount =
    document.getElementById("profile-favorites-count");


/* ===============================
OPEN PROFILE
================================ */

if (profileBtn) {
    profileBtn.addEventListener("click", () => {

        loadProfile();
        updateProfileStats();

        profileModal.classList.add("active");

    });
}


/* ===============================
CLOSE PROFILE
================================ */

if (closeProfile) {
    closeProfile.addEventListener("click", () => {

        profileModal.classList.remove("active");

    });
}


/* ===============================
CLOSE WHEN CLICKING OUTSIDE
================================ */

if (profileModal) {
    profileModal.addEventListener("click", (event) => {

        if (event.target === profileModal) {
            profileModal.classList.remove("active");
        }

    });
}


/* ===============================
LOAD PROFILE
================================ */

function loadProfile() {

    const profile =
        JSON.parse(localStorage.getItem("customerProfile"));

    if (!profile) return;

    profileName.value = profile.name || "";
    profileEmail.value = profile.email || "";
    profilePhone.value = profile.phone || "";
    profileAddress.value = profile.address || "";

    const customerName =
        document.getElementById("customer-name");

    if (customerName) {
        customerName.textContent =
            profile.name || "My Profile";
    }

    if (navbarCustomerName) {
        navbarCustomerName.textContent =
            profile.name || "Customer";
    }
}
/* ===============================
SAVE PROFILE
================================ */

if (profileForm) {
    profileForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const profile = {
            name: profileName.value.trim(),
            email: profileEmail.value.trim(),
            phone: profilePhone.value.trim(),
            address: profileAddress.value.trim()
        };

        localStorage.setItem(
            "customerProfile",
            JSON.stringify(profile)
        );

        // Update the name immediately
        const customerName = document.getElementById("customer-name");

        if (customerName) {
            customerName.textContent = profile.name || "My Profile";
        }

        // Close profile
        if (profileModal) {
            profileModal.classList.remove("active");
        }

        // Show success message
        if (typeof showToast === "function") {
            showToast("Profile saved successfully!");
        } else {
            alert("Profile saved successfully!");
        }
    });
}


/* ===============================
PROFILE STATISTICS
================================ */

function updateProfileStats() {

    const orders =
        JSON.parse(
            localStorage.getItem("orders")
        ) || [];

    profileOrdersCount.textContent =
        orders.length;


    const favorites =
        JSON.parse(
            localStorage.getItem("favorites")
        ) || [];

    profileFavoritesCount.textContent =
        favorites.length;

}
const navbarCustomerName =
    document.getElementById("navbar-customer-name");