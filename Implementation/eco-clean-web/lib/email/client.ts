import { Resend } from "resend";

export async function sendEmail(to: string, subject: string, html: string) {
  const resend = new Resend("re_6nWQmufA_EH7ceAFLTSuixaAT3qc8d7kU");
  resend.emails.send({
    from: "admin@ecoclean.com",
    to,
    subject,
    html,
  });
}
