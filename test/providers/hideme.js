//
//  hideme.js
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

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { fetchInfrastructure } from "../../lib/context.js";
import { apiRoot, localRoot, templateFrom } from "../setup.js";

describe("hideme", () => {
    const json = fetchInfrastructure(apiRoot, "hideme", localRoot);
    const infra = json.response;

    it("should have 1 preset", () => {
        assert.strictEqual(infra.presets.length, 1);
    });
    it("should have 7 servers", () => {
        assert.strictEqual(infra.servers.length, 7);
    });
    it("preset 0 should use CBC and 22 endpoints", () => {
        const preset = infra.presets[0];
        assert.strictEqual(preset.moduleType, "OpenVPN");
        const template = templateFrom(preset);
        const cfg = template.configuration;
        assert.strictEqual(cfg.cipher, "AES-256-CBC");
        assert.strictEqual(cfg.digest, "SHA256");
        assert.deepStrictEqual(template.endpoints, [
            "UDP:3000", "UDP:3010", "UDP:3020", "UDP:3030", "UDP:3040", "UDP:3050",
            "UDP:3060", "UDP:3070", "UDP:3080", "UDP:3090", "UDP:3100",
            "TCP:3000", "TCP:3010", "TCP:3020", "TCP:3030", "TCP:3040", "TCP:3050",
            "TCP:3060", "TCP:3070", "TCP:3080", "TCP:3090", "TCP:3100"
        ]);
    });
});
