
export const emailTemplate = (otp) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #333;">Whiteboard App</h1>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Your One-Time Password (OTP)</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">
          Please use the following OTP to verify your email address. This OTP is valid for 10 minutes.
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; color: #333; background-color: #fff; padding: 10px 20px; border: 1px dashed #ccc; border-radius: 5px;">
            ${otp}
          </span>
        </div>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">
          If you did not request this OTP, please ignore this email.
        </p>
      </div>
      <div style="text-align: center; margin-top: 20px;">
        <p style="color: #aaa; font-size: 12px;">&copy; 2025 Whiteboard App. All rights reserved.</p>
      </div>
    </div>
  `;
};
