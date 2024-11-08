import { useState } from "react";

export const checkAuthorized = (dataList: any, userInputData: any) => {
    const [result, setResult] = useState<string>(""); // error must inside a function
    
    dataList.forEach((element: any) => {
        //Filter By Email
        if (element.email === userInputData.userEmail) {
            //Check Password
            if (element.password === userInputData.userPassword) {
                return "Authorized";
            } else {
                return "Password Incorrect";
            }
        }
    });

    return "hi";
}