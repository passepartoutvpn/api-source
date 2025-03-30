//
//  fetch.js
//  PassepartoutKit
//
//  Created by Davide De Rosa on 3/28/25.
//  Copyright (c) 2025 Davide De Rosa. All rights reserved.
//
//  https://github.com/passepartoutvpn
//
//  This file is part of PassepartoutKit.
//
//  PassepartoutKit is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  PassepartoutKit is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with PassepartoutKit.  If not, see <http://www.gnu.org/licenses/>.
//

function getInfrastructure() {
    const providerId = "vyprvpn";
    const openVPN = {
        moduleType: "OpenVPN",
        presetIds: {
            recommended: "default"
        }
    };

    // XXX: hardcoded servers
    // https://support.vyprvpn.com/hc/en-us/articles/360037728912-What-are-the-VyprVPN-server-addresses-
    const countriesCSV = `
Algiers|DZ|dz1
Amsterdam|EU|eu1
Athens|GR|gr1
Auckland|NZ|nz1
Austin, TX|US|us3
Bangkok|TH|th1
Bogotá|CO|co1
Bratislava|SK|sk1
Brussels|BE|be1
Bucharest|RO|ro1
Buenos Aires|AR|ar1
Cairo|EG|eg1
Chicago, IL|US|us6
Copenhagen|DK|dk1
Doha|QA|qa1
Dubai|AE|ae1
Dublin|IE|ie1
Frankfurt|DE|de1
Hanoi|VN|vn1
Helsinki|FI|fi1
Hong Kong|HK|hk1
Istanbul|TR|tr1
Jakarta|ID|id1
Karachi|PK|pk1
Kiev|UA|ua1
Kuala Lumpur|MY|my1
Lisbon|PT|pt1
Ljubljana|SI|si1
London|GB|uk1
Los Angeles, CA|US|us1
Luxembourg City|LU|lu1
Macau|MO|mo1
Madrid|ES|es1
Majuro|MH|mh1
Malé|MV|mv1
Manama|BH|bh1
Manila|PH|ph1
Melbourne|AU|au2
Mexico City|MX|mx1
Miami, FL|US|us4
Montevideo|UY|uy1
Moscow|RU|ru1
Mumbai|IN|in1
New York City, NY|US|us5
Oslo|NO|no1
Panama City|PA|pa1
Paris|FR|fr1
Perth|AU|au3
Prague|CZ|cz1
Reykjavík|IS|is1
Riga|LV|lv1
Riyadh|SA|sa1
Rome|IT|it1
San Francisco, CA|US|us7
San José|CR|cr1
San Salvador|SV|sv1
São Paulo|BR|br1
Schaan|LI|li1
Seattle, WA|US|us8
Seoul|KR|kr1
Singapore|SG|sg1
Sofia|BG|bg1
Stockholm|SE|se1
Sydney|AU|au1
Taipei|TW|tw1
Tel Aviv|IL|il1
Tokyo|JP|jp1
Toronto|CA|ca1
Vienna|AT|at1
Vilnius|LT|lt1
Warsaw|PL|pl1
Washington, DC|US|us2
Zurich|CH|ch1
`
    const lines = countriesCSV.split("\n");

    const servers = [];
    for (const line of lines) {
        const comps = line.split("|");
        if (comps.length < 3) {
            continue;
        }
        const id = comps[2];
        const countryCode = comps[1];
        const area = comps[0];
        const hostname = `${id}.vyprvpn.com`;
        const server = {
            serverId: id,
            hostname: hostname,
            supportedModuleTypes: [openVPN.moduleType]
        };
        const metadata = {
            providerId: providerId,
            countryCode: countryCode,
            categoryName: "Default",
            area: area
        };
        server.metadata = metadata;

        servers.push(server);
    }

    const presets = getOpenVPNPresets(providerId, openVPN.moduleType, openVPN.presetIds);

    return {
        response: {
            presets: presets,
            servers: servers
        }
    };
}

// MARK: OpenVPN

