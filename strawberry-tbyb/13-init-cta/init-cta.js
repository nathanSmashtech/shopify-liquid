<script>
      (function() {
        class CtaSw1ItemSubTbyb extends HTMLElement {
          constructor() {
            super();
            this.button = this.querySelector('.cta-sw-1item-sub-tbyb');
          }

          connectedCallback() {
            this.button.addEventListener('click', this.handleBuyNow.bind(this));
          }

          async handleBuyNow(event) {
            event.preventDefault();
            
            const button = event.target;
            const variantId = button.dataset.variantId;
            const sellingPlanId = button.dataset.sellingPlanId;
            
            if (!variantId) {
              console.error('No variant ID found');
              return;
            }

            button.disabled = true;
            const originalText = button.textContent;
            button.textContent = 'APPLYING DISCOUNT...';

            try {
              const response = await fetch('/cart/clear.js', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
              });

              if (response.ok) {
                if (window.location.pathname === '/cart') {
                  window.location.reload();
                } else {
                  document.dispatchEvent(new CustomEvent('cart:refresh'));
                  
                  const cartCountElements = document.querySelectorAll('[data-cart-count], .cart-count, #cart-icon-bubble');
                  cartCountElements.forEach(element => {
                    if (element.querySelector('span')) {
                      element.querySelector('span').textContent = '0';
                    } else {
                      element.textContent = '0';
                    }
                  });
                }
              } else {
                console.error('Failed to clear cart');
              }
            } catch (error) {
              console.error('Error clearing cart:', error);
            }

            try {
              const formData = {
                items: [, {
                  id: '47312317776117',
                  quantity: 1
                }, {
                  id: '47312298475765',
                  quantity: 1
                }, {
                  id: variantId,
                  quantity: 1,
                  selling_plan: sellingPlanId
                }]
              };

              const response = await fetch('/cart/add.js', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
              });

              if (!response.ok) {
                throw new Error('Failed to add to cart');
              }

              window.location.href = '/checkout';
              setTimeout(function () {
                button.disabled = false;
                button.textContent = originalText;
              }, 1000);
            } catch (error) {
              console.error('Error:', error);
              button.textContent = originalText;
              button.disabled = false;
              alert('There was an error processing your request. Please try again.');
            }
          }
        }

        customElements.define('cta-sw-1item-sub-tbyb', CtaSw1ItemSubTbyb);
      })();
    </script>