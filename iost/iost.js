const RPC = require('../lib/rpc');
const {Tx} = require('../lib/structs');
const TxHandler = require('./tx_handler');

const defaultConfig = {
    gasRatio: 1,
    gasLimit: 10000,
    delay: 0,
    expiration: 90,
};

/**
 * IOST开发工具，可以帮忙发交易
 * @constructor
 * @param {object}config - 这个iost的配置
 * @param {HTTPProvider} - provider
 */
class IOST {
    constructor(config) {
        if (config === undefined) {
            this.config = defaultConfig
        }
        this.config = config;
    }

    /**
     * 调用智能合约ABI
     * @param {string}contract - 智能合约ID或者域名
     * @param {string}abi - 智能合约ABI
     * @param {Array}args - 智能合约参数数组
     * @returns {Tx}
     */
    callABI(contract, abi, args) {
        const t = new Tx(this.config.gasRatio, this.config.gasLimit, this.config.delay);
        t.addAction(contract, abi, JSON.stringify(args));
        t.setTime(90, 0);
        return t
    }

    /**
     * 转账
     * @param {string}token - token名
     * @param {string}to - 收款人
     * @param {string}amount - 金额
     * @param {string}memo - 转账备注
     * @returns {Tx}
     */
    transfer(token, to, amount, memo) {
        return this.callABI("token.iost", "transfer", [token, this.publisher, to, amount, memo])
    }

    /**
     * 新建账号
     * @param {string}name - 用户名
     * @param {string}ownerkey - 用户的owner key
     * @param {string}activekey - 用户的active key
     * @param {number}initialRAM - 用户初始RAM
     * @param {number}initialGasPledge - 用户初始IOST质押
     * @returns {Tx}
     */
    newAccount(name, ownerkey, activekey, initialRAM, initialGasPledge) {
        const t = new Tx(this.config.gasRatio, this.config.gasLimit, this.config.delay);
        t.addAction("auth.iost", "SignUp", JSON.stringify([name, ownerkey, activekey]));
        t.addAction("ram.iost", "buy", JSON.stringify([this.publisher, name, initialRAM]));
        t.addAction("gas.iost", "pledge", JSON.stringify([this.publisher, name, initialGasPledge+""]));
        t.setTime(90, 0);
        return t
    }
}

module.exports = IOST;