const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendConfirmationEmail = async (appointment) => {
  const { patient_name, patient_email, service_name, appointment_date, appointment_time } = appointment;

  const dateFormatted = new Date(appointment_date).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const timeFormatted = appointment_time.substring(0, 5);
  const [hour, min] = timeFormatted.split(':');
  const h = parseInt(hour);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  const timeDisplay = `${h12}:${min} ${ampm}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Appointment Confirmation</title>
    </head>
    <body style="margin:0;padding:0;background:#f4f6f9;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:30px 0;">
        <tr>
          <td align="center">
            <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
              <!-- Header -->
              <tr>
                <td style="background:#1B4F8A;padding:28px 36px;text-align:center;">
                  <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;letter-spacing:-0.3px;">🦷 SmileCare Dental</h1>
                  <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:13px;">Your smile is our priority</p>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:32px 36px;">
                  <p style="color:#1a1a2e;font-size:16px;margin:0 0 8px;">Hi <strong>${patient_name}</strong>,</p>
                  <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 24px;">Your appointment has been booked. We'll confirm it shortly. Please find the details below.</p>

                  <!-- Appointment card -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f5ff;border-radius:10px;border:1px solid #d6e4ff;margin-bottom:24px;">
                    <tr>
                      <td style="padding:20px 24px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding:8px 0;border-bottom:1px solid #dce8ff;">
                              <span style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Service</span><br>
                              <span style="color:#1a1a2e;font-size:15px;font-weight:600;">${service_name}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:8px 0;border-bottom:1px solid #dce8ff;">
                              <span style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Date</span><br>
                              <span style="color:#1a1a2e;font-size:15px;font-weight:600;">${dateFormatted}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:8px 0;">
                              <span style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Time</span><br>
                              <span style="color:#1a1a2e;font-size:15px;font-weight:600;">${timeDisplay}</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <p style="color:#555;font-size:13px;line-height:1.6;margin:0 0 24px;">
                    📍 <strong>SmileCare Dental Clinic</strong><br>
                    14, MG Road, Near Central Mall, Bangalore – 560001<br>
                    📞 +91 98765 43210
                  </p>

                  <p style="color:#888;font-size:12px;margin:0;">If you need to reschedule, please call us at least 2 hours before your appointment.</p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background:#f8f9fc;padding:16px 36px;text-align:center;border-top:1px solid #eee;">
                  <p style="color:#aaa;font-size:11px;margin:0;">© 2025 SmileCare Dental Clinic · Bangalore</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'SmileCare Dental <noreply@smilecare.in>',
      to: patient_email,
      subject: `Appointment Confirmed – ${service_name} on ${dateFormatted}`,
      html,
    });
    console.log(`Confirmation email sent to ${patient_email}`);
  } catch (err) {
    // Don't crash the server if email fails
    console.error('Email send failed:', err.message);
  }
};

module.exports = { sendConfirmationEmail };
