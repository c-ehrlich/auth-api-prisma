// could also use push notifications, sms, etc here but email is easiest
// we're just using a fake smtp server here
// if deploying to production, use a real mail service that sends emails that don't get blocked
import nodemailer, { SendMailOptions } from 'nodemailer';
import config from 'config';
import log from './logger';

const smtp = config.get<{
  user: string;
  pass: string;
  host: string;
  port: number;
  secure: boolean;
}>('smtp');

// we want to do this here instead of inside sendMail so it only
// creates one transporter when the server starts
const transporter = nodemailer.createTransport({
  ...smtp,
  auth: { user: smtp.user, pass: smtp.pass },
});

async function sendEmail(payload: SendMailOptions) {
  // go to sendMailOptions => Options to see all the options you can put into payload
  transporter.sendMail(payload, (err, info) => {
    if (err) {
      log.error(err, 'Error sending email');
      return;
    }

    log.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  });
}

export default sendEmail;

// // create and log to console test credentials
// // use this if another set of credentials is needed
// async function createTestCreds() {
//   const creds = await nodemailer.createTestAccount();
//   console.log({ creds });
// }
// createTestCreds();
