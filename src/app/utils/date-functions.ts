export function parseDate(date : Date){
    var fullDateSplitted = date.toString().split('T');
    var dateSplitted = fullDateSplitted[0].split('-');
    var timeSplitted = fullDateSplitted[1].split(':');

    var newDate = new Date();
    newDate.setFullYear(+dateSplitted[0]);
    newDate.setMonth(+dateSplitted[1] - 1);
    newDate.setDate(+dateSplitted[2]);
    newDate.setHours(+timeSplitted[0]);
    newDate.setMinutes(+timeSplitted[1]);
  //  newDate.setSeconds(+timeSplitted[2]);

    return newDate;
}