export const getTokenDynamicPart = (token: string) => {
    const firstDotIndex = token.indexOf('.')
    return token.substring(firstDotIndex + 1)
}