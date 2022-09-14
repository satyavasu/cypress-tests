describe('validate cart page', () => {
  before(() => {
    cy.visit('/index.php')

    cy.intercept('POST', '/index.php?rand=*').as('addToBag')
    cy.intercept('POST', '/index.php?rand=*').as('removeFromBag')

  })
  it('should validate line items and total in cart', () => {
    expect(cy.get('#header_logo')).to.exist

    const NUMERIC_REGEXP = /[+-]?\d+(\.\d+)?/g;

    //add 1st product to bag
    cy.clickOnProduct('Faded Short Sleeve T-shirts')

    //select size M
    cy.selectSize('M')

    //choose color as blue
    cy.get('[id="color_14"]').click()

    //add to bag
    cy.addToBag()

    //continue shopping
    cy.continueShippingButton()

    //cart items number validation
    cy.cartItemCount(1)

    //click on logo
    cy.clickHomePageIcon()

    //add 2nd product to bag
    cy.clickOnProduct('Blouse')

    //select size S
    cy.selectSize('S')

    //choose color as black
    cy.get('[id="color_11"]').click()

    //add to bag
    cy.addToBag()

    /* //validate added product deltails on shipping cart popup window
     cy.get('#layer_cart_product_title').contains('Blouse')
     cy.get('#layer_cart_product_attributes').contains('Black, S')
     cy.get('#layer_cart_product_quantity').contains('1')*/

    //continue shopping
    cy.continueShippingButton()

    //cart items number validation
    cy.cartItemCount(2)

    //click on logo
    cy.clickHomePageIcon()

    //add 3rd product to bag
    cy.clickOnProduct('Printed Dress')

    //select size M
    cy.selectSize('M')

    //choose color as orange
    cy.get('[id="color_13"]').click()

    //add to bag
    cy.addToBag()

    /* //validate added product deltails on shipping cart popup window
     cy.get('#layer_cart_product_title').contains('Printed Dress')
     cy.get('#layer_cart_product_attributes').contains('Orange, S')
     cy.get('#layer_cart_product_quantity').contains('1')*/

    //Proceed to checkout
    cy.get('[title="Proceed to checkout"]').click()

    //cart items number validation
    cy.cartItemCount(3)

    //delete item from cart 
    cy.get('[class="cart_quantity_delete"]').eq(1).click()

    cy.wait('@removeFromBag', { responseTimeout: 30000 }).then(($xhr) => {
      expect($xhr.response.statusCode).to.eq(200);
    });

    cy.wait(15000)

    //cart items number validation
    cy.cartItemCount(2)

    //increase 1st product quantity to 2
    cy.get('[id^="cart_quantity_up_"]').first().click()

    cy.wait('@addToBag', { responseTimeout: 30000 })
    cy.wait(10000)

    //quantity number check for product
    cy.get('[class^="cart_quantity_input"]').first().should('have.value', 2)

    //cart items number validation
    cy.cartItemCount(3)

    var firstItemTotal;
    var secondItemTotal;
    var productsTotal;
    var productsShipping;
    var total;

    cy.get('[id^="total_product_price_"]').first().invoke('text').then((total) => {
      firstItemTotal = total.match(NUMERIC_REGEXP)
        .map((v) => parseFloat(v));

      expect(firstItemTotal).to.not.equal(0)
      expect(firstItemTotal).to.not.be.null
      expect(firstItemTotal[0]).to.be.equal(33.02)
    })

    cy.get('[id^="total_product_price_"]').last().invoke('text').then((total) => {
      secondItemTotal = total.match(NUMERIC_REGEXP)
        .map((v) => parseFloat(v));

      expect(secondItemTotal).to.not.equal(0)
      expect(secondItemTotal).to.not.be.null
      expect(secondItemTotal[0]).to.be.equal(26.00)
    })

    //total products cost
    cy.get('#total_product').invoke('text').then((total) => {
      productsTotal = total.match(NUMERIC_REGEXP)
        .map((v) => parseFloat(v));

      expect(productsTotal).to.not.equal(0)
      expect(productsTotal).to.not.be.null
      expect(productsTotal[0]).to.be.equal(+firstItemTotal + +secondItemTotal)
      expect(productsTotal[0]).to.be.equal(59.02)
    })

    //total shipping cost
    cy.get('#total_shipping').invoke('text').then((total) => {
      productsShipping = total.match(NUMERIC_REGEXP)
        .map((v) => parseFloat(v));

      expect(productsShipping).to.not.equal(0)
      expect(productsShipping).to.not.be.null
      expect(productsShipping[0]).to.be.equal(2.00)
    })

    //total cost
    cy.get('#total_price_container').invoke('text').then(($total) => {
      total = $total.match(NUMERIC_REGEXP)
        .map((v) => parseFloat(v));

      expect(total).to.not.equal(0)
      expect(total).to.not.be.null
      expect(total[0]).to.be.equal(+productsTotal + +productsShipping)
      expect(total[0]).to.be.equal(61.02)
    })

  })
})