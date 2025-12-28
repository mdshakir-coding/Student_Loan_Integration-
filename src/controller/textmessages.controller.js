import {fetchTextMessagesRecrds} from "../service/student.loan.Hubspot.js";




async function syncTextMessages() {


try {

const response = await fetchTextMessagesRecrds(); // call the function 
console.log ("TextMessages response", response.length);

    
} catch (error) {
    console.error("Error feching records", error);
    return;
    
}






}
export {syncTextMessages};