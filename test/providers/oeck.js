//
//  oeck.js
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

describe("oeck", () => {
    const json = fetchInfrastructure(apiRoot, "oeck", localRoot);
    const infra = json.response;

    it("should have 2 presets", () => {
        assert.strictEqual(infra.presets.length, 2);
    });
    it("should have 3 servers", () => {
        assert.strictEqual(infra.servers.length, 3);
    });
    it("preset 0 should use CBC and 2 endpoints", () => {
        const preset = infra.presets[0];
        assert.strictEqual(preset.moduleType, "OpenVPN");
        const template = templateFrom(preset);
        const cfg = template.configuration;
        assert.strictEqual(cfg.cipher, "AES-128-CBC");
        assert.strictEqual(cfg.digest, "SHA256");
        assert.deepStrictEqual(template.endpoints, [
            "UDP:1196", "TCP:445"
        ]);
    });
    it("preset 1 should use GCM and 2 endpoints", () => {
        const preset = infra.presets[1];
        assert.strictEqual(preset.moduleType, "OpenVPN");
        const template = templateFrom(preset);
        const cfg = template.configuration;
        assert.strictEqual(cfg.cipher, "AES-256-GCM");
        assert.strictEqual(cfg.digest, "SHA256");
        assert.deepStrictEqual(template.endpoints, [
            "UDP:1194", "TCP:443"
        ]);
    });
});
