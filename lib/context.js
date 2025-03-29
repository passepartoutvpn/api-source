//
//  context.js
//  PassepartoutKit
//
//  Created by Davide De Rosa on 3/30/25.
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

import fs from "fs";
import vm from "vm";
import request from "sync-request";

function runSandboxedScript(code, injectedFunctions = {}) {
    const sandbox = { ...injectedFunctions };
    const context = vm.createContext(sandbox);
    return vm.runInContext(code, context);
}

export function fetchInfrastructure(apiRoot, providerId, localRoot) {
    const scriptPath = `${apiRoot}/providers/${providerId}/fetch.js`;
    const script = fs.readFileSync(scriptPath, "utf8");
    const infraPath = localRoot ? `${localRoot}/providers/${providerId}/fetch.json` : null;

    function getResult(url) {
        if (infraPath) {
            return fs.readFileSync(infraPath, "utf8");
        }
        const response = request("GET", url);
        return response.getBody("utf8");
    }

    const injectedFunctions = {
        getText(url) {
            const result = getResult(url);
            return {
                response: result
            };
        },
        getJSON(url) {
            const result = getResult(url);
            const json = JSON.parse(result);
            return {
                response: json
            };
        },
        jsonToBase64(object) {
            try {
                const jsonString = JSON.stringify(object);
                return Buffer.from(jsonString).toString("base64");
            } catch (error) {
                console.error(`JS.jsonToBase64: Unable to serialize: ${error}`);
                return null;
            }
        },
        ipV4ToBase64(ip) {
            const bytes = ip.split(".").map(Number);
            if (bytes.length !== 4 || bytes.some(isNaN)) {
                console.error("JS.ipV4ToBase64: Not a valid IPv4 string");
                return null;
            }
            return Buffer.from(bytes).toString("base64");
        },
        openVPNTLSWrap(strategy, file) {
            const hex = file.trim().split("\n").join("");
            const key = Buffer.from(hex, "hex");
            if (key.length !== 256) {
                console.error("JS.openVPNTLSWrap: Static key must be 32 bytes long");
                return null;
            }
            return {
                strategy: strategy,
                key: {
                    dir: 1,
                    data: key.toString("base64")
                }
            };
        }
    };

    const wrappedScript = `
        ${script}
        getInfrastructure();
    `;
    return runSandboxedScript(wrappedScript, injectedFunctions);
}
