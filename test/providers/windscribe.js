//
//  windscribe.js
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
import * as setup from "../setup.js";

describe("windscribe", () => {
    const json = setup.fetchMockInfrastructure("windscribe");
    const infra = json.response;

    it("should have 1 preset", () => {
        assert.strictEqual(infra.presets.length, 1);
    });
    it("should have 72 servers", () => {
        assert.strictEqual(infra.servers.length, 72);
    });
    it("preset 0 should use GCM and 6 endpoints", () => {
        const preset = infra.presets[0];
        assert.strictEqual(preset.moduleType, "OpenVPN");
        const template = setup.templateFrom(preset);
        const cfg = template.configuration;
        assert.strictEqual(cfg.cipher, "AES-256-GCM");
        assert.strictEqual(cfg.digest, "SHA512");
        assert.deepStrictEqual(template.endpoints, [
            "UDP:443",
            "UDP:80",
            "UDP:53",
            "UDP:1194",
            "UDP:54783",
            "TCP:443",
            "TCP:587",
            "TCP:21",
            "TCP:22",
            "TCP:80",
            "TCP:143",
            "TCP:3306",
            "TCP:8080",
            "TCP:54783",
            "TCP:1194"
        ]);
    });
});
