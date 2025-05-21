console.log ('aiFixture.js')
//const { test } = require ('@playwright/test')
const { aiFixture }  = require ('@zerostep/playwright')

export const test = test.extend({
  ...aiFixture(test),
})
