// const Variables = require('./variable.library.js');
// let variables = new Variables();

// variables.setVariable('$test', 'toto')
// variables.setVariable('$actual', '$NOW')
// variables.setVariable('$number', 100)
// variables.setVariable('$number2', 200)
// variables.setVariable('$compose', 'the test is $test')
// variables.listVariable()

async function test() {
    const { cryptPassword, decryptPassword } = require("./password.library")    


    console.log ('*****************************')
    
    let pwd = await cryptPassword ('phil')

    console.log ('*****************************')


    let pwd2 = await decryptPassword(pwd)

    console.log ('*****************************')



}

test()


/*

Step: Get the Dataset - getData
1) Code: #DATA_Dataset
2) Variable: $Dataset

Step: Get the dummy user - getData
1) Code: #DATA_SUPERUSER
2) Variable: $DummyUser

Step: Go to OPSYS webpage - url
1) Url: @URL_OPSYS_ACC

Step: Rule for Login to OPSYS - rule
1) Rule: Login OPSYS
2) Parameter 1:
3) Parameter 2:

Step: Wait for the Dashboard - waitFor
1) Name: @OPSYS_Dashboard
2) Wait: 15
3) Continue: 1



*/