function getOpenVPNPresets(providerId, moduleType, presetIds) {
    const ca = `
-----BEGIN CERTIFICATE-----
MIIGDjCCA/agAwIBAgIJAL2ON5xbane/MA0GCSqGSIb3DQEBDQUAMIGTMQswCQYD
VQQGEwJDSDEQMA4GA1UECAwHTHVjZXJuZTEPMA0GA1UEBwwGTWVnZ2VuMRkwFwYD
VQQKDBBHb2xkZW4gRnJvZyBHbWJIMSEwHwYDVQQDDBhHb2xkZW4gRnJvZyBHbWJI
IFJvb3QgQ0ExIzAhBgkqhkiG9w0BCQEWFGFkbWluQGdvbGRlbmZyb2cuY29tMB4X
DTE5MTAxNzIwMTQxMFoXDTM5MTAxMjIwMTQxMFowgZMxCzAJBgNVBAYTAkNIMRAw
DgYDVQQIDAdMdWNlcm5lMQ8wDQYDVQQHDAZNZWdnZW4xGTAXBgNVBAoMEEdvbGRl
biBGcm9nIEdtYkgxITAfBgNVBAMMGEdvbGRlbiBGcm9nIEdtYkggUm9vdCBDQTEj
MCEGCSqGSIb3DQEJARYUYWRtaW5AZ29sZGVuZnJvZy5jb20wggIiMA0GCSqGSIb3
DQEBAQUAA4ICDwAwggIKAoICAQCtuddaZrpWZ+nUuJpG+ohTquO3XZtq6d4U0E2o
iPeIiwm+WWLY49G+GNJb5aVrlrBojaykCAc2sU6NeUlpg3zuqrDqLcz7PAE4OdNi
OdrLBF1o9ZHrcITDZN304eAY5nbyHx5V6x/QoDVCi4g+5OVTA+tZjpcl4wRIpgkn
WznO73IKCJ6YckpLn1BsFrVCb2ehHYZLg7Js58FzMySIxBmtkuPeHQXL61DFHh3c
TFcMxqJjzh7EGsWRyXfbAaBGYnT+TZwzpLXXt8oBGpNXG8YBDrPdK0A+lzMnJ4nS
0rgHDSRF0brx+QYk/6CgM510uFzB7zytw9UTD3/5TvKlCUmTGGgI84DbJ3DEvjxb
giQnJXCUZKKYSHwrK79Y4Qn+lXu4Bu0ZTCJBje0GUVMTPAvBCeDvzSe0iRcVSNMJ
VM68d4kD1PpSY/zWfCz5hiOjHWuXinaoZ0JJqRF8kGbJsbDlDYDtVvh/Cd4aWN6Q
/2XLpszBsG5i8sdkS37nzkdlRwNEIZwsKfcXwdTOlDinR1LUG68LmzJAwfNE47xb
rZUsdGGfG+HSPsrqFFiLGe7Y4e2+a7vGdSY9qR9PAzyx0ijCCrYzZDIsb2dwjLct
Ux6a3LNV8cpfhKX+s6tfMldGufPI7byHT1Ybf0NtMS1d1RjD6IbqedXQdCKtaw68
kTX//wIDAQABo2MwYTAdBgNVHQ4EFgQU2EbQvBd1r/EADr2jCPMXsH7zEXEwHwYD
VR0jBBgwFoAU2EbQvBd1r/EADr2jCPMXsH7zEXEwDwYDVR0TAQH/BAUwAwEB/zAO
BgNVHQ8BAf8EBAMCAYYwDQYJKoZIhvcNAQENBQADggIBAAViCPieIronV+9asjZy
o5oSZSNWUkWRYdezjezsf49+fwT12iRgnkSEQeoj5caqcOfNm/eRpN4G7jhhCcxy
9RGF+GurIlZ4v0mChZbx1jcxqr9/3/Z2TqvHALyWngBYDv6pv1iWcd9a4+QL9kj1
Tlp8vUDIcHMtDQkEHnkhC+MnjyrdsdNE5wjlLljjFR2Qy5a6/kWwZ1JQVYof1J1E
zY6mU7YLMHOdjfmeci5i0vg8+9kGMsc/7Wm69L1BeqpDB3ZEAgmOtda2jwOevJ4s
ABmRoSThFp4DeMcxb62HW1zZCCpgzWv/33+pZdPvnZHSz7RGoxH4Ln7eBf3oo2PM
lu7wCsid3HUdgkRf2Og1RJIrFfEjb7jga1JbKX2Qo/FH3txzdUimKiDRv3ccFmEO
qjndUG6hP+7/EsI43oCPYOvZR+u5GdOkhYrDGZlvjXeJ1CpQxTR/EX+Vt7F8YG+i
2LkO7lhPLb+LzgPAxVPCcEMHruuUlE1BYxxzRMOW4X4kjHvJjZGISxa9lgTY3e0m
noQNQVBHKfzI2vGLwvcrFcCIrVxeEbj2dryfByyhZlrNPFbXyf7P4OSfk+fVh6Is
1IF1wksfLY/6gWvcmXB8JwmKFDa9s5NfzXnzP3VMrNUWXN3G8Eee6qzKKTDsJ70O
rgAx9j9a+dMLfe1vP5t6GQj5
-----END CERTIFICATE-----
`;

    const cfg = {
        ca: ca,
        cipher: "AES-256-GCM",
        compressionFraming: 1,
        compressionAlgorithm: 1,
        keepAliveSeconds: 10,
        keepAliveTimeoutSeconds: 60,
        checksEKU: false
    };

    const recommended = {
        providerId: providerId,
        presetId: presetIds.recommended,
        description: "Default",
        moduleType: moduleType,
        templateData: jsonToBase64({
            configuration: cfg,
            endpoints: [
                "UDP:443"
            ]
        })
    };

    return [recommended]
}
