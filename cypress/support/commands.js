/**
 * Click on product title.
 *
 * @param {string} productTitle Name of the Product.
 * @example cy.clickOnProduct('Printed Dress');
 */
Cypress.Commands.add('clickOnProduct', (productTitle) => {
    var productTitleElement = '[title="' + productTitle + '"]'
    cy.get(productTitleElement).first().click().log('click on the ' + productTitle)

    expect(cy.get('[itemprop="name"]')).to.exist
})

/**
 * Select size od the product.
 *
 * @param {string} size size of the product.
 * @example cy.selectSize('M');
 */
Cypress.Commands.add('selectSize', (size) => {
    var selectNumber;
    if (size === 'S') {
        selectNumber = 0
    }
    else if (size === 'M') {
        selectNumber = 1
    }
    cy.get('[id="group_1"]').select(selectNumber).contains(size).log('select size as ' + size)
})

/**
 * Add product to the bag.
 *
 * @example cy.addToBag();
 */
Cypress.Commands.add('addToBag', () => {
    cy.get('#add_to_cart').click().log('click on add to bag button')

    cy.wait('@xhr', { responseTimeout: 30000 }).then(($xhr) => {
        expect($xhr.response.statusCode).to.eq(200);
    });
})

/**
 * Click on Continue shopping button.
 *
 * @example cy.continueShippingButton();
 */
Cypress.Commands.add('continueShippingButton', () => {
    cy.get('[title="Continue shopping"]').click().log('click on continue shopping button')
})

/**
 * Check cart item count.
 *
 * @param {int} count item count on the cart.
 * @example cy.cartItemCount(1);
 */
Cypress.Commands.add('cartItemCount', (count) => {
    cy.get('[class="ajax_cart_quantity"]').contains(count).log('cart item count is: ' + count)
})

/**
 * Click on home page icon.
 *
 * @example cy.clickHomePageIcon();
 */
Cypress.Commands.add('clickHomePageIcon', () => {
    cy.get('.logo').click().log('click on home page icon button')
})