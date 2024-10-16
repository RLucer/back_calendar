
const isDate = (value, { req, location, path }) => {
    if(!value){
        return false;
    }

    const fecha = new Date(value);
    if(fecha.getDate()){
        return true;
    } else {
        return false;
    }
}

module.exports = { isDate }