const functions = require("./help_functions");

const globals = require("./global_constants");

const job_main_transfer_to_eos_simple_market = new globals.CronJob({
  cronTime: "0-59/3 * * * * *",
  onTick: async () => {
    if (job_main_transfer_to_eos_simple_market.taskRunning) {
      return;
    }

    job_main_transfer_to_eos_simple_market.taskRunning = true;
    try {
      console.log("Checking for new export logs...");
      await functions.check_to_simple_market_logs_for_eos();
    } catch (err) {
      console.log("job failed: check for exports");
      console.log(err);
    }
    job_main_transfer_to_eos_simple_market.taskRunning = false;
  },
  start: true,
  timeZone: "UTC"
});

const job_main_transfer_to_wax_simple_market = new globals.CronJob({
  cronTime: "0-59/3 * * * * *",
  onTick: async () => {
    if (job_main_transfer_to_wax_simple_market.taskRunning) {
      return;
    }

    job_main_transfer_to_wax_simple_market.taskRunning = true;
    try {
      console.log("Checking for new export logs...");
      await functions.check_to_simple_market_logs_for_wax();
    } catch (err) {
      console.log("job failed: check for exports");
      console.log(err);
    }
    job_main_transfer_to_wax_simple_market.taskRunning = false;
  },
  start: true,
  timeZone: "UTC"
});

const job_wax_transfer_from_simple_market = new globals.CronJob({
  cronTime: "0-59/3 * * * * *",
  onTick: async () => {
    if (job_wax_transfer_from_simple_market.taskRunning) {
      return;
    }

    job_wax_transfer_from_simple_market.taskRunning = true;
    try {
      console.log("Checking for new wax import logs...");
      await functions.take_items_from_wax_simple_market();
    } catch (err) {
      console.log("job failed: check for imports");
      console.log(err);
    }
    job_wax_transfer_from_simple_market.taskRunning = false;
  },
  start: true,
  timeZone: "UTC"
});

const job_eos_transfer_from_simple_market = new globals.CronJob({
  cronTime: "0-59/3 * * * * *",
  onTick: async () => {
    if (job_eos_transfer_from_simple_market.taskRunning) {
      return;
    }

    job_eos_transfer_from_simple_market.taskRunning = true;
    try {
      console.log("Checking for new eos import logs...");
      await functions.take_items_from_eos_simple_market();
    } catch (err) {
      console.log("job failed: check for imports");
      console.log(err);
    }
    job_eos_transfer_from_simple_market.taskRunning = false;
  },
  start: true,
  timeZone: "UTC"
});
