const Eos = require("eosjs");
//cron
const CronJob = require("cron").CronJob;

//initialize jungle
//TODO add account key
//eos action contract
EOS = Eos({
  keyProvider: "", // private key
  httpEndpoint: "https://mainnet.eoscanada.com",
  chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906"
});
//wax action contract
WAX = Eos({
  keyProvider: "", // private key
  httpEndpoint: "https://testnet.waxsweden.org:59676",
  chainId: "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4"
});
//wax main contract
MAIN = Eos({
  keyProvider: "", // private key
  httpEndpoint: "https://testnet.waxsweden.org:59676",
  chainId: "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4"
});

//TODO add username
var WAX_MAIN_CONTRACT = "";
var WAX_ACTION_CONTRACT = "";
var WAX_PAYMENT_CONTRACT = "";
var EOS_ACTION_CONTRACT = "";
var EOS_PAYMENT_CONTRACT = "";
var SIMPLE_ASSETS_CONTRACT = "";

var GLOBAL_MAIN_EOS_LOG_ID = 0;
var GLOBAL_MAIN_WAX_LOG_ID = 0;
var GLOBAL_EOS_LOG_ID = 0;
var GLOBAL_WAX_LOG_ID = 0;

module.exports = {
  Eos: Eos,
  CronJob: CronJob,
  EOS: EOS,
  WAX: WAX,
  MAIN: MAIN,
  WAX_ACTION_CONTRACT: WAX_ACTION_CONTRACT,
  WAX_MAIN_CONTRACT: WAX_MAIN_CONTRACT,
  WAX_PAYMENT_CONTRACT: WAX_PAYMENT_CONTRACT,
  EOS_ACTION_CONTRACT: EOS_ACTION_CONTRACT,
  EOS_PAYMENT_CONTRACT: EOS_PAYMENT_CONTRACT,
  SIMPLE_ASSETS_CONTRACT: SIMPLE_ASSETS_CONTRACT,
  GLOBAL_MAIN_EOS_LOG_ID: GLOBAL_MAIN_EOS_LOG_ID,
  GLOBAL_MAIN_WAX_LOG_ID: GLOBAL_MAIN_WAX_LOG_ID,
  GLOBAL_EOS_LOG_ID: GLOBAL_EOS_LOG_ID,
  GLOBAL_WAX_LOG_ID: GLOBAL_WAX_LOG_ID
};
