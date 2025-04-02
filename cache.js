//
//  cache.js
//  PassepartoutKit
//
//  Created by Davide De Rosa on 4/3/25.
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

import { api, mockApi, allProviders } from "./lib/api.js";
import { fetchInfrastructure } from "./lib/context.js";
import { mkdir, writeFile } from "fs/promises";

const isRemote = process.argv[2] == 1; // local by default
const cachedIds = process.env.CACHE_IDS ? process.env.CACHE_IDS.split(",") : [];

async function cacheProvidersInParallel() {
    try {
        // opt out
        //const targetIds = allProviders(".")
        //    .filter(id => !cachedIds.has(id));

        // opt in
        const targetIds = cachedIds;

        const writePromises = targetIds
            .map(async providerId => {
                const providerPath = `cache/api/providers/${providerId}`;
                await mkdir(providerPath, { recursive: true });
                const dest = `${providerPath}/fetch.json`;
                const json = fetchInfrastructure(isRemote ? api : mockApi, providerId);
                const minJSON = JSON.stringify(json);
                return writeFile(dest, minJSON, "utf8");
            });

        await Promise.all(writePromises);

        console.log("All files written successfully");
    } catch (error) {
        console.error("Error writing files:", error);
    }
}

await cacheProvidersInParallel();
