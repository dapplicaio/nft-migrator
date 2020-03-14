const actions = require("./actions");
const globals = require("./global_constants");
const reader = require("./table_reader");
const functions = require("./help_functions");
async function check_to_simple_market_logs_for_wax() {
  console.log("Start check logs to simple market for wax");

  var global_log_id = 0;
  var global_user_id = "";

  var log_rows = reader.get_main_asset_logs_records();

  try {
    if (log_rows.rows.length == 0) {
      console.log("Log table checked.");
    } else {
      var index = functions.find_correct_record(
        "WAX",
        globals.GLOBAL_MAIN_WAX_LOG_ID,
        log_rows.rows
      );
      if (index != -1) {
        var element = log_rows.rows[index];

        global_log_id = element.id;
        global_user_id = element.userid;

        var items = element.items;
        var owner = element.username;
        
        // INSERT YOUR LOGIC OF ITEMS PARSING HERE
      
      }
      actions.main_delete_asset_log(element.id, element.userid);
      globals.GLOBAL_MAIN_WAX_LOG_ID = element.id;
    }
  } catch (e) {
    console.log(e);
    console.log("Create failed log.");
    main_add_faild_log(global_log_id);
    main_delete_asset_log(global_log_id, global_user_id);
  }
}

//##############################################################################################

async function check_to_simple_market_logs_for_eos() {
  console.log("Start check logs to simple market for eos");

  var global_log_id = 0;
  var global_user_id = "";

  var log_rows = reader.get_main_asset_logs_records();

  try {
    if (log_rows.rows.length == 0) {
      console.log("Log table checked.");
    } else {
      var index = functions.find_correct_record(
        "EOS",
        globals.GLOBAL_MAIN_EOS_LOG_ID,
        log_rows.rows
      );

      if (index != -1) {
        var element = log_rows.rows[index];

        global_log_id = element.id;
        global_user_id = element.userid;

        var items = element.items;
        var owner = element.username;
        
        // INSERT YOUR LOGIC OF ITEMS PARSING HERE
      
      }
      actions.main_delete_asset_log(element.id, element.userid);
      globals.GLOBAL_MAIN_EOS_LOG_ID = element.id;
    }
  } catch (e) {
    console.log(e);
    console.log("Create failed log.");
    actions.main_add_faild_log(global_log_id);
    actions.main_delete_asset_log(global_log_id, global_user_id);
  }
}

//#################################################################################################################

async function take_items_from_eos_simple_market() {
  console.log("Start check logs to simple market");

  var log_rows = reader.get_eos_asset_logs_records();

  var user_rows = reader.get_user_table_records();

  if (log_rows.rows.length != 0) {
    try {
      const element = log_rows.rows[index];

      var user_table_id = 0;
      for (let i = 0; i < user_rows.rows.length; i++) {
        if (user_rows.rows[i] == element.userid) {
          user_table_id = user_rows.rows[i].userid;
          break;
        }
      }
      if ((element.status = "DC") && element.id > GLOBAL_EOS_LOG_ID) {
        actions.main_take_items_to_eos_main_user_account(
          user_table_id,
          element.userid,
          element.items
        );
        actions.eos_delete_asset_log(element.id, element.username);
        globals.GLOBAL_EOS_LOG_ID = element.id;
      }
    } catch (e) {
      console.log(e);
    }
  }
}

async function take_items_from_wax_simple_market() {
  console.log("Start check logs to simple market");

  var log_rows = reader.get_wax_asset_logs_records();

  var user_rows = reader.get_user_table_records();

  if (log_rows.rows.length != 0) {
    try {
      const element = log_rows.rows[index];

      var user_table_id = 0;
      for (let i = 0; i < user_rows.rows.length; i++) {
        if (user_rows.rows[i] == element.userid) {
          user_table_id = user_rows.rows[i].userid;
          break;
        }
      }
      if ((element.status = "DC") && element.id > GLOBAL_WAX_LOG_ID) {
        actions.main_take_items_to_wax_main_user_account(
          user_table_id,
          element.userid,
          element.items
        );
        actions.wax_delete_asset_log(element.id, element.username);
        globals.GLOBAL_WAX_LOG_ID = element.id;
      }
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = {
  check_to_simple_market_logs_for_wax: check_to_simple_market_logs_for_wax,
  check_to_simple_market_logs_for_eos: check_to_simple_market_logs_for_eos,
  take_items_from_eos_simple_market: take_items_from_eos_simple_market,
  take_items_from_wax_simple_market: take_items_from_wax_simple_market
};
