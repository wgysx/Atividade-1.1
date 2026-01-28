// Dados do site
const testimonials = [
    {
        text: "Finalmente uma bebida que une o prazer do refrigerante com a saúde do suco! Minha família toda adorou, especialmente o sabor de Laranja Citrus.",
        author: "Maria Silva",
        role: "Consumidora",
        rating: 5
    },
    {
        text: "Como nutricionista, sempre recomendo o Suco Sabor para meus clientes que têm dificuldade em abandonar os refrigerantes. É uma ótima opção de transição!",
        author: "Dr. Carlos Mendes",
        role: "Nutricionista",
        rating: 5
    },
    {
        text: "Nosso restaurante começou a servir Suco Sabor e os clientes adoraram! Agora é uma das bebidas mais pedidas, principalmente o sabor Limão Siciliano.",
        author: "Ana Costa",
        role: "Restauranteur",
        rating: 4
    },
    {
        text: "O sabor é incrível e não deixa aquela sensação pesada dos refrigerantes tradicionais. Já virou minha bebida preferida para o dia a dia.",
        author: "Roberto Santos",
        role: "Cliente Frequente",
        rating: 5
    }
];

const products = [
    {
        id: 1,
        name: "Laranja Citrus",
        price: 5.99,
        description: "O clássico sabor de laranja com um toque cítrico refrescante.",
        icon: "fas fa-lemon",
        badge: "Mais Vendido"
    },
    {
        id: 2,
        name: "Uva Roxa",
        price: 5.99,
        description: "Sabor intenso de uva roxa com gás natural.",
        icon: "fas fa-wine-bottle",
        badge: null
    },
    {
        id: 3,
        name: "Limão Siciliano",
        price: 5.99,
        description: "Refrescante sabor de limão siciliano com um toque de menta.",
        icon: "fas fa-lemon",
        badge: "Novidade"
    },
    {
        id: 4,
        name: "Morango Silvestre",
        price: 5.99,
        description: "Doce sabor de morango com um toque ácido.",
        icon: "fas fa-strawberry",
        badge: null
    }
];

// Estado da aplicação
let cart = JSON.parse(localStorage.getItem('suco_sabor_cart')) || [];
let currentTestimonialIndex = 0;
let isDarkMode = localStorage.getItem('suco_sabor_dark_mode') === 'true';
let currentPaymentMethod = 'credit';
let pixTimer = null;
let order = null;
let appliedCoupon = localStorage.getItem('appliedCoupon') || null;

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Inicialização
    initTheme();
    initNavigation();
    initTestimonials();
    initProducts();
    initContactForm();
    initCart();
    initPaymentSection();
    initVideoPlayer();
    initAnimations();
    
    // Atualiza contador do carrinho
    updateCartCounter();
    updateOrderSummary();
    
    // Mostra notificação de boas-vindas
    setTimeout(() => {
        showNotification('Bem-vindo ao Suco Sabor! Descubra o refrigerante que é suco.', 'info');
    }, 1000);
});

// ===== TEMA =====
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        updateThemeIcon();
        
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        }
    }
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    updateThemeIcon();
    localStorage.setItem('suco_sabor_dark_mode', isDarkMode);
}

function updateThemeIcon() {
    const themeIcon = document.querySelector('#themeToggle i');
    if (themeIcon) {
        themeIcon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// ===== NAVEGAÇÃO =====
function initNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
    
    // Scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header com sombra
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });
}

// ===== DEPOIMENTOS =====
function initTestimonials() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dots = document.querySelectorAll('.dot');
    
    updateTestimonial();
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
            updateTestimonial();
            updateDots();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
            updateTestimonial();
            updateDots();
        });
    }
    
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            currentTestimonialIndex = parseInt(this.getAttribute('data-slide'));
            updateTestimonial();
            updateDots();
        });
    });
    
    setInterval(() => {
        currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
        updateTestimonial();
        updateDots();
    }, 5000);
}

function updateTestimonial() {
    const testimonial = testimonials[currentTestimonialIndex];
    
    document.getElementById('testimonialText').textContent = testimonial.text;
    document.getElementById('testimonialAuthor').textContent = testimonial.author;
    document.getElementById('testimonialRole').textContent = testimonial.role;
}

