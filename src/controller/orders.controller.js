import {fetchOrdersRecords} from "../service/student.loan.Hubspot.js";



async function syncOrders() {

try {

const response = await fetchOrdersRecords();
console.log ("Orders response", response.length);



    
} catch (error) {
    console.error("Error feching records", error);
    return;
    
}







}
export {syncOrders};