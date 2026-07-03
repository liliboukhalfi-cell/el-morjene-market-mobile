class ElMorjeneApp {
  constructor() {
    this.state = {
      page: 'home',
      previousPage: 'home',
      cart: [],
      selectedSize: '700g',
      justAdded: false,
      catalogFilter: 'tous',
      checkoutForm: { nom: '', email: '', adresse: '', tel: '', note: '' },
      orderConfirmed: false,
      orderNumber: '',
      selectedProduct: null,
      menuOpen: false
    };

    this.catalog = [
      {
        id: 'classique',
        name: 'Classique',
        images: {
          '700g': 'uploads/download.png',
          '350g': 'uploads/creme-noisettes-350g-qqaoc4xyh2idkd9jnou4yf1blnbcookze3grvb5mko_1200x1200_crop_center.webp',
          '2.5kg': 'uploads/classique-2500g.png.png'
        },
        category: 'Chocolat · Noisette',
        tagline: 'La recette originale. Douce, crémeuse, irrésistible.',
        description: "El Morjene Classique, c'est la référence. Un équilibre gourmand entre noisettes et lait crémeux, avec une touche d'arôme de vanille.",
        color: '#C4571A',
        badge: 'SANS GLUTEN',
        prices: { '350g': 3.50, '700g': 6.50, '2.5kg': 20.00 },
        currency: 'Fr.',
        storage: 'À conserver dans un endroit frais et sec.',
        ingredients: 'Sucre, graisse végétale, noisette, lait écrémé en poudre, lactosérum, émulsifiant : lécithine de soja (SIN 322), arôme de vanille.',
        nutrition: [
          { label: 'Énergie (100g)', value: '≈ 555 kcal' }
        ]
      },
      {
        id: 'rocher',
        name: 'Rocher',
        images: {
          '200g': 'uploads/design-sans-titre49-1.webp',
          '600g': 'uploads/Pate-a-tartiner-Rocher-–-El-Mordjene-–-600g.webp',
          '2.5kg': 'uploads/pate-a-tartiner-rocher-2.5kg-qqaoczymqlou7i0hmk8tqp7j7d2gqp04iczspfvmvc.jpg'
        },
        category: 'Chocolat · Éclats Croustillants',
        tagline: 'Le croustillant qui fait la différence.',
        description: "El Morjene Rocher, c'est la rencontre du fondant et du craquant. Des éclats de noisettes enrobés de chocolat dans une base crémeuse.",
        color: '#A0522D',
        badge: 'CROUSTILLANT',
        prices: { '200g': 3.50, '600g': 7.00, '2.5kg': 25.50 },
        currency: 'Fr.',
        storage: '',
        ingredients: 'Sucre, graisse végétale, noisettes 15%, cacao maigre 8%, éclats de gaufrette, lait écrémé en poudre, lactosérum, émulsifiant : lécithine de soja (SIN 322), arôme de vanille.',
        nutrition: [
          { label: 'Énergie (100g)', value: '≈ 560 kcal' }
        ]
      },
      {
        id: 'rocher-blanc',
        name: 'Rocher Blanc',
        images: {
          '200g': 'uploads/CREME-NOISETTE-200G.jpg',
          '600g': 'uploads/rocher-white-el-mordjene-creme-de-noisette.png'
        },
        category: 'Chocolat Blanc · Éclats',
        tagline: 'La douceur du blanc avec le croustillant.',
        description: "El Morjene Rocher Blanc, c'est la version lumineuse du rocher. Chocolat blanc fondant, éclats de noisettes caramélisées.",
        color: '#C08A10',
        badge: 'DOUCEUR',
        prices: { '200g': 3.50, '600g': 7.00 },
        currency: 'Fr.',
        storage: '',
        ingredients: 'Sucre, graisse végétale, noisettes 15%, beurre de cacao, éclats de gaufrette, lait entier en poudre, lactosérum, émulsifiant : lécithine de soja (SIN 322), arôme de vanille.',
        nutrition: [
          { label: 'Énergie (100g)', value: '≈ 555 kcal' }
        ]
      }
    ];

    this.init();
  }

  init() {
    this.render();
  }

  setState(updates) {
    this.state = { ...this.state, ...updates };
    this.render();
  }

  toggleMenu() {
    this.setState({ menuOpen: !this.state.menuOpen });
  }

  goPage(page) {
    this.setState({ page, previousPage: this.state.page, menuOpen: false });
    window.scrollTo({ top: 0 });
  }

  goProduct(p) {
    const defaultSize = Object.keys(p.prices).sort((a, b) => {
      const parseSize = s => parseFloat(s) * (s.includes('kg') ? 1000 : 1);
      return parseSize(a) - parseSize(b);
    })[0];
    this.setState({ page: 'product', previousPage: this.state.page, selectedSize: defaultSize, justAdded: false, selectedProduct: p });
    window.scrollTo({ top: 0 });
  }

  addToCart(productId, size) {
    const product = this.catalog.find(p => p.id === productId);
    if (!product) return;

    const price = product.prices[size];
    const key = productId + '-' + size;
    const image = product.images ? product.images[size] : null;

    const existing = this.state.cart.find(i => i.key === key);
    if (existing) {
      existing.qty += 1;
    } else {
      this.state.cart.push({
        key, id: productId, name: product.name, size, price, qty: 1, color: product.color, image
      });
    }

    this.setState({ justAdded: true, cart: [...this.state.cart] });

    clearTimeout(this._addedTimer);
    this._addedTimer = setTimeout(() => {
      this.setState({ page: this.state.previousPage, justAdded: false });
      window.scrollTo({ top: 0 });
    }, 500);
  }

  removeFromCart(key) {
    this.setState({ cart: this.state.cart.filter(i => i.key !== key) });
  }

  updateCheckoutForm(field, value) {
    this.state.checkoutForm[field] = value;
    this.render();
  }

  submitOrder() {
    const f = this.state.checkoutForm;
    const items = this.state.cart;
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const delivery = items.reduce((s, i) => s + i.qty, 0) * 0.5;
    const total = (subtotal + delivery).toFixed(2);
    const orderNumber = 'EM-' + Date.now().toString().slice(-6);

    const panierDetails = items.map(i => `${i.name} (${i.size}) × ${i.qty} = ${(i.price * i.qty).toFixed(2)} Fr.`).join('\n');

    const form = document.querySelector('form[name="commande-el-morjene"]');
    form.querySelector('input[name="nom"]').value = f.nom;
    form.querySelector('input[name="email"]').value = f.email || '';
    form.querySelector('input[name="tel"]').value = f.tel;
    form.querySelector('input[name="adresse"]').value = f.adresse;
    form.querySelector('textarea[name="note"]').value = f.note;
    form.querySelector('textarea[name="panier"]').value = `Commande #${orderNumber}\n\n${panierDetails}\n\nSous-total: ${subtotal.toFixed(2)} Fr.\nLivraison: ${delivery.toFixed(2)} Fr.`;
    form.querySelector('input[name="total"]').value = total;

    form.submit();
  }

  confirmOrder() {
    this.submitOrder();
    const orderNumber = 'EM-' + Date.now().toString().slice(-6);
    this.setState({ orderConfirmed: true, orderNumber });
  }

  downloadTicket() {
    const f = this.state.checkoutForm;
    const items = this.state.cart;
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const delivery = items.reduce((s, i) => s + i.qty, 0) * 0.5;
    const total = (subtotal + delivery).toFixed(2);
    const date = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const rows = items.map(i => `<tr><td>${i.name} (${i.size})</td><td>${i.qty}</td><td>${(i.price * i.qty).toFixed(2)} Fr.</td></tr>`).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Ticket El Morjene</title>
      <style>body{font-family:Georgia,serif;max-width:400px;margin:40px auto;color:#2C1A0E;padding:20px}
      h1{font-size:24px;text-align:center;border-bottom:2px solid #C4571A;padding-bottom:12px}
      .sub{text-align:center;font-size:12px;color:#888;margin-bottom:24px}
      table{width:100%;border-collapse:collapse;margin:20px 0}
      th{background:#C4571A;color:white;padding:8px;text-align:left;font-size:12px}
      td{padding:8px;border-bottom:1px solid #eee;font-size:13px}
      .total{font-size:18px;font-weight:bold;text-align:right;margin-top:16px;color:#C4571A}
      .info{background:#FDF6EC;padding:12px;border-radius:8px;font-size:13px;margin:16px 0}</style></head>
      <body><h1>El Morjene Market</h1>
      <div class="sub">Ticket de commande — ${date}</div>
      <div class="info"><strong>Client :</strong> ${f.nom}<br><strong>Adresse :</strong> ${f.adresse}<br><strong>Tél :</strong> ${f.tel}${f.note ? `<br><strong>Note :</strong> ${f.note}` : ''}</div>
      <table><tr><th>Produit</th><th>Qté</th><th>Prix</th></tr>${rows}</table>
      <div class="total">Sous-total : ${subtotal.toFixed(2)} Fr.</div>
      <div class="total">Livraison : ${delivery.toFixed(2)} Fr.</div>
      <div class="total" style="font-size:22px;border-top:2px solid #C4571A;padding-top:8px">TOTAL : ${total} Fr.</div></body></html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ticket-el-morjene-${Date.now()}.html`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  getCartCount() {
    return this.state.cart.reduce((s, i) => s + i.qty, 0);
  }

  getCartSubtotal() {
    return this.state.cart.reduce((s, i) => s + i.price * i.qty, 0);
  }

  getCartDelivery() {
    return this.getCartCount() * 0.5;
  }

  getCartTotal() {
    return (this.getCartSubtotal() + this.getCartDelivery()).toFixed(2);
  }

  renderNav() {
    return `
      <nav>
        <div class="nav-logo">El Morjene<span>.</span></div>
        <button class="menu-burger ${this.state.menuOpen ? 'active' : ''}" onclick="app.toggleMenu()">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <button class="cart-btn" onclick="app.goPage('cart')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 01-8 0"></path></svg>
          <span class="cart-badge">${this.getCartCount()}</span>
        </button>
      </nav>
      ${this.state.menuOpen ? `
        <div class="mobile-menu active">
          <a onclick="app.goPage('home')">Accueil</a>
          <a onclick="app.goPage('catalog')">Produits</a>
          <a onclick="app.goPage('cart')">Panier (${this.getCartCount()})</a>
        </div>
      ` : ''}
    `;
  }

  renderHomePage() {
    const firstProduct = this.catalog[0];
    const firstPrice = Object.values(firstProduct.prices)[0];

    return `
      ${this.renderNav()}
      <section class="hero">
        <div class="hero-badge">Pâte à tartiner artisanale</div>
        <h1>El<br>Morjene</h1>
        <p>La pâte à tartiner qui vient de la rue. Pure, intense, faite avec amour.</p>
        <button class="hero-btn" onclick="app.goPage('catalog')">Explorer →</button>
      </section>

      <section class="carousel">
        <h2>Nos <span style="color:#C4571A;">saveurs</span></h2>
        ${this.catalog.map((prod, idx) => `
          <div class="carousel-item">
            <div class="carousel-image" style="background: radial-gradient(ellipse at 50% 60%, ${prod.color}15 0%, transparent 70%)">
              ${prod.images && prod.images[Object.keys(prod.images)[0]] ?
                `<img src="${prod.images[Object.keys(prod.images)[0]]}" alt="${prod.name}">` :
                '<div style="color:' + prod.color + '55">PHOTO</div>'}
              <div class="badge" style="background:${prod.color}18;color:${prod.color};border-color:${prod.color}35">${prod.badge}</div>
            </div>
            <div class="carousel-info">
              <div class="category" style="color:${prod.color}">${prod.category}</div>
              <h3>${prod.name}</h3>
              <p>${prod.tagline}</p>
              <div class="carousel-price">${Object.values(prod.prices)[0]} Fr.</div>
              <button class="carousel-btn" onclick="app.goProduct(app.catalog[${idx}])">Voir →</button>
            </div>
          </div>
        `).join('')}
      </section>

      <footer>
        <div class="logo">El Morjene<span style="color:#C4571A;">.</span></div>
        <div class="tagline">La pâte de la rue</div>
      </footer>
    `;
  }

  renderCatalogPage() {
    const filtered = this.state.catalogFilter === 'tous' ? this.catalog : this.catalog.filter(p => p.id === this.state.catalogFilter);

    return `
      ${this.renderNav()}
      <section class="catalog">
        <h1>Tous les <span style="color:#C4571A;">produits</span></h1>
        <div class="filters">
          ${['tous', 'classique', 'rocher', 'rocher-blanc'].map(filter => `
            <button class="filter-btn ${this.state.catalogFilter === filter ? 'active' : ''}" onclick="app.setState({catalogFilter:'${filter}'})">
              ${filter === 'tous' ? 'Tous' : this.catalog.find(p => p.id === filter)?.name}
            </button>
          `).join('')}
        </div>
        <div class="product-grid">
          ${filtered.map(prod => `
            <div class="product-card" onclick="app.goProduct(app.catalog.find(p => p.id === '${prod.id}'))">
              <div class="product-image" style="background: radial-gradient(ellipse at 50% 60%, ${prod.color}15 0%, transparent 70%)">
                ${prod.images && prod.images[Object.keys(prod.images)[0]] ?
                  `<img src="${prod.images[Object.keys(prod.images)[0]]}" alt="${prod.name}">` : ''}
                <div class="product-badge" style="background:${prod.color}18;color:${prod.color};border-color:${prod.color}35">${prod.badge}</div>
              </div>
              <div class="product-info">
                <div class="product-category" style="color:${prod.color}">${prod.category}</div>
                <h3 class="product-name">${prod.name}</h3>
                <p class="product-tagline">${prod.tagline}</p>
                <div class="product-footer">
                  <div class="product-price">${Object.values(prod.prices)[0]} Fr.</div>
                  <button class="product-btn">Voir →</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
      <footer>
        <div class="logo">El Morjene<span style="color:#C4571A;">.</span></div>
        <div class="tagline">La pâte de la rue</div>
      </footer>
    `;
  }

  renderProductPage() {
    if (!this.state.selectedProduct) return '';
    const prod = this.state.selectedProduct;
    const size = this.state.selectedSize || Object.keys(prod.prices)[0];
    const price = prod.prices[size];
    const isAdded = this.state.justAdded;

    return `
      ${this.renderNav()}
      <section class="product-detail">
        <a class="back-link" onclick="app.goPage('catalog')">← Retour</a>
        <div class="detail-image" style="background: radial-gradient(ellipse at 50% 60%, ${prod.color}12 0%, transparent 65%)">
          ${prod.images && prod.images[size] ?
            `<img src="${prod.images[size]}" alt="${prod.name}">` :
            '<div style="color:' + prod.color + '55">PHOTO</div>'}
        </div>
        <h1 class="detail-title">${prod.name}</h1>
        <p class="detail-desc">${prod.description}</p>

        <div class="size-selector">
          <label class="size-label">Choisir la taille</label>
          <div class="size-buttons">
            ${Object.keys(prod.prices).map(sz => `
              <button class="size-btn ${size === sz ? 'active' : ''}" onclick="app.setState({selectedSize:'${sz}'})" style="${size === sz ? `border-color:${prod.color};background:${prod.color}18;color:#2C1A0E` : ''}">${sz}</button>
            `).join('')}
          </div>
        </div>

        <div style="margin-bottom: 20px; padding: 16px 0; border-bottom: 1.5px solid rgba(196,87,26,0.08);">
          <div class="carousel-price" style="margin: 0;">${price} Fr.</div>
        </div>

        <button class="add-cart-btn" style="background:${isAdded ? 'linear-gradient(135deg,#3A7A48,#4CA05A)' : 'linear-gradient(135deg,#C4571A,#E07828)'}" onclick="app.addToCart('${prod.id}', '${size}')">
          ${isAdded ? '✓ Ajouté au panier !' : '+ Ajouter au panier'}
        </button>

        <div style="background:#FFFAF3;border:1.5px solid rgba(196,87,26,0.1);border-radius:14px;padding:14px;margin-top:20px;">
          <div style="font-weight:700;margin-bottom:10px;font-size:12px;">Ingrédients</div>
          <p style="font-size:11px;line-height:1.6;color:rgba(44,26,14,0.5)">${prod.ingredients}</p>
        </div>
      </section>
      <footer>
        <div class="logo">El Morjene<span style="color:#C4571A;">.</span></div>
        <div class="tagline">La pâte de la rue</div>
      </footer>
    `;
  }

  renderCartPage() {
    const items = this.state.cart;
    const isEmpty = items.length === 0;

    if (isEmpty) {
      return `
        ${this.renderNav()}
        <section class="cart-page">
          <div class="cart-empty">
            <div class="cart-empty-icon">Vide</div>
            <p style="color:rgba(44,26,14,0.45);font-size:14px;line-height:1.6;margin-bottom:24px;">Ton panier est vide pour l'instant.<br>Explore nos saveurs et craque pour une.</p>
            <button class="hero-btn" onclick="app.goPage('catalog')">Voir les produits</button>
          </div>
        </section>
      `;
    }

    const subtotal = this.getCartSubtotal();
    const delivery = this.getCartDelivery();
    const total = this.getCartTotal();

    return `
      ${this.renderNav()}
      <section class="cart-page">
        <h1>Mon <span style="color:#C4571A;">panier</span></h1>
        <div class="cart-items">
          ${items.map(item => `
            <div class="cart-item" style="border-left-color:${item.color}">
              <div class="cart-item-image">${item.image ? `<img src="${item.image}">` : ''}</div>
              <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-detail">${item.size} — ${item.qty} unité(s)</div>
              </div>
              <div class="cart-item-price">${(item.price * item.qty).toFixed(2)} Fr.</div>
              <button class="remove-btn" onclick="app.removeFromCart('${item.key}')">✕</button>
            </div>
          `).join('')}
        </div>

        <div class="cart-summary">
          <div class="summary-row">
            <span>Sous-total</span>
            <span>${subtotal.toFixed(2)} Fr.</span>
          </div>
          <div class="summary-row">
            <span>Livraison (${items.length} pot)</span>
            <span>${delivery.toFixed(2)} Fr.</span>
          </div>
          <div class="summary-row">
            <span>Total</span>
            <span class="summary-total">${total} Fr.</span>
          </div>
          <button class="checkout-btn" onclick="app.goPage('checkout')">Commander →</button>
        </div>
      </section>
      <footer>
        <div class="logo">El Morjene<span style="color:#C4571A;">.</span></div>
        <div class="tagline">La pâte de la rue</div>
      </footer>
    `;
  }

  renderCheckoutPage() {
    const items = this.state.cart;
    const subtotal = this.getCartSubtotal();
    const delivery = this.getCartDelivery();
    const total = this.getCartTotal();
    const form = this.state.checkoutForm;
    const canConfirm = !!(form.nom && form.adresse && form.tel);

    if (this.state.orderConfirmed) {
      return `
        ${this.renderNav()}
        <section class="product-detail" style="text-align:center;padding:60px 20px;">
          <div style="width:60px;height:60px;background:linear-gradient(135deg,#3A7A48,#4CA05A);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FDF6EC" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
          <h1 class="detail-title">Commande confirmée !</h1>
          <p style="color:rgba(44,26,14,0.55);margin:12px 0;font-size:13px;">Numéro : <strong style="color:#C4571A;">${this.state.orderNumber}</strong></p>
          <p style="color:rgba(44,26,14,0.55);margin-bottom:24px;font-size:13px;">Nous vous contacterons sur WhatsApp.</p>
          <button class="hero-btn" onclick="app.setState({page:'home',cart:[],orderConfirmed:false,orderNumber:'',checkoutForm:{nom:'',email:'',adresse:'',tel:'',note:''}})">Retour à l'accueil</button>
        </section>
      `;
    }

    return `
      ${this.renderNav()}
      <section class="product-detail">
        <a class="back-link" onclick="app.goPage('cart')">← Panier</a>
        <h1 class="detail-title">Confirmer</h1>

        <div style="margin-bottom:20px;">
          <label style="font-size:11px;font-weight:700;display:block;margin-bottom:8px;">Nom *</label>
          <input type="text" placeholder="Karim Benali" value="${form.nom}" onchange="app.updateCheckoutForm('nom', this.value)" style="width:100%;padding:12px;background:#FFFAF3;border:1.5px solid rgba(196,87,26,0.2);border-radius:10px;font-size:13px;outline:none;">
        </div>

        <div style="margin-bottom:20px;">
          <label style="font-size:11px;font-weight:700;display:block;margin-bottom:8px;">Email</label>
          <input type="email" placeholder="karim@example.com" value="${form.email}" onchange="app.updateCheckoutForm('email', this.value)" style="width:100%;padding:12px;background:#FFFAF3;border:1.5px solid rgba(196,87,26,0.2);border-radius:10px;font-size:13px;outline:none;">
        </div>

        <div style="margin-bottom:20px;">
          <label style="font-size:11px;font-weight:700;display:block;margin-bottom:8px;">Adresse *</label>
          <textarea placeholder="Rue, ville..." onchange="app.updateCheckoutForm('adresse', this.value)" style="width:100%;padding:12px;background:#FFFAF3;border:1.5px solid rgba(196,87,26,0.2);border-radius:10px;font-size:13px;outline:none;resize:vertical;min-height:70px;">${form.adresse}</textarea>
        </div>

        <div style="margin-bottom:20px;">
          <label style="font-size:11px;font-weight:700;display:block;margin-bottom:8px;">WhatsApp *</label>
          <input type="tel" placeholder="+41 79 123 45 67" value="${form.tel}" onchange="app.updateCheckoutForm('tel', this.value)" style="width:100%;padding:12px;background:#FFFAF3;border:1.5px solid rgba(196,87,26,0.2);border-radius:10px;font-size:13px;outline:none;">
        </div>

        <div style="margin-bottom:20px;">
          <label style="font-size:11px;font-weight:700;display:block;margin-bottom:8px;">Note</label>
          <textarea placeholder="Instructions..." onchange="app.updateCheckoutForm('note', this.value)" style="width:100%;padding:12px;background:#FFFAF3;border:1.5px solid rgba(196,87,26,0.2);border-radius:10px;font-size:13px;outline:none;resize:vertical;min-height:60px;">${form.note}</textarea>
        </div>

        <div style="background:#FFFAF3;border:1.5px solid rgba(196,87,26,0.1);border-radius:14px;padding:16px;margin-bottom:20px;">
          ${items.map(item => `
            <div style="display:flex;gap:10px;margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid rgba(196,87,26,0.08);">
              <div style="width:40px;height:40px;background:${item.color}10;border-radius:8px;flex-shrink:0;overflow:hidden;">${item.image ? `<img src="${item.image}" style="width:100%;height:100%;object-fit:contain;">` : ''}</div>
              <div style="flex:1;">
                <div style="font-weight:700;font-size:12px;">${item.name}</div>
                <div style="font-size:10px;color:rgba(44,26,14,0.4);">${item.size} × ${item.qty}</div>
              </div>
              <div style="font-weight:900;color:#C4571A;font-size:13px;">${(item.price * item.qty).toFixed(2)}</div>
            </div>
          `).join('')}
          <div style="border-top:1.5px solid rgba(196,87,26,0.08);padding-top:10px;margin-top:10px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:12px;">
              <span>Sous-total</span>
              <span>${subtotal.toFixed(2)} Fr.</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:12px;">
              <span>Livraison</span>
              <span>${delivery.toFixed(2)} Fr.</span>
            </div>
            <div style="display:flex;justify-content:space-between;border-top:1px solid rgba(196,87,26,0.08);padding-top:8px;font-weight:900;color:#C4571A;">
              <span>Total</span>
              <span style="font-family:var(--font-display);font-size:20px;">${total} Fr.</span>
            </div>
          </div>
        </div>

        <button class="checkout-btn" style="background:${canConfirm ? 'linear-gradient(135deg,#C4571A,#E07828)' : 'rgba(44,26,14,0.1)'};color:${canConfirm ? '#FDF6EC' : 'rgba(44,26,14,0.3)'};cursor:${canConfirm ? 'pointer' : 'not-allowed'}" ${canConfirm ? 'onclick="app.confirmOrder();"' : 'disabled'}>Confirmer la commande →</button>
        <button class="checkout-btn" style="background:rgba(196,87,26,0.08);color:#C4571A;margin-top:10px;" onclick="app.downloadTicket()">🧾 Télécharger le ticket</button>
      </section>
    `;
  }

  render() {
    const app = document.getElementById('app');
    let content = '';

    switch (this.state.page) {
      case 'home':
        content = this.renderHomePage();
        break;
      case 'catalog':
        content = this.renderCatalogPage();
        break;
      case 'product':
        content = this.renderProductPage();
        break;
      case 'cart':
        content = this.renderCartPage();
        break;
      case 'checkout':
        content = this.renderCheckoutPage();
        break;
      default:
        content = this.renderHomePage();
    }

    app.innerHTML = content;
  }
}

const app = new ElMorjeneApp();
