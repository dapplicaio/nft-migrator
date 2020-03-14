const globals = require("./global_constants");

async function get_main_asset_logs_records() {
  const log_rows = await globals.MAIN.getTableRows({
    code: globals.WAX_MAIN_CONTRACT,
    scope: globals.WAX_MAIN_CONTRACT,
    table: "assetlogs",
    json: true
  });
  return log_rows;
}

async function get_eos_asset_logs_records() {
  var log_rows = await globals.EOS.getTableRows({
    code: globals.EOS_PAYMENT_CONTRACT,
    scope: globals.EOS_PAYMENT_CONTRACT,
    table: "assetlogs",
    json: true
  });
  return log_rows;
}

async function get_wax_asset_logs_records() {
  var log_rows = await globals.WAX.getTableRows({
    code: globals.WAX_PAYMENT_CONTRACT,
    scope: globals.WAX_PAYMENT_CONTRACT,
    table: "assetlogs",
    json: true
  });
  return log_rows;
}

async function get_user_table_records() {
  var user_rows = await globals.MAIN.getTableRows({
    code: globals.WAX_MAIN_CONTRACT,
    scope: globals.WAX_MAIN_CONTRACT,
    table: "users",
    json: true
  });
  return user_rows;
}

module.exports = {
  get_main_asset_logs_records: get_main_asset_logs_records,
  get_eos_asset_logs_records: get_eos_asset_logs_records,
  get_wax_asset_logs_records: get_wax_asset_logs_records,
  get_user_table_records: get_user_table_records
};
