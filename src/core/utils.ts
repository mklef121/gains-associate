export  const getValidNumber = (number:any) => {
    return isNaN(number) ? 0 : Number(number)
}