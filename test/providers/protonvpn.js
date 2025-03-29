//
//  protonvpn.js
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

describe("protonvpn", () => {
    const json = fetchInfrastructure(apiRoot, "protonvpn", localRoot);
    const infra = json.response;

    it("should have 1 preset", () => {
        assert.strictEqual(infra.presets.length, 1);
    });
    it("should have 2 servers", () => {
        assert.strictEqual(infra.servers.length, 2);
    });
    it("preset 0 should use CBC and 10 endpoints", () => {
        const preset = infra.presets[0];
        assert.strictEqual(preset.moduleType, "OpenVPN");
        const template = templateFrom(preset);
        const cfg = template.configuration;
        assert.strictEqual(cfg.cipher, "AES-256-CBC");
        assert.strictEqual(cfg.digest, "SHA512");
        assert.deepStrictEqual(template.endpoints, [
            "UDP:80", "UDP:443", "UDP:1194", "UDP:4569", "UDP:5060",
            "TCP:80", "TCP:443", "TCP:1194", "TCP:4569", "TCP:5060",
        ]);
    });
});
