class Checker {

    static isFunction(value) {
        return typeof value === 'function'
    }

    static isDefined(value) {
        return value !== null && value !== undefined
    }

    static isArray(value) {
        return {}.toString.call(value) === '[object Array]'
    }

    static isArrayWithType(value) {
        return Array.isArray(value) && value.length === 1 && typeof value[0] === 'function'
    }

    static isArrayWithTypeValid(value, typeChecker, type) {
        return value.every((i) => typeChecker(i, type))
    }

    static isString(value) {
        return typeof value === 'string' || value instanceof String
    }

    static isBoolean(value) {
        return (value === false || value === true)
    }

    static isNumber(value) {
        return typeof value === 'number'
    }

    static isDate(obj) {
        return obj instanceof Date
    }

    static isRegExp(obj) {
        return obj instanceof RegExp
    }

    static isObject(obj) {
        return obj === Object(obj)
    }

    static isInstanceOf(obj, type) {
        return obj instanceof type
    }

    static isEmpty(value) {
        if (!this.isDefined(value)) return true

        if (this.isFunction(value)) return false

        if (this.isString(value)) {
            const EMPTY_STRING_REGEXP = /^\s*$/
            return EMPTY_STRING_REGEXP.test(value)
        }

        if (this.isArray(value)) return value.length === 0

        if (this.isDate(value)) return false

        if (this.isRegExp(value)) return false

        if (this.isObject(value)) {
            // If it finds at least one property we consider it non empty
            for (const attr in value) {
                return false
            }
            return true
        }

        return false
    }

    static isValidFormat(value, expression) {
        if (!this.isRegExp(expression)) return false  
        return expression.test(value)
    }

    static isValidURL(value, options) {


        if (!this.isString(value)) return false

        var schemes = (options && options.schemes)  || ['http', 'https']
        var allowDataUrl = (options && options.allowDataUrl)  || false
        var allowLocal = ( options && options.allowLocal) || false

        // based on https://gist.github.com/dperini/729294
        var regex =
            "^" +
            // protocol identifier
            "(?:(?:" + schemes.join("|") + ")://)" +
            // user:pass authentication
            "(?:\\S+(?::\\S*)?@)?" +
            "(?:";

        var tld = "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))";

        if (allowLocal) {
            tld += "?";
        } else {
            regex +=
                // IP address exclusion
                // private & local networks
                "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
                "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
                "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})";
        }

        regex +=
            // IP address dotted notation octets
            // excludes loopback network 0.0.0.0
            // excludes reserved space >= 224.0.0.0
            // excludes network & broacast addresses
            // (first & last IP address of each class)
            "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
            "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
            "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
            "|" +
            // host name
            "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
            // domain name
            "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
            tld +
            ")" +
            // port number
            "(?::\\d{2,5})?" +
            // resource path
            "(?:[/?#]\\S*)?" +
            "$";

        if (allowDataUrl) {
            // RFC 2397
            var mediaType = "\\w+\\/[-+.\\w]+(?:;[\\w=]+)*";
            var urlchar = "[A-Za-z0-9-_.!~\\*'();\\/?:@&=+$,%]*";
            var dataurl = "data:(?:" + mediaType + ")?(?:;base64)?," + urlchar;
            regex = "(?:" + regex + ")|(?:^" + dataurl + "$)";
        }

        return this.isValidFormat(value,new RegExp(regex, 'i'))
    }

    static isTooShort(value, minimum) {
        if (!this.isNumber(minimum)) throw Error(`Invalid minimum length. It must be a number.`)
        const length = value.length
        return length < minimum
    }

    static isTooLong(value, maximum) {
        if (!this.isNumber(maximum)) throw Error(`Invalid maximum length. It must be a number.`)
        const length = value.length
        return length > maximum
    }
    static isWrongLength(value, expectedLength) {
        if (!this.isNumber(expectedLength)) throw Error(`Invalid length. It must be a number.`)
        const length = value.length
        return length !== expectedLength
    }

    static isEqualTo(left, right) {
        if (!this.isNumber(right)) throw Error(`Invalid 'Equal To'. It must be a number.`)
        return left === right
    }

    static isGreaterThan(left, right) {
        if (!this.isNumber(right)) throw Error(`Invalid 'Greater Than'. It must be a number.`)
        return left > right
    }

    static isGreaterThanOrEqualTo(left, right) {
        if (!this.isNumber(right)) throw Error(`Invalid 'Greater Than Or Equal To'. It must be a number.`)
        return left >= right
    }

    static isLessThan(left, right) {
        if (!this.isNumber(right)) throw Error(`Invalid 'Less Than'. It must be a number.`)
        return left < right
    }

    static isLessThanOrEqualTo(left, right) {
        if (!this.isNumber(right)) throw Error(`Invalid 'Less Than Or Equal To'. It must be a number.`)
        return left <= right
    }

    static isInteger(value) {
        return this.isNumber(value) && value % 1 === 0;
    }

    static isBeforeThan(value, param) {
        if (!this.isDate(value)) throw Error(`Invalid value. It must be a date.`)
        return value < param
    }

    static isAfterThan(value, param) {
        if (!this.isDate(value)) throw Error(`Invalid value. It must be a date.`)
        return value > param
    }

    static isAt(value, param) {
        if (!this.isDate(value)) throw Error(`Invalid value. It must be a date.`)
        return value.valueOf() === param.valueOf()
    }
}

module.exports = Checker