function updateDots() {
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentTestimonialIndex);
    });
}

// ===== PRODUTOS =====
function initProducts() {
    document.querySelectorAll('.buy-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            const product = products.find(p => p.name === productName);
            
            if (product) {
                addToCart(product);
                showNotification(`${product.name} adicionado ao carrinho!`, 'success');
            }
        });
    });
}

// ===== CARRINHO =====
function initCart() {
    const cartModal = document.getElementById('cartModal');
    const closeModal = document.querySelector('.close-modal');
    const checkoutButton = document.getElementById('goToCheckout');
    
    // Abre modal
    document.querySelectorAll('.fa-shopping-cart').forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            openCartModal();
        });
    });
    
    // Fecha modal
    if (closeModal) {
        closeModal.addEventListener('click', closeCartModal);
    }
    
    // Fecha ao clicar fora
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                closeCartModal();
            }
        });
    }
    
    // Finalizar compra
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Adicione produtos ao carrinho primeiro.', 'error');
                return;
            }
            
            closeCartModal();
            setTimeout(() => {
                const paymentSection = document.getElementById('payment');
                if (paymentSection) {
                    window.scrollTo({
                        top: paymentSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    updateOrderSummary();
                    startPixTimer();
                    showNotification('Preencha os dados para finalizar sua compra.', 'info');
                }
            }, 300);
        });
    }
    
    // Salva carrinho no localStorage
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('suco_sabor_cart', JSON.stringify(cart));
    });
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartCounter();
    updateCartModal();
    saveCartToStorage();
    updateOrderSummary();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCounter();
    updateCartModal();
    saveCartToStorage();
    updateOrderSummary();
}

function updateCartItemQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (newQuantity < 1) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            updateCartCounter();
            updateCartModal();
            saveCartToStorage();
            updateOrderSummary();
        }
    }
}

