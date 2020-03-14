const globals = require("./global_constants");

//####################################################################################
//############      WAX ACTIONS
//####################################################################################

async function wax_item_create(category, owner, idata, mdata) {
  await globals.WAX.transaction({
    actions: [
      {
        account: globals.SIMPLE_ASSETS_CONTRACT,
        name: "create",
        authorization: [
          {
            actor: globals.WAX_MAIN_CONTRACT,
            permission: "active"
          }
        ],
        data: {
          author: globals.WAX_MAIN_CONTRACT,
          category: category,
          owner: owner,
          idata: idata,
          mdata: mdata,
          requireсlaim: 0
        }
      }
    ]
  });
}

async function wax_delete_asset_log(log_id, username) {
  await globals.WAX.transaction({
    actions: [
      {
        account: globals.WAX_PAYMENT_CONTRACT,
        name: "dellog",
        authorization: [
          {
            actor: globals.WAX_ACTION_CONTRACT,
            permission: "active"
          }
        ],
        data: {
          id: log_id,
          username: username
        }
      }
    ]
  });
}

//####################################################################################
//############      EOS ACTIONS
//####################################################################################

async function eos_item_create(category, owner, idata, mdata) {
  await globals.EOS.transaction({
    actions: [
      {
        account: globals.SIMPLE_ASSETS_CONTRACT,
        name: "create",
        authorization: [
          {
            actor: globals.EOS_ACTION_CONTRACT,
            permission: "active"
          }
        ],
        data: {
          author: globals.EOS_ACTION_CONTRACT,
          category: category,
          owner: owner,
          idata: idata,
          mdata: mdata,
          requireсlaim: 0
        }
      }
    ]
  });
}

async function eos_delete_asset_log(log_id, username) {
  await globals.EOS.transaction({
    actions: [
      {
        account: globals.EOS_PAYMENT_CONTRACT,
        name: "dellog",
        authorization: [
          {
            actor: globals.EOS_ACTION_CONTRACT,
            permission: "active"
          }
        ],
        data: {
          id: log_id,
          username: username
        }
      }
    ]
  });
}

//####################################################################################
//############      MAIN ACTIONS
//####################################################################################

async function main_delete_asset_log(log_id, user_id) {
  await globals.WAX.transaction({
    actions: [
      {
        account: globals.WAX_MAIN_CONTRACT,
        name: "delassetlog",
        authorization: [
          {
            actor: globals.WAX_ACTION_CONTRACT,
            permission: "active"
          }
        ],
        data: {
          id: log_id,
          userid: user_id
        }
      }
    ]
  });
}

async function main_add_faild_log(global_log_id) {
  await globals.WAX.transaction({
    actions: [
      {
        account: globals.WAX_MAIN_CONTRACT,
        name: "addfaillod",
        authorization: [
          {
            actor: globals.WAX_ACTION_CONTRACT,
            permission: "active"
          }
        ],
        data: {
          logid: global_log_id
        }
      }
    ]
  });
}

async function main_take_items_to_wax_main_user_account(
  user_table_id,
  string_user_id,
  items
) {
  await globals.WAX.transaction({
    actions: [
      {
        account: globals.WAX_MAIN_CONTRACT,
        name: "fromsmarket",
        authorization: [
          {
            actor: globals.WAX_ACTION_CONTRACT,
            permission: "active"
          }
        ],
        data: {
          userid: user_table_id,
          stringuid: string_user_id,
          items: items
        }
      }
    ]
  });
}

//####################################################################################
//############      EXPORTS
//####################################################################################

module.exports = {
  wax_item_create: wax_item_create,
  wax_delete_asset_log: wax_delete_asset_log,
  eos_item_create: eos_item_create,
  eos_delete_asset_log: eos_delete_asset_log,
  main_add_faild_log: main_add_faild_log,
  main_delete_asset_log: main_delete_asset_log,
  main_take_items_to_wax_main_user_account: main_take_items_to_wax_main_user_account
};
