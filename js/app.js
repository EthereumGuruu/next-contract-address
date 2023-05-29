const addressRegex = /^0x[0-9a-fA-F]{40}$/;

document.getElementById('no-submit').addEventListener('submit', (e) => e.preventDefault());
function autofillAddress() {
    window.ethereum.request({ method: 'eth_requestAccounts' }).then(accs => {
        document.getElementById('wallet-address').value = accs[0];
    });
}

function updateNonceAutofill() {
    const customNonce = document.getElementById('toggle-nonce-autofill').checked;
    document.getElementById('if-custom-nonce').style.display = (customNonce) ? 'inline-block' : 'none';
}

async function getNonce(address) {
    const result = await window.ethereum.request({
        method: 'eth_getTransactionCount',
        params: [address]
    });
    return parseInt(result, 16);
}
async function generateNonce() {
    const isCustomNonce = document.getElementById('toggle-nonce-autofill').checked;
    const customNonce = document.getElementById('custom-nonce').value;
    const address = document.getElementById('wallet-address').value;
    let error = false;
    if (!addressRegex.test(address)) {
        setError('wallet-address', 'Invalid address');
        error = true;
    }
    if (isCustomNonce && isNaN(customNonce)) {
        setError('custom-nonce', 'Invalid nonce');
        error = true;
    }
    if (error) {
        return;
    }

    const nonce = (isCustomNonce) ? parseInt(customNonce) : await getNonce(address);

    const anticipatedAddress = ethers.utils.getContractAddress({
        from: address,
        nonce,
    });
    const code = document.createElement('code');
    code.innerText = anticipatedAddress;
    document.getElementById('result').innerHTML = '';
    document.getElementById('result').appendChild(code);
}

function setError(id, message) {
    console.log('error', {id, message});
}