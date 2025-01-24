document.addEventListener('DOMContentLoaded', function () {
  const popup = document.getElementById('product-popup');
  const closeBtn = document.querySelector('.close-btn');
  const openPopupLinks = document.querySelectorAll('.open-popup');
  const addToCartBtn = document.querySelector('.add-to-cart-btn');
  const sizeDropdown = document.getElementById('popup-size');
  const colorOptions = document.querySelectorAll('.color-option');

  let selectedProduct = {
    id: null,
    color: null,
    size: null,
  };

  openPopupLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();

      const productImage = this.getAttribute('data-product-image');
      const productTitle = this.getAttribute('data-product-title');
      const productPrice = this.getAttribute('data-product-price');
      const productDescription = this.getAttribute('data-product-description');
      const productId = this.getAttribute('data-product-id');

      document.getElementById('popup-image').src = productImage;
      document.getElementById('popup-title').textContent = productTitle;
      document.getElementById('popup-price').textContent = productPrice;
      document.getElementById('popup-description').innerHTML = productDescription;

      selectedProduct.id = productId;
      selectedProduct.color = null;
      selectedProduct.size = null;
      sizeDropdown.value = '';
      colorOptions.forEach(option => option.classList.remove('active'));

      popup.style.display = 'block';
    });
  });

  colorOptions.forEach(option => {
    option.addEventListener('click', function () {
      colorOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
      selectedProduct.color = this.getAttribute('data-color');
    });
  });

  closeBtn.addEventListener('click', function () {
    popup.style.display = 'none';
  });

  window.addEventListener('click', function (event) {
    if (event.target === popup) {
      popup.style.display = 'none';
    }
  });

  addToCartBtn.addEventListener('click', function () {
    const selectedSize = sizeDropdown.value;

    if (!selectedSize) {
      alert('Please select a size before adding to the cart.');
      return;
    }
    if (!selectedProduct.color) {
      alert('Please select a color before adding to the cart.');
      return;
    }

    selectedProduct.size = selectedSize;

    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: selectedProduct.id,
        quantity: 1,
        properties: {
          Color: selectedProduct.color,
          Size: selectedProduct.size,
        },
      }),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to add product to the cart.');
        }
      })
      .then(data => {
        alert('Product added to the cart!');
        popup.style.display = 'none';
      })
      .catch(error => {
        console.error('Error:', error);
        alert('There was an error adding the product to your cart. Please try again.');
      });
  });
});
