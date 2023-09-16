const hre = require('hardhat');
const { expect } = require('chai');

require('@nomicfoundation/hardhat-ethers');

describe('Excentio contract', function () {
    // global vars
    let token;
    let dex;
    let dexAddr;

    let tokenContract;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        dex = await ethers.getContractFactory('DEX');
        tokenContract = await ethers.getContractFactory('Token');
        [addr1, addr2] = await hre.ethers.getSigners();

        dexAddr = await dex.deploy({ from: addr1 });
        token = tokenContract.attach(await dexAddr.token());
    });

    // it('console balance', async function () {
    //     let balanceDex = await dexAddr.balance(dexAddr);
    //     console.log('balance dexAddr: ' + balanceDex);

    //     let balanceAddr1 = await dexAddr.balance(addr1);
    //     console.log('balance addr1: ' + balanceAddr1);

    //     let balanceAddr2 = await dexAddr.balance(addr2);
    //     console.log('balance addr2: ' + balanceAddr2);
    // });

    it('buy token from addr2', async function () {
        const tokensAmount = hre.ethers.parseUnits('1000', 18);

        // facendo connect il msg sender diventa l'addr2
        await dexAddr.connect(addr2).buy({ value: tokensAmount });

        let balanceAddr2 = await dexAddr.balance(addr2);
        expect(Number(hre.ethers.formatEther(balanceAddr2))).to.equal(1000);
    });

    it('sell token from addr2', async function () {
        const tokensAmount = hre.ethers.parseUnits('1000', 18);

        // facendo connect il msg sender diventa l'addr2
        await dexAddr.connect(addr2).buy({ value: tokensAmount });

        let postBuy2 = await dexAddr.balance(addr2);
        console.log('balance addr2: ' + postBuy2);
        expect(Number(hre.ethers.formatEther(postBuy2))).to.equal(1000);

        /*
            mi collego con l'utente 2, e faccio un approve indicando come spender l'indirizzo del contratto
            l'owner è dato dal msg.sender cioè l'addr2 --> si può vedere nella funzione approve
            lo spender è l'indirizzo che passo io cioè l'indirizzo del contratto

            function _approve(address owner, address spender, uint256 amount) internal virtual {
                require(owner != address(0), "ERC20: approve from the zero address");
                require(spender != address(0), "ERC20: approve to the zero address");

                _allowances[owner][spender] = amount;
                emit Approval(owner, spender, amount);
            }

           
            spiegazione _spendAllowance:
                - la funzione allowance ritorna il valore contenuto all'interno della mappa: _allowance[owner][spender]
                - controlla che la currentAllowance non sia il massimo intero
                - controlla che la currentAllowance sia maggiore dell'amount altrimenti non si possono inviare i token
                  anche perché non sono abbastanza 
                - emette un approve diminuendo la disponibilità dei token dell'owner

            function _spendAllowance(address owner, address spender, uint256 amount) internal virtual {
                uint256 currentAllowance = allowance(owner, spender);
                if (currentAllowance != type(uint256).max) {
                    require(currentAllowance >= amount, "ERC20: insufficient allowance");
                    unchecked {
                        _approve(owner, spender, currentAllowance - amount);
                    }
                }
            }

            function _transfer(address from, address to, uint256 amount) internal virtual {
                require(from != address(0), "ERC20: transfer from the zero address");
                require(to != address(0), "ERC20: transfer to the zero address");

                _beforeTokenTransfer(from, to, amount);

                uint256 fromBalance = _balances[from];
                require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
                unchecked {
                    _balances[from] = fromBalance - amount;
                    // Overflow not possible: the sum of all balances is capped by totalSupply, and the sum is preserved by
                    // decrementing then incrementing.
                    _balances[to] += amount;
                }

                emit Transfer(from, to, amount);

                _afterTokenTransfer(from, to, amount);
            }

            spiegazione transferFrom:
                - se la spendAllowance va a buon fine allora chiama la funzione transfer
                - semplicemente la funzione transfer aumenta la balance di to e diminuisce la balance di from

            function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
                address spender = _msgSender();
                _spendAllowance(from, spender, amount);
                _transfer(from, to, amount);
                return true;
            }
         */

        await token
            .connect(addr2)
            .approve(await dexAddr.getAddress(), tokensAmount);

        await dexAddr.connect(addr2).sell(tokensAmount);

        let balanceAddr2 = await dexAddr.balance(addr2);
        console.log('balance addr2: ' + balanceAddr2);
        expect(Number(hre.ethers.formatEther(balanceAddr2))).to.equal(0);

        let balanceAddr1 = await dexAddr.balance(addr1);
        console.log('balance addr1: ' + balanceAddr1);
        expect(Number(hre.ethers.formatEther(balanceAddr1))).to.equal(1000);
    });
});
