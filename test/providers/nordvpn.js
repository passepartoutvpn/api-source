//
//  nordvpn.js
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

describe("nordvpn", () => {
    const json = setup.fetchMockInfrastructure("nordvpn");
    const infra = json.response;

    it("should have 2 presets", () => {
        assert.strictEqual(infra.presets.length, 2);
    });
    it("should have 1 servers", () => {
        assert.strictEqual(infra.servers.length, 1);
    });
    it("preset 0 should use CBC and 1 endpoint", () => {
        const preset = infra.presets[0];
        assert.strictEqual(preset.moduleType, "OpenVPN");
        const template = setup.templateFrom(preset);
        const cfg = template.configuration;
        assert.strictEqual(cfg.cipher, "AES-256-CBC");
        assert.strictEqual(cfg.digest, "SHA512");
        assert.deepStrictEqual(template.endpoints, [
            "UDP:1194"
        ]);
    });
    it("preset 1 should use CBC and 1 endpoint", () => {
        const preset = infra.presets[1];
        assert.strictEqual(preset.moduleType, "OpenVPN");
        const template = setup.templateFrom(preset);
        const cfg = template.configuration;
        assert.strictEqual(cfg.cipher, "AES-256-CBC");
        assert.strictEqual(cfg.digest, "SHA512");
        assert.deepStrictEqual(template.endpoints, [
            "TCP:443"
        ]);
    });
});
