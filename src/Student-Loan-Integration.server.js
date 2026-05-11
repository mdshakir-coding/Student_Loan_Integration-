import "dotenv/config";
import app from "./app.js";
import { logger } from "./utils/winston.logger.js";

// import these function
import {
  fetchClientsRecords,
  fetchOrdersRecords,
  fetchAffiliateRecords,
  fetchInquirerRecords,
  fetchInvoicesRecords,
  fetchTextMessagesRecords,
  fetchActivityReords,
} from "./services/studentLoan.service.js";

const PORT = process.env.PORT || 3400;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Server running on Envirnment ${process.env.NODE_ENV}`);

  // fetchOrdersRecords(); // And sync them last collectionid = 24374
  // fetchAffiliateRecords(); // 10717 records
  // fetchInquirerRecords();
  // fetchInvoicesRecords();
  // fetchActivityReords();
  fetchTextMessagesRecords();
});
