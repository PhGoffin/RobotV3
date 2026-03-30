const https = require("https");
const fs = require("fs");
const axios = require("axios");
const path = require('path');

//
// ✅ CONFIGURATION
//
const BASE = "https://rrnadmin.rrn:443";

const pathName = `../../../uploads/91_RRN Project/`;
const token = "test-env-acc.expl.rrn.fgov.be_8010_2025.p12";
const certificatePath = "C:/Apache24/htdocs/robotv3/uploads/91_RRN Project/test-env-acc.expl.rrn.fgov.be_8010_2025.p12"




const PFX_PASSWORD = "SopraSteria";   // put the correct password here

// ✅ Likely RRN / JBoss / SAML / legacy Java EE paths
const PATHS = [
    "/", "/index.do", "/index.jsp",
    "/RNADMIN32/", "/RNADMIN32/login", "/RNADMIN32/login/",
    "/RNADMIN32/login.do", "/RNADMIN32/login.jsp",
    "/RNADMIN32/auth/login.do", "/RNADMIN32/secure/login.do",
    "/RNADMIN32/pages/login.do", "/RNADMIN32/jsp/login.do",
    "/RNADMIN32/app/login.do",

    // Common Java EE admin or application roots
    "/RNADMIN", "/RNADMIN/", "/RNADMIN/login.do",
    "/admin", "/admin/", "/admin/login",
    "/login", "/login/", "/login.jsp",

    // Known JBoss / Undertow defaults
    "/console", "/management", "/server-status",

    // Paths found in internal Belgian gov systems
    "/RNADMIN32/home.do",
    "/RNADMIN32/home.jsp",
    "/RNADMIN32/menu.do",
    "/RNADMIN32/start.do",
    "/RNADMIN32/Start.do",
    "/RNADMIN32/default.do"
];

//
// ✅ HTTPS Agent with your mTLS certificate
//
const agent = new https.Agent({
    pfx: fs.readFileSync(certificatePath),
    passphrase: PFX_PASSWORD,
    rejectUnauthorized: false,
    minVersion: "TLSv1.2",
    maxVersion: "TLSv1.2",
    ciphers: "ECDHE-ECDSA-AES256-GCM-SHA384",
    honorCipherOrder: true
});

//
// ✅ Scanner Logic
//
async function scan() {
    console.log("🔍 Starting endpoint scan...\n");

    for (const path of PATHS) {
        const url = BASE + path;

        try {
            const response = await axios.get(url, {
                httpsAgent: agent,
                validateStatus: () => true, // accept all HTTP codes
            });

            const status = response.status;

            // Only show interesting results
            if (status !== 404) {
                console.log(
                    `✅ [${status}] ${path}   →  ${response.headers['content-type'] || ''}`
                );
            }

        } catch (err) {
            console.log(`❌ ERROR on ${path}: ${err.code || err.message}`);
        }
    }

    console.log("\n✅ Scan completed.");
}

scan();
