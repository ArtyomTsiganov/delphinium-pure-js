const loadedUserData = localStorage.getItem("userData");
const userData = loadedUserData ? new Map(JSON.parse(loadedUserData)) : new Map();

function saveUserData() {
    localStorage.setItem("userData", JSON.stringify([...userData.entries()]));
}

export function checkDataValid(field, value) {
    switch(field) {
        case 'fio':
            return /^[A-ZА-Яa-zа-яё]+ [A-ZА-Яa-zа-яё]+ [A-ZА-Яa-zа-яё]* *$/.test(value);
        case 'email':
            return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
        case 'phone':
            return /^\+?[0-9]{11}$/.test(value);
        case 'address':
            return /^[a-zA-Zа-яёА-Я0-9.\-, ]+$/.test(value);
        case 'zipcode':
            return /^[0-9]{6}$/.test(value);
        default:
            return false;
    }
}

export function setUserData(field, value) {
    userData.set(field, value);
    saveUserData();
}

export function getUserData(field) {
    return userData.get(field);
}