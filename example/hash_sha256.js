const updateField = async function(event) {
  const message = document.getElementById("message");
  const decoded = document.getElementById("decoded");

  try {
    let buf;
    let target = '(message)';
    if ((message.value.length > 0) && (message.value.length % 2 == 0) && /^[0-9a-fA-F]*$/i.test(message.value)) {
      buf = new Uint8Array(message.value.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
      target = '(hex)';
    } else {
      buf = new Uint8Array([].map.call(message.value, (c) => c.charCodeAt(0)));
    }
    const hash = await crypto.subtle.digest('SHA-256', buf.buffer);
    decoded.value = byteToHexString(new Uint8Array(hash)) + '\n' + target;
  } catch (e) {
    decoded.value = 'Invalid format';
  }
}

function byteToHexString(buffer) {
  return Array.from(buffer).map((v) => {
    let str = v.toString(16);
    if (str.length === 1) str = '0' + str;
    return str;
  }).join('');
}

const decodeBtnField = document.getElementById("execDecode");
decodeBtnField.addEventListener('click', updateField);
