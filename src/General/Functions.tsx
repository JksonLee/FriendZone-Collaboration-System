//Login Checking
export const checkAuthorized = (dataList: any, userInputData: any) => {
    let result: string = "Unauthorized";
    let userID: number = 0;

    dataList.forEach((element: any) => {
        //Filter By Email
        if (element.email === userInputData.email) {
            //Check Password
            if (element.password === userInputData.password) {
                result = "Authorized";
                userID = element.userID;
            } else {
                result = "Password Incorrect";
            }
        }
    });

    return { result, userID };
}


//Register Checking
export const checkEmailExist = (dataList: any, userInputData: any) => {
    let result: string = "Not Existing";

    dataList.forEach((element: any) => {
        //Filter By Email
        if (element.email === userInputData.email) {
            result = "Existing";
        }
    });

    return result;
}


//Register Checking
export const changePasswordChecking = (dataList: any, userInputData: any) => {
    let result: string = "Not Existing";
    let userId: number = 0;

    dataList.forEach((element: any) => {
        //Filter By Email
        if (element.email === userInputData.email) {
            if (element.secretCode == userInputData.secretCode) {
                result = "Validated";
                userId = element.userID;
            } else {
                result = "Invalidated";
            }
        }
    });

    return { result, userId };
}

