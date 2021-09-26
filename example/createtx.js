const getTxInputs = function() {
  const result = [];
  let num = 1;
  while (true) {
    const txidField = document.getElementById(`txid${num}`);
    if (!txidField) break;
    const voutField = document.getElementById(`vout${num}`);
    const sequenceField = document.getElementById(`sequence${num}`);
    const txid = txidField.value;
    const vout = parseInt(voutField.value, 10);
    const sequence = parseInt(sequenceField.value, 10);

    const amountField = document.getElementById(`amount${num}`);
    const assetField = document.getElementById(`asset${num}`);
    const vbfField = document.getElementById(`vbf${num}`);
    const abfField = document.getElementById(`abf${num}`);

    const amount = BigInt(amountField.value);
    const asset = assetField.value;
    const blindFactor = vbfField.value;
    const assetBlindFactor = abfField.value;
    result.push({
      txid,
      vout,
      sequence,
      amount,
      asset,
      blindFactor,
      assetBlindFactor,
    });
    num++;
  }
  return result;
};

const getTxOutputs = function() {
  const result = [];
  let num = 1;
  while (true) {
    const addrField = document.getElementById(`out_address${num}`);
    if (!addrField) break;
    const amountField = document.getElementById(`out_amount${num}`);
    const scriptField = document.getElementById(`out_script${num}`);
    const assetField = document.getElementById(`out_asset${num}`);
    const nonceField = document.getElementById(`out_nonce${num}`);
    const address = addrField.value;
    const amount = BigInt(amountField.value);
    const directLockingScript = scriptField.value;
    const asset = assetField.value;
    const directNonce = nonceField.value;
    if (address != '' || directLockingScript != '') {
      result.push({
        address,
        amount,
        asset,
        directLockingScript,
        directNonce,
      });
    }
    num++;
  }
  return result;
};

const getTxOutputFee = function() {
  let result = {'asset': '', 'amount': 0};
  let num = 1;
  while (true) {
    const addrField = document.getElementById(`out_address${num}`);
    if (!addrField) break;
    const amountField = document.getElementById(`out_amount${num}`);
    const scriptField = document.getElementById(`out_script${num}`);
    const assetField = document.getElementById(`out_asset${num}`);
    const address = addrField.value;
    const amount = BigInt(amountField.value);
    const directLockingScript = scriptField.value;
    const asset = assetField.value;
    if (address == '' && directLockingScript == '') {
      result = {
        amount,
        asset,
      };
      break;
    }
    num++;
  }
  return result;
};

const updateField = async function() {
  const created = document.getElementById('created');
  const networkObj = document.getElementById('network');
  const selectedNetworkIdx = networkObj.selectedIndex;
  // eslint-disable-next-line prefer-const
  let network = networkObj.options[selectedNetworkIdx].value;

  let isElements = true;
  if ((network === 'mainnet') || (network === 'testnet') || (network === 'regtest')) {
    isElements = false;
  } else if (network === 'elementsregtest') {
    network = 'regtest';
  }
  const version = parseInt(document.getElementById('version').value, 10);
  const locktime = parseInt(document.getElementById('locktime').value, 10);

  const txins = getTxInputs();
  const txouts = getTxOutputs();
  const fee = getTxOutputFee();
  const hasBlind = document.getElementById('blind').checked;

  let tx;
  try {
    if (!isElements) {
      const req = {
        version,
        locktime,
        txins,
        txouts,
      };
      console.log(req);
      tx = await callJsonApi(Module, 'CreateRawTransaction', req);
    } else {
      const req = {
        version,
        locktime,
        txins,
        txouts,
        fee,
      };
      console.log(req);
      tx = await callJsonApi(Module, 'ElementsCreateRawTransaction', req);
      if (hasBlind) {
        const blindReq = {
          tx: tx.hex,
          txins,
        };
        console.log(req);
        const resp = await callJsonApi(Module, 'BlindRawTransaction', blindReq);
        tx = resp;
      }
    }
    created.value = JSON.stringify(tx, (_key, value) =>
            typeof value === 'bigint' ? value.toString() : value, '  ');
  } catch (e) {
    console.log(e);
    created.value = 'Invalid data format';
    return;
  }
};

const changeDisplay = function(name, hasDisplay) {
  const field = document.getElementById(name);
  if (!field) return false;
  if (hasDisplay) {
    field.style.display = 'block';
  } else {
    field.style.display = 'none';
  }
  return true;
};

