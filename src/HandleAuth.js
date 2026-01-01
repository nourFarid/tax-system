import axiosInstance from "./Axios/AxiosInstance";
import { getAuthUser, setAuthUser } from './Hooks/Services/Storage';

document.addEventListener("keydown", handleEvent);
document.addEventListener("keyup", handleEvent);
document.addEventListener("keypress", handleEvent);

document.addEventListener("mousemove", handleEvent);
document.addEventListener("mousedown", handleEvent);
document.addEventListener("mouseup", handleEvent);
document.addEventListener("click", handleEvent);
document.addEventListener("dblclick", handleEvent);
document.addEventListener("contextmenu", handleEvent);
document.addEventListener("wheel", handleEvent);
let boolIsCalled = false;
async function handleEvent(e) {
    const token = getAuthUser();

    if (getRemainingMinutes(token) != null && getRemainingMinutes(token) < 15) {
        if (!boolIsCalled) {
            boolIsCalled = true;
            let objResponse = await axiosInstance.get('/Auth/ReAssign')
            if (objResponse.data.result) {
                const token = objResponse.data.token || objResponse.data.Token;
                setAuthUser(token);
            }
            boolIsCalled = false;
        }
        return;
    }
}

function getRemainingMinutes(token) {
    if (!token) return null;
    const payloadBase64 = token.split('.')[1];
    const payloadJson = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')));
    const expSeconds = payloadJson.exp;
    const nowSeconds = Math.floor(Date.now() / 1000);
    const remainingSeconds = expSeconds - nowSeconds;
    const remainingMinutes = remainingSeconds / 60;
    return remainingMinutes;
}