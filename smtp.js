const smtpServer = require('smtp-server').SMTPServer;
const simpleParser = require('mailparser').simpleParser;
const base64id = require('base64id');
const config = require('./config');
const { Email } = require('./schemas');

const server = new smtpServer({
    name: base64id.generateId(),
    logger: false,
    authOptional: true,
    disabledCommands: ["AUTH"],
    disableReverseLookup: true,

    onConnect(session, callback) {
        // accept connection
        return callback();
    },

    onMailFrom(address, session, callback) {
        // accept email
        return callback();
    },

    onRcptTo(address, session, callback) {
        // only accept emails with the configured domains
        if (config.domains.indexOf(address.address.split('@')[1]) === -1) {
            return callback(new Error("domain is not allowed"));
        }

        return callback();
    },

    onData(stream, session, callback) {
        // parse email
        try {
            var emailData = "";
            stream.on("data", dataChunk => { emailData += dataChunk; }); // append data
            stream.on("end", () => {
                // parsing complete
                simpleParser(emailData).then(async (mail) => {
                    if (config.logEmails) console.log(`[${new Date().toISOString().substring(11, 19)}] ${mail.from.text} -> ${mail.to.text} (${mail.subject})`);
                    
                    var mailId = base64id.generateId();
                    var newEmail = new Email({
                        id: mailId,
                        from: mail.from.text,
                        to: mail.to.text,
                        subject: mail.subject,
                        text: mail.text
                    });
                    
                    await newEmail.save();
                }).catch(err => { console.log(err); });
            });

            return callback();
        } catch { }
    }
});

server.on("error", err => {
    console.log(err);
});

module.exports = () => {
    server.listen(config.smtpPort, () => {
        console.log(`SMTP server listening on port ${config.smtpPort}`);
    });
}