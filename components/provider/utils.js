export function logo (provider) {
    if (!provider) return
    return (
        provider &&
        provider.j &&
        provider.j !== null &&
        provider.j.logo &&
        provider.j.logo !== '' &&
        provider.j.logo !== null &&
        `${process.env.VUE_APP_IMAGES}providers/${provider.j.logo}`
    )
}

export function avatar (provider) {
    if (!provider) return
    return (
        (
            provider &&
            provider.j &&
            provider.j !== null &&
            provider.j.avatar &&
            provider.j.avatar !== '' &&
            provider.j.avatar !== null &&
            `${process.env.VUE_APP_IMAGES}providers/${provider.j.avatar}`
        ) || logo(provider)
    )
}