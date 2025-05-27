import FormData from "form-data"; // form-data v4.0.1
import Mailgun from "mailgun.js"; // mailgun.js v11.1.0

async function sendSimpleMessage() {
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: "api",
    key: import.meta.env.VITE_MAILGUN_API_KEY || "API_KEY",
    // When you have an EU-domain, you must specify the endpoint:
    // url: "https://api.eu.mailgun.net"
  });
  try {
    const data = await mg.messages.create("sandbox8e97fa9b407c4f4c9e06824253ae5088.mailgun.org", {
      from: "Mailgun Sandbox <postmaster@sandbox8e97fa9b407c4f4c9e06824253ae5088.mailgun.org>",
      to: ["Uttam Bansal <uttambansal345@gmail.com>"],
      subject: "Hello Uttam Bansal",
      text: "Congratulations Uttam Bansal, you just sent an email with Mailgun! You are truly awesome!",
    });

    console.log(data); // logs response data
  } catch (error) {
    console.log(error); //logs any error
  }
}

export default sendSimpleMessage;