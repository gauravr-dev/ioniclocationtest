

export class DateUtils {
  public static getCurrentDateTime() {
    var date = new Date(Date.now());
    var dateString =
      date.getUTCFullYear() +
      "-" +
      (date.getUTCMonth() + 1) +
      "-" +
      date.getUTCDate() +
      " " +
      date.getUTCHours() +
      ":" +
      date.getUTCMinutes() +
      ":" +
      date.getUTCSeconds();
    return dateString;
  }

  /**
   *
   *
   * @static
   * @param {any} date
   * @returns
   * @memberof DateUtils
   */
  public static formatDateTime(date) {
    var dateString =
      date.getUTCFullYear() +
      "-" +
      (date.getUTCMonth() + 1) +
      "-" +
      date.getUTCDate() +
      " " +
      date.getUTCHours() +
      ":" +
      date.getUTCMinutes() +
      ":" +
      date.getUTCSeconds();

    return dateString;
  }

}
