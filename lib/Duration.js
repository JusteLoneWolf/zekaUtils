/* global define, module */
(function () {
  const LANGUAGES = {
    en: {
      y: function (c) {
        return "year" + (c === 1 ? "" : "s");
      },
      mo: function (c) {
        return "month" + (c === 1 ? "" : "s");
      },
      w: function (c) {
        return "week" + (c === 1 ? "" : "s");
      },
      d: function (c) {
        return "day" + (c === 1 ? "" : "s");
      },
      h: function (c) {
        return "hour" + (c === 1 ? "" : "s");
      },
      m: function (c) {
        return "minute" + (c === 1 ? "" : "s");
      },
      s: function (c) {
        return "second" + (c === 1 ? "" : "s");
      },
      ms: function (c) {
        return "millisecond" + (c === 1 ? "" : "s");
      },
      decimal: ".",
    },
    fr: {
      y: function (c) {
        return "an" + (c >= 2 ? "s" : "");
      },
      mo: "mois",
      w: function (c) {
        return "semaine" + (c >= 2 ? "s" : "");
      },
      d: function (c) {
        return "jour" + (c >= 2 ? "s" : "");
      },
      h: function (c) {
        return "heure" + (c >= 2 ? "s" : "");
      },
      m: function (c) {
        return "minute" + (c >= 2 ? "s" : "");
      },
      s: function (c) {
        return "seconde" + (c >= 2 ? "s" : "");
      },
      ms: function (c) {
        return "milliseconde" + (c >= 2 ? "s" : "");
      },
      decimal: ",",
    },
  };
  function parser(passedOptions) {
    const result = function parser(ms, humanizerOptions) {
      const options = extend({}, result, humanizerOptions || {});
      return makeDuration(ms, options);
    };

    return extend(
        result,
        {
          language: "fr",
          delimiter: ", ",
          spacer: " ",
          conjunction: "",
          serialComma: true,
          units: ["y", "mo", "w", "d", "h", "m", "s"],
          languages: {},
          round: false,
          unitMeasures: {
            y: 31557600000,
            mo: 2629800000,
            w: 604800000,
            d: 86400000,
            h: 3600000,
            m: 60000,
            s: 1000,
            ms: 1,
          },
        },
        passedOptions
    );
  }

  const Duration = parser({});

  function getDictionary(options) {
    let languagesFromOptions = [options.language];

    if (has(options, "fallbacks")) {
      if (isArray(options.fallbacks) && options.fallbacks.length) {
        languagesFromOptions = languagesFromOptions.concat(options.fallbacks);
      } else {
        throw new Error("fallbacks must be an array with at least one element");
      }
    }

    for (let i = 0; i < languagesFromOptions.length; i++) {
      const languageToTry = languagesFromOptions[i];
      if (has(options.languages, languageToTry)) {
        return options.languages[languageToTry];
      } else if (has(LANGUAGES, languageToTry)) {
        return LANGUAGES[languageToTry];
      }
    }

    throw new Error("No language found.");
  }

  function makeDuration(ms, options) {
    let i, len, piece;
    ms = Math.abs(ms);

    const dictionary = getDictionary(options);
    const pieces = [];
    let unitName, unitMS, unitCount;
    for (i = 0, len = options.units.length; i < len; i++) {
      unitName = options.units[i];
      unitMS = options.unitMeasures[unitName];
      if (i + 1 === len) {
        if (has(options, "maxDecimalPoints")) {
          const expValue = Math.pow(10, options.maxDecimalPoints);
          const unitCountFloat = ms / unitMS;
          unitCount = parseFloat(
              (Math.floor(expValue * unitCountFloat) / expValue).toFixed(
                  options.maxDecimalPoints
              )
          );
        } else {
          unitCount = (ms / unitMS).toFixed(0);
        }
      } else {
        unitCount = Math.floor(ms / unitMS);
      }
      pieces.push({
        unitCount: unitCount,
        unitName: unitName,
      });
      ms -= unitCount * unitMS;
    }

    let firstOccupiedUnitIndex = 0;
    for (i = 0; i < pieces.length; i++) {
      if (pieces[i].unitCount) {
        firstOccupiedUnitIndex = i;
        break;
      }
    }

    if (options.round) {
      let ratioToLargerUnit, previousPiece;
      for (i = pieces.length - 1; i >= 0; i--) {
        piece = pieces[i];
        piece.unitCount = Math.round(piece.unitCount);

        if (i === 0) {
          break;
        }

        previousPiece = pieces[i - 1];

        ratioToLargerUnit =
            options.unitMeasures[previousPiece.unitName] /
            options.unitMeasures[piece.unitName];
        if (
            piece.unitCount % ratioToLargerUnit === 0 ||
            (options.largest && options.largest - 1 < i - firstOccupiedUnitIndex)
        ) {
          previousPiece.unitCount += piece.unitCount / ratioToLargerUnit;
          piece.unitCount = 0;
        }
      }
    }

    const result = [];
    for (i = 0, pieces.length; i < len; i++) {
      piece = pieces[i];
      if (piece.unitCount) {
        result.push(
            render(piece.unitCount, piece.unitName, dictionary, options)
        );
      }

      if (result.length === options.largest) {
        break;
      }
    }

    if (result.length) {
      if (!options.conjunction || result.length === 1) {
        return result.join(options.delimiter);
      } else if (result.length === 2) {
        return result.join(options.conjunction);
      } else if (result.length > 2) {
        return (
            result.slice(0, -1).join(options.delimiter) +
            (options.serialComma ? "," : "") +
            options.conjunction +
            result.slice(-1)
        );
      }
    } else {
      return render(
          0,
          options.units[options.units.length - 1],
          dictionary,
          options
      );
    }
  }

  function render(count, type, dictionary, options) {
    let decimal;
    if (has(options, "decimal")) {
      decimal = options.decimal;
    } else if (has(dictionary, "decimal")) {
      decimal = dictionary.decimal;
    } else {
      decimal = ".";
    }

    const countStr = count.toString().replace(".", decimal);
    const dictionaryValue = dictionary[type];
    let word;
    if (typeof dictionaryValue === "function") {
      word = dictionaryValue(count);
    } else {
      word = dictionaryValue;
    }

    return countStr + options.spacer + word;
  }

  function extend(destination) {
    let source;
    for (let i = 1; i < arguments.length; i++) {
      source = arguments[i];
      for (const prop in source) {
        if (has(source, prop)) {
          destination[prop] = source[prop];
        }
      }
    }
    return destination;
  }

  const isArray =
      Array.isArray ||
      function (arg) {
        return Object.prototype.toString.call(arg) === "[object Array]";
      };

  function has(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  Duration.getSupportedLanguages = function getSupportedLanguages() {
    const result = [];
    for (const language in LANGUAGES) {
      if (has(LANGUAGES, language) && language !== "gr") {
        result.push(language);
      }
    }
    return result;
  };

  Duration.parser = parser;

  if (typeof define === "function" && define.amd) {
    define(function () {
      return Duration;
    });
  } else if (typeof module !== "undefined" && module.exports) {
    module.exports = Duration;
  } else {
    this.Duration = Duration;
  }
})();
