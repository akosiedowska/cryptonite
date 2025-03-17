export const getInitials = (username: string) => {
    const words = username.split(' ')
    let initials
    if (words.length >= 2) {
        initials = words.map(word => word.charAt(0)).join('')
    } else {
        initials = words[0].slice(0, 2)
    }

    return initials
}