[![Unit Tests](https://github.com/passepartoutvpn/api-source/actions/workflows/test.yml/badge.svg)](https://github.com/passepartoutvpn/api-source/actions/workflows/test.yml)
[![Publish](https://github.com/passepartoutvpn/api-source/actions/workflows/publish.yml/badge.svg)](https://github.com/passepartoutvpn/api-source/actions/workflows/publish.yml)
[![Cache](https://github.com/passepartoutvpn/api-source/actions/workflows/cache.yml/badge.svg)](https://github.com/passepartoutvpn/api-source/actions/workflows/cache.yml)

# Passepartout API

These files generate the API for the [Passepartout][about-app] client.

## Installation

### Requirements

- Node.js

### Testing

Install the package:

```sh
npm install
```

Fetch the infrastructure of a provider from mocks:

```sh
npm run fetch hideme
```

or from the real provider API:

```sh
npm run fetch hideme 1
```

Run the tests against the mocks:

```sh
npm test
```

## Contributing

The latest target is `api/v6`, perform the steps below in that folder.

### New providers

#### index.json

The first step is a new entry in [index.json](/api/v6/index.json) following [this format][github-provider]. The metadata is a map of maps, where the key is the module type that the provider supports. At the time of writing, only the "OpenVPN" type is recognized.

Example:

```json
{
    "id": "myprovider",
    "description": "My Provider",
    "metadata": {
        "OpenVPN": {}
    }
}
```

#### getInfrastructure()

Next, you need to return the servers infrastructure in [this format][github-provider-infrastructure] from a JavaScript function called `getInfrastructure()`, then encapsulated in a [ScriptResult][github-engine-script-result].

Example:

```json
{
    "response": {
        "presets": [],
        "servers": []
    }
}
```

where `presets` and `servers` are arrays of [ProviderPreset][github-provider-preset] and [ProviderServer][github-provider-server], respectively. More on the `templateData` field below.

You now have two options:

1. Build the infrastructure statically, e.g. [TunnelBear](/api/v6/providers/tunnelbear.js)
2. Fetch the response of a provider public API with `getJSON(url)`, then convert it to the above format, e.g. [Hide.me](api/v6/providers/hideme.js)

#### Presets

The format of `preset.templateData` is a Base64-encoded JSON whose format depends on `preset.moduleType`. If the module type is `OpenVPN`, then this is the [expected template format][github-openvpn-template], where the inner OpenVPN configuration follows [this format][github-openvpn-configuration].

Example:

```json
{
    "providerId": "My Provider",
    "presetId": "mypreset",
    "description": "My Preset",
    "moduleType": "OpenVPN",
    "templateData": jsonToBase64({
        "configuration": {
            "ca": "...",
            "cipher": "AES-256-CBC",
            "tlsWrap": openVPNTLSWrap("auth", "...")
        },
        "endpoints": [
            "UDP:20000", "UDP:30000", "TCP:40000"
        ]
    }
}
```

where `jsonToBase64(json)` and `openVPNTLSWrap(strategy, key)` are API built-ins.

#### Unit tests

Lastly, it's highly desirable that you add some basic unit tests in `test/providers`. You may refer to the existing tests, they should be pretty straightforward.

## License

Copyright (c) 2025 Davide De Rosa. All rights reserved.

This project is licensed under the [MIT][license-content].

### Contributing

By contributing to this project you are agreeing to the terms stated in the [Contributor License Agreement (CLA)][contrib-cla].

## Contacts

Twitter: [@keeshux][about-twitter]

Website: [passepartoutvpn.app][about-website]

[license-content]: LICENSE
[contrib-cla]: CLA.rst

[github-provider]: https://github.com/passepartoutvpn/partout/blob/master/Sources/API/Provider.swift
[github-provider-infrastructure]: https://github.com/passepartoutvpn/partout/blob/master/Sources/API/ProviderInfrastructure.swift
[github-provider-preset]: https://github.com/passepartoutvpn/partout/blob/master/Sources/Providers/ProviderPreset.swift
[github-provider-server]: https://github.com/passepartoutvpn/partout/blob/master/Sources/Providers/ProviderServer.swift
[github-engine-script-result]: https://github.com/passepartoutvpn/partout/blob/master/Sources/API/APIEngine.swift#L97
[github-openvpn-template]: https://github.com/passepartoutvpn/partout/blob/master/Sources/Partout/Providers/OpenVPN%2BProviders.swift#L45
[github-openvpn-configuration]: https://github.com/passepartoutvpn/partout/blob/master/Sources/OpenVPN/Base/OpenVPN%2BConfiguration.swift#L145

[about-app]: https://github.com/passepartoutvpn/passepartout
[about-twitter]: https://twitter.com/keeshux
[about-website]: https://passepartoutvpn.app