function updateCartCounter() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    document.querySelectorAll('.cart-counter').forEach(counter => counter.remove());
    
    if (totalItems > 0) {
        const logo = document.querySelector('.logo');
        if (logo) {
            const counter = document.createElement('span');
            counter.className = 'cart-counter';
            counter.textContent = totalItems;
            counter.style.cssText = `
                position: absolute;
                top: -5px;
                right: -5px;
                background: var(--color-black);
                color: var(--color-white);
                font-size: 12px;
                font-weight: bold;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            logo.style.position = 'relative';
            logo.appendChild(counter);
        }
    }
}

function openCartModal() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        updateCartModal();
        cartModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeCartModal() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function updateCartModal() {
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        if (cartItems) cartItems.innerHTML = '';
        if (cartEmpty) cartEmpty.style.display = 'flex';
        if (cartTotal) cartTotal.textContent = 'R$ 0,00';
        return;
    }
    
    if (cartEmpty) cartEmpty.style.display = 'none';
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) {
        cartTotal.textContent = `R$ ${total.toFixed(2)}`;
    }
    
    if (cartItems) {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-info">
                    <div class="cart-item-icon">
                        <i class="${item.icon}"></i>
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>${item.description}</p>
                        <div class="cart-item-price">
                            R$ ${item.price.toFixed(2)} × ${item.quantity}
                        </div>
                    </div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-id="${item.id}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="remove-btn" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        cartItems.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const item = cart.find(item => item.id === productId);
                if (item) {
                    updateCartItemQuantity(productId, item.quantity - 1);
                }
            });
        });
        
        cartItems.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const item = cart.find(item => item.id === productId);
                if (item) {
                    updateCartItemQuantity(productId, item.quantity + 1);
                }
            });
        });
        
        cartItems.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                removeFromCart(productId);
                showNotification('Produto removido do carrinho.', 'info');
            });
        });
    }
}

function saveCartToStorage() {
    localStorage.setItem('suco_sabor_cart', JSON.stringify(cart));
}

// ===== PAGAMENTO =====
function initPaymentSection() {
    // Métodos de pagamento
    const paymentMethods = document.querySelectorAll('.payment-method');
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            const methodType = this.getAttribute('data-method');
            currentPaymentMethod = methodType;
            
            paymentMethods.forEach(m => m.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.payment-form').forEach(form => {
                form.style.display = 'none';
            });
            
            const activeForm = document.getElementById(`${methodType}Form`);
            if (activeForm) {
                activeForm.style.display = 'block';
            }
            
            const submitBtn = document.getElementById('submitPayment');
            if (submitBtn) {
                if (methodType === 'pix') {
                    submitBtn.innerHTML = '<i class="fas fa-qrcode"></i> Gerar QR Code PIX';
                } else if (methodType === 'boleto') {
                    submitBtn.innerHTML = '<i class="fas fa-barcode"></i> Gerar Boleto';
                } else {
                    submitBtn.innerHTML = '<i class="fas fa-lock"></i> Finalizar Pagamento';
                }
            }
        });
    });
    
    // Cupom de desconto
    const applyCouponBtn = document.getElementById('applyCoupon');
    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', applyCoupon);
    }
    
    // Formatação cartão
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', formatCardNumber);
    }
    
    const cardExpiry = document.getElementById('cardExpiry');
    if (cardExpiry) {
        cardExpiry.addEventListener('input', formatExpiryDate);
    }
    
    // Botão de pagamento
    const submitPayment = document.getElementById('submitPayment');
    if (submitPayment) {
        submitPayment.addEventListener('click', processPayment);
    }
    
    // Botão copiar PIX
    const copyPixBtn = document.querySelector('.pix-code button');
    if (copyPixBtn) {
        copyPixBtn.addEventListener('click', copyPixCode);
    }
    
    // Botão imprimir comprovante
    const printBtn = document.querySelector('.success-actions .cta-button.secondary');
    if (printBtn) {
        printBtn.addEventListener('click', printOrder);
    }
}

function updateOrderSummary() {
    const orderSummaryItems = document.getElementById('orderSummaryItems');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const discountElement = document.getElementById('discount');
    const grandTotalElement = document.getElementById('grandTotal');
    
    if (!orderSummaryItems || !subtotalElement) return;
    
    if (cart.length === 0) {
        orderSummaryItems.innerHTML = '<p class="empty-cart">Carrinho vazio</p>';
        subtotalElement.textContent = 'R$ 0,00';
        shippingElement.textContent = 'R$ 0,00';
        discountElement.textContent = '-R$ 0,00';
        grandTotalElement.textContent = 'R$ 0,00';
        return;
    }
    
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 9.99;
    const discount = appliedCoupon === 'SUCO10' ? subtotal * 0.1 : 0;
    const grandTotal = subtotal + shipping - discount;
    
    subtotalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
    shippingElement.textContent = `R$ ${shipping.toFixed(2)}`;
    discountElement.textContent = `-R$ ${discount.toFixed(2)}`;
    grandTotalElement.textContent = `R$ ${grandTotal.toFixed(2)}`;
    
    orderSummaryItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <div class="item-info">
                <div class="item-icon">
                    <i class="${item.icon}"></i>
                </div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>${item.quantity} × R$ ${item.price.toFixed(2)}</p>
                </div>
            </div>
            <div class="item-total">
                R$ ${(item.price * item.quantity).toFixed(2)}
            </div>
        </div>
    `).join('');
}

function applyCoupon() {
    const couponInput = document.getElementById('couponCode');
    if (!couponInput) return;
    
    const couponCode = couponInput.value.trim().toUpperCase();
    
    if (couponCode === 'SUCO10') {
        appliedCoupon = 'SUCO10';
        localStorage.setItem('appliedCoupon', 'SUCO10');
        updateOrderSummary();
        showNotification('Cupom aplicado com sucesso! 10% de desconto.', 'success');
        couponInput.value = '';
    } else {
        appliedCoupon = null;
        localStorage.removeItem('appliedCoupon');
        updateOrderSummary();
        showNotification('Cupom inválido. Tente "SUCO10" para 10% de desconto.', 'error');
    }
}

function formatCardNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    let formattedValue = '';
    
    for (let i = 0; i < value.length && i < 16; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedValue += ' ';
        }
        formattedValue += value[i];
    }
    
    e.target.value = formattedValue;
    
    const cardTypeIcon = document.querySelector('.card-input i');
    if (cardTypeIcon) {
        if (value.startsWith('4')) {
            cardTypeIcon.className = 'fab fa-cc-visa';
        } else if (value.startsWith('5')) {
            cardTypeIcon.className = 'fab fa-cc-mastercard';
        } else if (value.startsWith('3')) {
            cardTypeIcon.className = 'fab fa-cc-amex';
        } else {
            cardTypeIcon.className = 'fab fa-cc-visa';
        }
    }
}

function formatExpiryDate(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    e.target.value = value;
}

function copyPixCode() {
    const pixCode = document.getElementById('pixCode');
    if (!pixCode) return;
    
    pixCode.select();
    pixCode.setSelectionRange(0, 99999);
    
    navigator.clipboard.writeText(pixCode.value)
        .then(() => {
            showNotification('Código PIX copiado para a área de transferência!', 'success');
        })
        .catch(() => {
            document.execCommand('copy');
            showNotification('Código PIX copiado!', 'success');
        });
}

function startPixTimer() {
    let timeLeft = 30 * 60;
    
    if (pixTimer) {
        clearInterval(pixTimer);
    }
    
    pixTimer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(pixTimer);
            showNotification('QR Code PIX expirado. Gere um novo código.', 'warning');
            return;
        }
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        const pixExpiry = document.getElementById('pixExpiry');
        if (pixExpiry) {
            pixExpiry.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        timeLeft--;
    }, 1000);
}

function processPayment() {
    if (cart.length === 0) {
        showNotification('Adicione produtos ao carrinho primeiro.', 'error');
        return;
    }
    
    // Validação por método de pagamento
    if (currentPaymentMethod === 'credit') {
        if (!validateCreditCard()) {
            return;
        }
    }
    
    // Simula processamento
    showNotification('Processando pagamento...', 'info');
    
    setTimeout(() => {
        createOrder();
        showPaymentSuccessModal();
        clearCart();
        
        if (pixTimer) {
            clearInterval(pixTimer);
        }
    }, 2000);
}

function validateCreditCard() {
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const cardExpiry = document.getElementById('cardExpiry').value;
    const cardCvv = document.getElementById('cardCvv').value;
    const cardName = document.getElementById('cardName').value;
    
    if (!cardNumber || cardNumber.length !== 16) {
        showNotification('Número do cartão inválido.', 'error');
        return false;
    }
    
    if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        showNotification('Data de validade inválida.', 'error');
        return false;
    }
    
    if (!cardCvv || cardCvv.length < 3) {
        showNotification('CVV inválido.', 'error');
        return false;
    }
    
    if (!cardName.trim()) {
        showNotification('Nome no cartão é obrigatório.', 'error');
        return false;
    }
    
    return true;
}

function createOrder() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 9.99;
    const discount = appliedCoupon === 'SUCO10' ? subtotal * 0.1 : 0;
    const total = subtotal + shipping - discount;
    
    order = {
        id: 'SS' + Date.now(),
        date: new Date().toLocaleDateString('pt-BR'),
        items: [...cart],
        subtotal: subtotal,
        shipping: shipping,
        discount: discount,
        total: total,
        paymentMethod: currentPaymentMethod,
        status: 'completed'
    };
    
    localStorage.setItem('lastOrder', JSON.stringify(order));
    return order;
}

