var DappToken = artifacts.require("DappToken");

contract('DappToken', function(accounts) {
    var tokenInstance;
    it('Initializes the contract with the correct values', function(){
        return DappToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function(name){
            assert.equal(name,'DApp Token', 'has the correct name')
            return tokenInstance.symbol();
        }).then(function(symbol){
            assert.equal(symbol,'DAPP', 'has the correct symbol')
            return tokenInstance.standard();
        }).then(function(standard){
            assert.equal(standard,'DApp Token v1.0', 'has the correct standard version')
        })
    });

    it('sets the total supply upon deployment', function() {
        return DappToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply) {
            assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance){
            assert.equal(adminBalance.toNumber(),1000000, 'it allocates the intial supply to the admin')
        });
    });

    var amount = 250000;

    it('transfers token ownership', function(){
        return DappToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.transfer.call(accounts[1],amount*99999999999999999,{from:accounts[0]});
        }).then(assert.fail).catch(function(error){
            // assert(error.message.indexOf('revert') >= 0, error.message.indexOf('revert'))
            return tokenInstance.transfer.call(accounts[1],amount,{from:accounts[0]});
        }).then(function(success){
            assert.equal(success,true,'it return true');
            return tokenInstance.transfer(accounts[1],amount,{from:accounts[0]});
        }).then(function(receipt){
            assert.equal(receipt.logs.length,1,'trigger one event');
            var rece = receipt.logs[0];
            assert.equal(rece.event,'Transfer','Should be "Transfer" event');
            assert.equal(rece.args._from, accounts[0],'log account the tokens are transferred from')
            return tokenInstance.balanceOf(accounts[1]);
        }).then(function(balanceTo){
            assert.equal(balanceTo.toNumber(), amount, 'adds the amount to the receiving account')
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balanceFrom){
            assert.equal(balanceFrom.toNumber(), 1000000-amount, 'deducts the amount to the sending account')
        })
    })
});
