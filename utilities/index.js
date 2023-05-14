class Utilities {
  static detectXML(data) {
    //using regular expression to detect if the data coming in has XML tags or not
    const xmlRegex = /(<.[^(><.)]+>)/g;
    return data?.match?.(xmlRegex) ? true : false;
  }

  static detectHTML(data) {
    //using regular expression to detect if the data coming in hash= html elements or not
    const htmlRegex = /<\/?[a-z][\s\S]*>/i;
    return data?.match?.(htmlRegex) ? true : false;
  }

  static detectScript(data) {
    try {
      return typeof eval(`(${data})`) === "function";
    } catch (e) {
      return false;
    }
  }
}

module.exports = Utilities;
