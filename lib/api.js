//
//  api.js
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

export const api = {
    version: "v6",
    root: "api",
    index: "index.json"
};

export const mockApi = { ...api };
mockApi.mockRoot = "test/mock";

export function allProviders(root) {
    const excludedProviders = new Set([]);
    const apiIndex = `${root}/${api.root}/${api.version}/index.json`;
    const data = JSON.parse(fs.readFileSync(apiIndex, "utf8"));
    return data.providers
        .map(provider => provider.id)
        .filter(id => !excludedProviders.has(id));
}
