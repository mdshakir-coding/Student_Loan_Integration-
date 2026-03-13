import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";

// import these function
import { syncInquirer } from "./controller/inquirer.controller.js";
import { syncAffiliate } from "./controller/affiliate.controller.js";
import {
  syncActivity,
  processActivity,
} from "./controller/activity.controller.js";
import { syncInvoices } from "./controller/invoices.controller.js";
import { syncClients, processClient } from "./controller/clients.controller.js";
import { syncOrders, processOrder } from "./controller/orders.controller.js";
import { syncTextMessages } from "./controller/textmessages.controller.js";
import { syncEmails } from "./controller/emails.controller.js";

const PORT = process.env.PORT || 3400;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // syncTextMessages();
  processClient();
  
});

