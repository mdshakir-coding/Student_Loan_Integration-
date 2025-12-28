import {fetchEmailsRecords} from "../service/student.loan.Hubspot.js";






async function syncEmails() {


try {

const response = await fetchEmailsRecords();
console.log ("Emails respoce", response.length);




    
} catch (error) {
    console.error("Error feching records", error);
    return;
    
}











}
export{syncEmails};