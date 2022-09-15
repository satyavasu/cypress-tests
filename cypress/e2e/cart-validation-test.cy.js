describe('validate cart page', () => {
  before(() => {
    cy.visit('/index.php')

    cy.intercept('POST', '/index.php?rand=*').as('xhr')
  })
  it('should validate line items and total in cart', () => {
    expect(cy.get('#header_logo')).to.exist

    const NUMERIC_REGEXP = /[+-]?\d+(\.\d+)?/g;

    //add Faded Short Sleeve T-shirts product to bag
    cy.clickOnProduct('Faded Short Sleeve T-shirts')
    //select size M
    cy.selectSize('M')
    //choose color as blue
    cy.get('[id="color_14"]').click()

    //add to bag
    cy.addToBag()

    //continue shopping
    cy.continueShippingButton()

    //number of items in bag after added Faded Short Sleeve T-shirts product
    cy.cartItemCount(1)

    //click on home page logo
    cy.clickHomePageIcon()

    //add Blouse product to bag
    cy.clickOnProduct('Blouse')
    //select size S
    cy.selectSize('S')
    //choose color as black
    cy.get('[id="color_11"]').click()

    //add to bag
    cy.addToBag()

    //validate added product deltails on shipping cart popup window
    cy.get('#layer_cart_product_title').contains('Blouse')
    cy.get('#layer_cart_product_attributes').contains('Black, S')
    cy.get('#layer_cart_product_quantity').contains('1')

    //continue shopping
    cy.continueShippingButton()

    //number of items in bag after added Blouse product
    cy.cartItemCount(2)

    //click on home page logo
    cy.clickHomePageIcon()

    //add Printed Summer Dress product to bag
    cy.clickOnProduct('Printed Summer Dress')
    //select size M
    cy.selectSize('M')
    //choose color as orange
    cy.get('[id="color_13"]').click()

    //add to bag
    cy.addToBag()

    //validate added product deltails on shipping cart popup window
    cy.get('#layer_cart_product_title').contains('Printed Summer Dress')
    cy.get('#layer_cart_product_attributes').contains('Orange, M')
    cy.get('#layer_cart_product_quantity').contains('1')

    //Proceed to checkout
    cy.get('[title="Proceed to checkout"]').click()

    //number of items in bag after added Printed Summer Dress product
    cy.cartItemCount(3)

    //delete Blouse product from cart
    cy.get('[class="cart_quantity_delete"]').eq(1).click()

    cy.wait('@xhr', { responseTimeout: 30000 }).then(($xhr) => {
      expect($xhr.response.statusCode).to.eq(200);
    });

    //number of items in bag after deleted Blouse product from cart
    cy.cartItemCount(2)

    //Add a second Faded Short Sleeve T Shirt of the same size and colour 
    cy.get('[id^="cart_quantity_up_"]').first().click()

    cy.wait('@xhr', { responseTimeout: 30000 }).then(($xhr) => {
      expect($xhr.response.statusCode).to.eq(200);
    });

    //quantity number check for Faded Short Sleeve T-shirts product
    cy.get('[class^="cart_quantity_input"]').first().should('have.value', 2)

    //number of items in bag after increase Faded Short Sleeve T-shirts product in cart
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
      expect(secondItemTotal[0]).to.be.equal(28.98)
    })

    //total products cost
    cy.get('#total_product').invoke('text').then((total) => {
      productsTotal = total.match(NUMERIC_REGEXP)
        .map((v) => parseFloat(v));

      expect(productsTotal).to.not.equal(0)
      expect(productsTotal).to.not.be.null
      expect(productsTotal[0]).to.be.equal(+firstItemTotal + +secondItemTotal)
      expect(productsTotal[0]).to.be.equal(62.00)
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
      expect(total[0]).to.be.equal(64.00)
    })

  })
})