export function thousandFormatter(value){
  return Number(value).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export function dateFormatter(value){
  return value !== '' ? new Date(value).toLocaleString('en-US', {hour12: false}) : '';
}
