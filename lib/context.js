//
//  context.js
//  Partout
//
//  Created by Davide De Rosa on 3/30/25.
//  Copyright (c) 2025 Davide De Rosa. All rights reserved.
//
//  https://github.com/passepartoutvpn
//
//  This file is part of Partout.
//
//  Partout is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  Partout is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with Partout.  If not, see <http://www.gnu.org/licenses/>.
//

import fs from "fs";
import vm from "vm";
import request from "sync-request";

function runSandboxedScript(code, injectedFunctions = {}) {
    const sandbox = { ...injectedFunctions };
    const context = vm.createContext(sandbox);
    return vm.runInContext(code, context);
}

function fetchScriptPath(root, providerId, forCache) {
    try {
        if (forCache) {
            const name = `${providerId}.cache.js`;
            const cachePath = `${root}/${name}`;
            fs.accessSync(cachePath);
            return cachePath;
        }
    } catch {
        //
    }
    const name = `${providerId}.js`;
    return `${root}/${name}`;
}

export function fetchInfrastructure(api, providerId, options) {
    const scriptRoot = `${api.root}/${api.version}/providers`;
    const scriptPath = fetchScriptPath(scriptRoot, providerId, options && options.forCache);
    const optionsCopy = { ...options };
    if (api.mockRoot) {
        optionsCopy.mockPath = `${api.mockRoot}/${api.version}/providers/${providerId}/fetch.json`;
    }
    return fetchRawInfrastructure(scriptPath, optionsCopy);
}

export function fetchRawInfrastructure(scriptPath, options) {
    const script = fs.readFileSync(scriptPath, "utf8");
    const referenceDate = new Date("2001-01-01T00:00:00Z");

    function getResult(url) {
        if (options.mockPath) {
            const data = fs.readFileSync(options.mockPath, "utf8");
            return {
                data: data
            }
        }
        const response = request("GET", url);
        const data = response.getBody("utf8");
        // console.log(response.headers);
        const lastModified = response.headers["last-modified"];
        const tag = response.headers["etag"];
        const lastUpdate = lastModified ? ((new Date(lastModified) - referenceDate) / 1000.0) : undefined;
        const cache = {
            lastUpdate: lastUpdate,
            tag: tag
        };
        return {
            data: data,
            cache: cache
        };
    }

    const injectedFunctions = {
        getText(url) {
            const result = getResult(url);
            return {
                response: result.data,
                cache: result.cache
            };
        },
        getJSON(url) {
            const result = getResult(url);
            const json = JSON.parse(result.data);
            return {
                response: json,
                cache: result.cache
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
    const json = runSandboxedScript(wrappedScript, injectedFunctions);
    if (options.responseOnly) {
        return json.response;
    }
    return json;
}
