def convert(version, endpoint, json)
    pools = json["pools"].dup

    categories = {
        default: {
            groups: {}
        }
    }

    pools.each { |p|
        p = p.dup
        category_name = p["category"] || :default
        category = categories[category_name] || {groups: {}}

        # pick first
        if p.key?("presets")
            category["presets"] = p["presets"]
            p.delete("presets")
        end

        group_key = p["country"].dup

        groups = category[:groups]
        group = groups[group_key]
        if group.nil?
            group = {
                "country": p["country"],
            }
            pools = []
        else
            pools = group["pools"]
        end

        p.delete("category")
        #p.delete("country")
        #p.delete("area")
        p.delete("name")

        pools << p
        group["pools"] = pools
        groups[group_key] = group
        category[:groups] = groups

        categories[category_name] = category
    }

    categories_linear = []
    categories.each { |k, v|
        if k == :default
            k = ""
        end
        obj = {
            name: k,
            groups: v[:groups].values
        }
        if v.key?("presets")
            obj["presets"] = v["presets"]
        end
        categories_linear << obj
    }

    json.delete("pools")
    json["categories"] = categories_linear
    return json
end
