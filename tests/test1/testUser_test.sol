// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.22 <0.9.0;

// This import is automatically injected by Remix
import "remix_tests.sol"; 

// This import is required to use custom transaction context
// Although it may fail compilation in 'Solidity Compiler' plugin
// But it will work fine in 'Solidity Unit Testing' plugin
import "remix_accounts.sol";
import "../../contracts/User.sol";

// File name has to end with '_test.sol', this file can contain more than one testSuite contracts
contract testSuite {
    User u;
     address acc0;

    // beforeEach works before running each test
    function beforeAll() public {
        u = new User();
        acc0 = TestsAccounts.getAccount(0);
    }

    function testAddUser() public {
        u.addUser(acc0);
    }

    function getUserBalance() public {
        bool result = u.checkUserBalance(acc0,2);
        Assert.equal(result, true, "ok");
    }

    
}
    