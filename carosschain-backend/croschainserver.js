const Eos = require("eosjs");
const fetch = require("node-fetch");
var crypto = require("crypto");

var SimpleAssetsContract = "simpleassets";

const firstchain_name = "";
const secondchain_name = "";

firstchain = Eos({
  // add account key
  keyProvider: "", // private key
  httpEndpoint: "http://jungle2.cryptolions.io:80",
  chainId: "e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473"
});

//Another chain with log contract
//TODO add username
var FirstContract = "";
var EosTokenAcc = "eosio.token";

secondchain = Eos({
  keyProvider: "", // private key
  httpEndpoint: "https://api-lynx-testnet.eosarabia.net:443",
  chainId: "f11d5128e07177823924a07df63bf59fbd07e52c44bc77d16acc1c6e9d22d37b"
});

var SecondContract = "";

async function check_log() {
  console.log("Start migration.");

  try {
    const log_rows = await firstchain.getTableRows({
      code: FirstContract,
      scope: FirstContract,
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

async function add_item(log_row) {
  if (log_row.fromchain == firstchain_name) {
    try {
      console.log("Add an item to SimpleMarket.");
      if (log_row.type == 1) {
        await secondchain.transaction({
          actions: [
            {
              account: SimpleAssetsContract,
              name: "issuef",
              authorization: [
                {
                  actor: SecondContract,
                  permission: "active"
                }
              ],
              data: {
                to: log_row.to,
                author: SecondContract,
                quantity: log_row.ft.quantity,
                memo:
                  "Transfer from user " +
                  log_row.from +
                  " on " +
                  log_row.fromchain +
                  " to " +
                  log_row.to +
                  " on " +
                  log_row.tochain +
                  "."
              }
            }
          ]
        });
      } else {
        try {
          const sa_rows = await firstchain.getTableRows({
            code: SimpleAssetsContract,
            scope: SimpleAssetsContract,
            table: "sassets",
            json: true
          });
        } catch (error) {
          console.log(error);
        }
        for (let index = 0; index < log_row.nfts.length; index++) {
          var item = await sa_rows.rows.find(r => r.id == log_row.nfts[index]);
          await secondchain.transaction({
            actions: [
              {
                account: SimpleAssetsContract,
                name: "create",
                authorization: [
                  {
                    actor: SecondContract,
                    permission: "active"
                  }
                ],
                data: {
                  author: SecondContract,
                  category: item.category,
                  owner: log_row.to,
                  idata: item.idata,
                  mdata: item.mdata,
                  requireсlaim: 0
                }
              }
            ]
          });
        }
      }
      console.log("Delete log.");
      await firstchain.transaction({
        actions: [
          {
            account: FirstContract,
            name: "dellog",
            authorization: [
              {
                actor: FirstContract,
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
  } else {
    try {
      if (log_row.type == 1) {
        console.log("Add item to simple market.");
        await firstchain.transaction({
          actions: [
            {
              account: SimpleAssetsContract,
              name: "issuef",
              authorization: [
                {
                  actor: FirstContract,
                  permission: "active"
                }
              ],
              data: {
                to: log_row.to,
                author: SecondContract,
                quantity: log_row.ft.quantity,
                memo:
                  "Transfer from user " +
                  log_row.from +
                  " on " +
                  log_row.fromchain +
                  " to " +
                  log_row.to +
                  " on " +
                  log_row.tochain +
                  "."
              }
            }
          ]
        });
      } else {
        try {
          const sa_rows = await secondchain.getTableRows({
            code: SimpleAssetsContract,
            scope: SimpleAssetsContract,
            table: "sassets",
            json: true
          });
        } catch (error) {
          console.log(error);
        }
        for (let index = 0; index < log_row.nfts.length; index++) {
          var item = await sa_rows.rows.find(r => r.id == log_row.nfts[index]);
          await firstchain.transaction({
            actions: [
              {
                account: SimpleAssetsContract,
                name: "create",
                authorization: [
                  {
                    actor: FirstContract,
                    permission: "active"
                  }
                ],
                data: {
                  author: FirstContract,
                  category: item.category,
                  owner: log_row.to,
                  idata: item.idata,
                  mdata: item.mdata,
                  requireсlaim: 0
                }
              }
            ]
          });
        }
      }
      console.log("Delete the item.");
      await secondchain.transaction({
        actions: [
          {
            account: SecondContract,
            name: "dellog",
            authorization: [
              {
                actor: SecondContract,
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
