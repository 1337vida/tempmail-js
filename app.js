const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const config = require("./config");
const smtp = require("./smtp");
const { Email } = require("./schemas");
const app = express();

if (config.logRequests) app.use(morgan("common"));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    const API_KEY = req.get("Authorization");
    if (!API_KEY || API_KEY !== config.apiKey) {
        res.status(401).json({ code: 403, error: "missing or invalid key" });
    }

    next();
});

app.get('/', (req, res) => {
    res.json({
        "status": 200,
        "app": "tempmail.js"
    });
});

app.get('/api', (req, res) => {
    res.send("fatal: failed to process api request");
});

app.get("/api/domains", async (req, res) => {
    res.json({
        code: 200,
        domains: config.domains
    });
});

app.get("/api/:inbox", async (req, res) => {
    const inbox = req.params.inbox;
    const emailCount = await Email.countDocuments({ to: inbox });

    res.json({
        code: 200,
        inbox,
        emailCount
    });
});

app.get("/api/:inbox/list", async (req, res) => {
    const inbox = req.params.inbox;
    if (!inbox) return res.json({ code: 400, error: "email is a required argument" });

    const emails = await Email.find({ to: inbox }).sort("-time");
    if (!emails) return res.json({ code: 404, error: "no emails found" });
    var out = emails.map(email => { return { id: email.id, from: email.from, subject: email.subject } });

    res.json({ code: 200, emails: out });
})

app.get("/api/:inbox/latest", async (req, res) => {
    const inbox = req.params.inbox;
    if (!inbox) return res.json({ code: 400, error: "email is a required argument" });

    const email = await Email.findOne({ to: inbox }).sort("-time");
    if (!email) return res.json({ code: 404, error: "no emails found" });

    var obj = { from: email.from, text: email.text, id: email.id };
    
    res.json(obj);
    if (config.deleteEmailAfterRead) email.remove();
});

app.get("/api/:inbox/:emailId", async (req, res) => {
    const inbox = req.params.inbox;
    const emailId = req.params.emailId;
    if (!inbox || !emailId) return res.json({ code: 400, error: "inbox and emailId are required arguments" });

    const email = await Email.findOne({ id: emailId, to: inbox });
    if (!email) return res.json({ code: 404, error: "no email found" });
    
    res.json({
        code: 200,
        id: email.id,
        from: email.from,
        subject: email.subject,
        text: email.text
    });

    if (config.deleteEmailAfterRead) email.remove();
});

app.listen(config.webPort, async () => {
    console.log("  __                                       .__.__            __        ");
    console.log("_/  |_  ____   _____ ______   _____ _____  |__|  |          |__| ______");
    console.log("\\   __\\/ __ \\ /     \\\\____ \\ /     \\\\__  \\ |  |  |          |  |/  ___/");
    console.log(" |  | \\  ___/|  Y Y  \\  |_> >  Y Y  \\/ __ \\|  |  |__        |  |\\___ \\ ");
    console.log(" |__|  \\___  >__|_|  /   __/|__|_|  (____  /__|____/ /\\ /\\__|  /____  >");
    console.log("           \\/      \\/|__|         \\/     \\/          \\/ \\______|    \\/ \n\n");
    console.log(`Express server listening on port ${config.webPort}, API key: ${config.apiKey}`);
    smtp(); // initialize smtp server

    await mongoose.connect(config.mongoDbUrl, { useUnifiedTopology: true, useNewUrlParser: true }).then(() => {
        console.log("Connected to MongoDB");
    }).catch(err => { console.log(err); });
}); 