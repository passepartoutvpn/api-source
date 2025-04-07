//
//  ivpn.js
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

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as setup from "../setup.js";

describe("ivpn", () => {
    const json = setup.fetchMockInfrastructure("ivpn");
    const infra = json.response;

    it("should have 1 preset", () => {
        assert.strictEqual(infra.presets.length, 1);
    });
    it("should have 2 servers", () => {
        assert.strictEqual(infra.servers.length, 2);
    });
    it("preset 0 should use CBC and 16 endpoints", () => {
        const preset = infra.presets[0];
        assert.strictEqual(preset.moduleType, "OpenVPN");
        const template = setup.templateFrom(preset);
        const cfg = template.configuration;
        assert.strictEqual(cfg.cipher, "AES-256-CBC");
        assert.strictEqual(cfg.digest, "SHA1");
        assert.deepStrictEqual(template.endpoints, [
            "UDP:53", "UDP:80", "UDP:123", "UDP:2049",
            "UDP:2050", "UDP:443", "UDP:1194", "TCP:80",
            "TCP:443", "TCP:1194", "TCP:2049", "TCP:2050",
            "TCP:30587", "TCP:41893", "TCP:48574", "TCP:58237"
        ]);
    });
});
