// should be runned in browser
function testFunc1() {
    console.log(this.testProp1);
}

function testFunc2(usrFunc) {
    usrFunc();
}

var testObject1 = {
    testProp1: 'test_prop1_val1',
    testFunc1: testFunc1
};

var testProp1 = 'test_global_var1';
testFunc2(testObject1.testFunc1);