import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";

// import these function 
import { syncInquirer } from "./controller/inquirer.controller.js";
import {syncAffiliate} from "./controller/affiliate.controller.js";
import {syncActivity} from "./controller/activity.controller.js";
import {syncInvoices} from "./controller/invoices.controller.js";
import {syncClients} from "./controller/clients.controller.js";
import {syncOrders} from "./controller/orders.controller.js";
import {syncTextMessages} from "./controller/textmessages.controller.js";
import {syncEmails} from "./controller/emails.controller.js";



console.log("Loaded API Token:", process.env.HUBSPOT_API_KEY);
const PORT = process.env.PORT || 3400;

app.listen(PORT, () => {

    // syncInquirer(); //done
    syncAffiliate(); //done
    // syncActivity();
    // syncInvoices();    //done
    // syncClients(); //done 
    // syncOrders();
    // syncTextMessages();
    // syncEmails();

    

console.log(`Server running on port ${PORT}`);
});
