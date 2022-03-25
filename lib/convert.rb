def convert(version, endpoint, json)
    servers = json["servers"].dup

    categories = {
        default: {
            locations: {}
        }
    }

    servers.each { |p|
        p = p.dup
        category_name = p["category"] || :default
        category = categories[category_name] || {locations: {}}

        # pick first
        if p.key?("presets")
            category["presets"] = p["presets"]
            p.delete("presets")
        end

        location_key = p["country"].dup

        locations = category[:locations]
        location = locations[location_key]
        if location.nil?
            location = {
                "country": p["country"],
            }
            servers = []
        else
            servers = location["servers"]
        end

        p.delete("category")
        #p.delete("country")
        #p.delete("area")
        p.delete("name")

        servers << p
        location["servers"] = servers
        locations[location_key] = location
        category[:locations] = locations

        categories[category_name] = category
    }

    categories_linear = []
    categories.each { |k, v|
        if k == :default
            k = ""
        end
        obj = {
            name: k,
            locations: v[:locations].values
        }
        if v.key?("presets")
            obj["presets"] = v["presets"]
        end
        categories_linear << obj
    }

    json.delete("servers")
    json["categories"] = categories_linear
    return json
end