const elementsKeys = ['elementsInput', 'elementsOutput'];

const changeNetworkField = async function() {
  // eslint-disable-next-line prefer-const
  const networkObj = document.getElementById('network');
  const selectedNetworkIdx = networkObj.selectedIndex;
  const network = networkObj.options[selectedNetworkIdx].value;
  let isElements = true;
  if ((network === 'mainnet') || (network === 'testnet') || (network === 'regtest')) {
    isElements = false;
  }
  for (const key of elementsKeys) {
    let i = 1;
    while (true) {
      if (!changeDisplay(`${key}${i}`, isElements)) {
        break;
      }
      i++;
    }
  }
};

const txInputTemplate = '<hr><li>' +
  'txid:<br>' +
  '<textarea rows="1" name="txid__NUM__" id="txid__NUM__" class="input"></textarea><br>' +
  'vout: <input type="number" name="vout__NUM__" id="vout__NUM__" value="0" min="0" max="536870911" step="1" /><br>' +
  'sequence number: <input type="number" name="sequence__NUM__" id="sequence__NUM__" value="4294967295" min="0" max="4294967295" step="1" /><br>' +
  'amount: <input type="number" name="amount__NUM__" id="amount__NUM__" value="0" min="0" max="2100000000000000" step="1" /><br>' +
  '<div id="elementsInput__NUM__" style="display:none">' +
    'asset:<br>' +
    '<textarea rows="1" name="asset__NUM__" id="asset__NUM__" class="input"></textarea><br>' +
    'amount blinder:<br>' +
    '<textarea rows="1" name="vbf__NUM__" id="vbf__NUM__" class="input"></textarea><br>' +
    'asset blinder:<br>' +
    '<textarea rows="1" name="abf__NUM__" id="abf__NUM__" class="input"></textarea><br>' +
  '</div>';
const txOutputTemplate = '<hr><li>' +
  'address:<br>' +
  '<textarea rows="2" name="out_address__NUM__" id="out_address__NUM__" class="input"></textarea><br>' +
  'amount: <input type="number" name="out_amount__NUM__" id="out_amount__NUM__" value="0" min="0" max="2100000000000000" step="1" /><br>' +
  '<div id="elementsOutput__NUM__" style="display:none">' +
    'asset:<br>' +
    '<textarea rows="1" name="out_asset__NUM__" id="out_asset__NUM__" class="input"></textarea><br>' +
    'nonce:<br>' +
    '<textarea rows="1" name="out_nonce__NUM__" id="out_nonce__NUM__" class="input"></textarea><br>' +
  '</div>' +
  '(locking script):<br>' +
  '<textarea rows="1" name="out_script__NUM__" id="out_script__NUM__" class="input"></textarea><br>';

const addTxInput = async function() {
  let num = 1;
  while (true) {
    const txidField = document.getElementById(`txid${num}`);
    if (!txidField) break;
    num++;
  }
  let value = txInputTemplate;
  value = value.replace(/__NUM__/ig, `${num}`);
  const txInputField = document.getElementById('tx-input');
  txInputField.insertAdjacentHTML('beforeend', value);
};

const addTxOutput = async function() {
  let num = 1;
  while (true) {
    const addrField = document.getElementById(`out_address${num}`);
    if (!addrField) break;
    num++;
  }
  let value = txOutputTemplate;
  value = value.replace(/__NUM__/ig, `${num}`);
  const txInputField = document.getElementById('tx-output');
  txInputField.insertAdjacentHTML('beforeend', value);
};

const decodeBtnField = document.getElementById('execCreate');
decodeBtnField.addEventListener('click', updateField);

const networkField = document.getElementById('network');
networkField.addEventListener('change', changeNetworkField);

const addInputField = document.getElementById('addInput');
addInputField.addEventListener('click', addTxInput);

const addOutputField = document.getElementById('addOutput');
addOutputField.addEventListener('click', addTxOutput);

Module['onRuntimeInitialized'] = async function() {
  const decoded = document.getElementById('created');
  if (Module['_cfdjsJsonApi']) {
    console.log('exist cfdjsJsonApi.');
    decoded.value = '';
  } else {
    console.log('cfdjsJsonApi not found!');
    decoded.value = 'WebAssembly load fail.';
  }
};

window.onload = function() {
  const decoded = document.getElementById('created');
  if (Module['_cfdjsJsonApi']) {
    decoded.value = '';
  } else {
    decoded.value = 'WebAssembly loading...';
  }
};
