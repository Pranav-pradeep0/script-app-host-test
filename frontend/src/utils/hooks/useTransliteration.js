/**
 * A custom React hook for transliteration of text using the Google Input Tools API.
 *
 * @returns {Function} The async `transliterate` function to be used in components.
 *
 * @param {String} sourceText  The source text to be transliterated.
 * @param {Number} maxResult=5  The maximum number of transliteration results to retrieve.
 * @param {String} inputLanguageCode  The language code, e.g., 'ml-t-i0-und' for Malayalam.
 *   Expected language codes:
 *   - Amharic: am-t-i0-und
 *   - Arabic: ar-t-i0-und
 *   - Bengali: bn-t-i0-und
 *   - Chinese (Hong Kong): yue-hant-t-i0-und
 *   - Chinese (Simplified, China): zh-t-i0-pinyin
 *   - Chinese (Traditional, Taiwan): zh-hant-t-i0-und
 *   - Greek: el-t-i0-und
 *   - Gujarati: gu-t-i0-und
 *   - Hindi: hi-t-i0-und
 *   - Kannada: kn-t-i0-und
 *   - Malayalam: ml-t-i0-und
 *   - Marathi: mr-t-i0-und
 *   - Nepali: ne-t-i0-und
 *   - Oriya: or-t-i0-und
 *   - Persian: fa-t-i0-und
 *   - Punjabi: pu-t-i0-und
 *   - Russian: ru-t-i0-und
 *   - Sanskrit: sa-t-i0-und
 *   - Serbian: sr-t-i0-und
 *   - Sinhalese: si-t-i0-und
 *   - Tamil: ta-t-i0-und
 *   - Telugu: te-t-i0-und
 *   - Thai: th-t-i0-und
 *   - Tigrinya: ti-t-i0-und
 *   - Urdu: ur-t-i0-und
 * @throws {Error} Throws an error if there is a network error.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of transliterated results.
 */

const useTransliteration = () => {
  //  Define the transliterate function
  const transliterate = async (
    sourceText,
    maxResult = 5,
    inputLanguageCode = 'ml-t-i0-und',
  ) => {
    try {
      // Use a regular expression to split the source text into parts
      const parts = sourceText.split(/([0-9]+)/);

      // Transliterate the non-numeric parts and leave the numeric parts unchanged
      const transliteratedParts = await Promise.all(
        parts.map(async (part) => {
          if (/[0-9]/.test(part)) {
            // If the part contains numeric characters, leave it unchanged
            return part;
          } else {
            // Otherwise, transliterate the part
            const encodedUrl = encodeURI(
              `https://inputtools.google.com/request?text=${part}&itc=${inputLanguageCode}&num=${maxResult}&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`,
            );
            const response = await fetch(encodedUrl);

            if (response.status === 200) {
              const responseJson = await response.json();

              if (
                typeof responseJson[1] === 'undefined' ||
                typeof responseJson[1][0] === 'undefined'
              ) {
                return part;
              }

              const responseList = responseJson[1][0][1];
              return responseList;
            } else {
              console.error(`Rejected status code: ${response.status}`);
              return part;
            }
          }
        }),
      );

      // Join the transliterated parts back together
      return transliteratedParts.join('').split(',');
    } catch (error) {
      console.error('Network Error', error);
      return sourceText;
    }
  };

  // Return the transliterate function for use in components
  return transliterate;
};

export default useTransliteration;
