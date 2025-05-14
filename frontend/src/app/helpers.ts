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

export const formatNumber = (value: number) => {
  let formattedValue
  let suffix

  switch (true) {
    case value > 1000000000000:
      formattedValue = value / 1000000000000
      suffix = 'T'
      break
    case value > 1000000000:
      formattedValue = value / 1000000000
      suffix = 'B'
      break
    case value > 1000000:
      formattedValue = value / 1000000
      suffix = 'M'
      break
    default:
      return value
  }

  return formattedValue.toFixed(2) + suffix
}

export const capitalizeFirstLettter = (str: string) => {
  if (!str) return
  return str.charAt(0).toUpperCase() + str.slice(1)
}
