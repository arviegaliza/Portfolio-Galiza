const Brevo = require("@getbrevo/brevo");

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY,
);

console.log("===== BREVO API CONFIG =====");
console.log("BREVO API KEY exists:", !!process.env.BREVO_API_KEY);

module.exports = apiInstance;