function showPaymentSuccessModal() {
    const modal = document.getElementById('paymentSuccessModal');
    if (!modal || !order) return;
    
    // Atualiza informações do pedido
    document.getElementById('orderNumber').textContent = order.id;
    document.getElementById('orderDate').textContent = order.date;
    document.getElementById('orderTotal').textContent = `R$ ${order.total.toFixed(2)}`;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closePaymentSuccessModal() {
    const modal = document.getElementById('paymentSuccessModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function clearCart() {
    cart = [];
    saveCartToStorage();
    updateCartCounter();
    updateCartModal();
    updateOrderSummary();
    appliedCoupon = null;
    localStorage.removeItem('appliedCoupon');
}

function printOrder() {
    if (!order) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Comprovante Suco Sabor</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .header h1 { color: #000; margin: 0; }
                .order-info { margin-bottom: 20px; }
                .items { margin: 20px 0; }
                .item { display: flex; justify-content: space-between; margin: 5px 0; }
                .total { border-top: 2px solid #000; padding-top: 10px; margin-top: 20px; font-weight: bold; }
                .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>SUCO SABOR</h1>
                <p>Comprovante de Compra</p>
            </div>
            <div class="order-info">
                <p><strong>Número do Pedido:</strong> ${order.id}</p>
                <p><strong>Data:</strong> ${order.date}</p>
                <p><strong>Método de Pagamento:</strong> ${order.paymentMethod}</p>
            </div>
            <div class="items">
                ${order.items.map(item => `
                    <div class="item">
                        <span>${item.name} (${item.quantity}x)</span>
                        <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="total">
                <div class="item"><span>Subtotal:</span><span>R$ ${order.subtotal.toFixed(2)}</span></div>
                <div class="item"><span>Frete:</span><span>R$ ${order.shipping.toFixed(2)}</span></div>
                <div class="item"><span>Desconto:</span><span>-R$ ${order.discount.toFixed(2)}</span></div>
                <div class="item"><span><strong>Total:</strong></span><span><strong>R$ ${order.total.toFixed(2)}</strong></span></div>
            </div>
            <div class="footer">
                <p>Obrigado pela sua compra!</p>
                <p>Suco Sabor Refrigerante - O refrigerante que é suco</p>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// ===== CONTATO =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                newsletter: document.getElementById('newsletter').checked,
                timestamp: new Date().toISOString()
            };
            
            if (!formData.name || !formData.email || !formData.message) {
                showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }
            
            saveContactMessage(formData);
            showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            contactForm.reset();
        });
    }
}

function saveContactMessage(formData) {
    let messages = JSON.parse(localStorage.getItem('suco_sabor_messages') || '[]');
    messages.push(formData);
    localStorage.setItem('suco_sabor_messages', JSON.stringify(messages));
}

// ===== VÍDEO =====
function initVideoPlayer() {
    const videoButton = document.querySelector('.video-button');
    const playButton = document.querySelector('.play-button');
    
    if (videoButton) {
        videoButton.addEventListener('click', () => {
            showNotification('Abrindo vídeo no YouTube...', 'info');
            window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
        });
    }
    
    if (playButton) {
        playButton.addEventListener('click', () => {
            showNotification('Reproduzindo vídeo...', 'info');
            playButton.innerHTML = '<i class="fas fa-pause"></i>';
        });
    }
}

// ===== ANIMAÇÕES =====
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// ===== NOTIFICAÇÕES =====
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    if (notification && notificationText) {
        let icon = 'fa-info-circle';
        if (type === 'success') icon = 'fa-check-circle';
        if (type === 'error') icon = 'fa-exclamation-circle';
        if (type === 'warning') icon = 'fa-exclamation-triangle';
        
        notificationText.textContent = message;
        notification.querySelector('i').className = `fas ${icon}`;
        notification.className = `notification ${type}`;
        notification.style.display = 'flex';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }
}

// ===== EVENT LISTENERS ADICIONAIS =====

// Newsletter
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    const input = newsletterForm.querySelector('input');
    const button = newsletterForm.querySelector('button');
    
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (!input.value || !input.value.includes('@')) {
            showNotification('Por favor, insira um e-mail válido.', 'error');
            return;
        }
        
        showNotification('Inscrição realizada com sucesso!', 'success');
        input.value = '';
        
        let subscribers = JSON.parse(localStorage.getItem('suco_sabor_subscribers') || '[]');
        subscribers.push({
            email: input.value,
            date: new Date().toISOString()
        });
        localStorage.setItem('suco_sabor_subscribers', JSON.stringify(subscribers));
    });
}

// Indicador de scroll
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (scrollIndicator) {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'all';
            }
        }
    });
}

// Fecha modais com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCartModal();
        closePaymentSuccessModal();
    }
});