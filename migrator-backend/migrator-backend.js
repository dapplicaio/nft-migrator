// Sample action calls for NFT migrations (export, import)
const Eos = require("eosjs");

mainchain = Eos({
  keyProvider: "", // private key
  httpEndpoint: "http://jungle2.cryptolions.io:80",
  chainId: "e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473"
});

// Another chain where items to be migrated from
var ActionAccount = "";
var ContractAccount = "";

secondary = Eos({
  keyProvider: "", // private key
  httpEndpoint: "https://api-lynx-testnet.eosarabia.net:443",
  chainId: "f11d5128e07177823924a07df63bf59fbd07e52c44bc77d16acc1c6e9d22d37b"
});

async function check_log() {
  console.log("Start of the migration process.");

  try {
    const log_rows = await mainchain.getTableRows({
      code: ContractAccount,
      scope: ContractAccount,
      table: "logs",
      json: true
    });
  } catch (error) {
    console.log(error);
  }

  if (log_rows.rows.length == 0) {
    return 0;
  } else {
    return log_rows.rows[0];
  }
}

// Export NFT to SimpleMarket
async function add_item(log_row) {
  if (log_row.status == "tosm") {
    try {
      console.log("Add an item to SimpleMarket.")
      await mainchain.transaction({
        actions: [
          {
            account: ContractAccount,
            name: "sendtomarket",
            authorization: [
              {
                actor: ActionAccount,
                permission: "active"
              }
            ],
            data: {
              username: log_row.username,
              item_id: log_row.item_id
            }
          }
        ]
      });
      console.log("Delete log record.");
      await mainchain.transaction({
        actions: [
          {
            account: ContractAccount,
            name: "dellog",
            authorization: [
              {
                actor: ActionAccount,
                permission: "active"
              }
            ],
            data: {
              log_id: log_row.id
            }
          }
        ]
      });
    } catch (error) {
      console.log(error);
    }
  }
}

// Import NFT from SimpleMarket
function take_item(log_row)
{
  if (log_row.status == "fromsm") {
    try {
      console.log("Add item to simple market.")
      await mainchain.transaction({
        actions: [
          {
            account: ContractAccount,
            name: "getfrommk",
            authorization: [
              {
                actor: ActionAccount,
                permission: "active"
              }
            ],
            data: {
              username: log_row.username,
              card: log_row.item_id
            }
          }
        ]
      });
      console.log("Delete log.");
      await mainchain.transaction({
        actions: [
          {
            account: ContractAccount,
            name: "dellog",
            authorization: [
              {
                actor: ActionAccount,
                permission: "active"
              }
            ],
            data: {
              log_id: log_row.id
            }
          }
        ]
      });
    } catch (error) {
      console.log(error);
    }
  }
}