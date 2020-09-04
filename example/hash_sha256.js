const updateField = async function(event) {
  const message = document.getElementById("message");
  const decoded = document.getElementById("decoded");

  try {
    const hash = await crypto.subtle.digest('SHA-256', (new Uint8Array([].map.call(message.value, (c) => c.charCodeAt(0))).buffer));
    decoded.value = byteToHexString(new Uint8Array(hash));
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
