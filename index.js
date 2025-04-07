//
//  index.js
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

import { api, mockApi } from "./lib/api.js";
import { fetchInfrastructure, fetchRawInfrastructure } from "./lib/context.js";

const target = process.argv[2];
const isRemote = process.argv[3] == 1; // local by default
if (!target) {
    console.error("Please provide a provider id or a file.js");
    process.exit(1);
}

let json;
if (target.endsWith(".js")) {
    const filename = target;
    json = fetchRawInfrastructure(target, null);
} else {
    const providerId = target;
    json = fetchInfrastructure(isRemote ? api : mockApi, providerId);
}
console.log(JSON.stringify(json, null, 2));
