(function() {
    var object = {};
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    function InvalidCharacterError(message) {
      this.message = message;
    }
    InvalidCharacterError.prototype = new Error;
    InvalidCharacterError.prototype.name = 'InvalidCharacterError';
    // encode
    object.encode || (
      object.encode = function(input) {
        var str = String(input);
        for (
          var block, charCode, idx = 0, map = chars, output = ''; str.charAt(idx | 0) || (map = '=', idx % 1); output += map.charAt(63 & block >> 8 - idx % 1 * 8)
        ) {
          charCode = str.charCodeAt(idx += 3 / 4);
          if (charCode > 0xFF) {
            throw new InvalidCharacterError("'encode' failed: The string to be encoded contains characters outside of the Latin1 range.");
          }
          block = block << 8 | charCode;
        }
        return output;
      });
    // decode
    object.decode || (
      object.decode = function(input) {
        var str = String(input).replace(/=+$/, '');
        if (str.length % 4 == 1) {
          throw new InvalidCharacterError("'decode' failed: The string to be decoded is not correctly encoded.");
        }
        for (
          var bc = 0, bs, buffer, idx = 0, output = ''; buffer = str.charAt(idx++);~ buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
            bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
        ) {
          buffer = chars.indexOf(buffer);
        }
        return output;
      });
    window.Base64=object;
})();