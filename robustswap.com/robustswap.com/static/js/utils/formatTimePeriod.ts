import getTimePeriods from './getTimePeriods'

/**
 * @param {Object} periods Return value from getTimePeriods
 * @return {string} '14h 3m 4s'
 */
const formatTimePeriod = (periods: ReturnType<typeof getTimePeriods>, excludePeriods = []) => {
  const textArr = []

  Object.keys(periods).forEach((period) => {
    if (periods[period] > 0 && !excludePeriods.includes(period)) {
      textArr.push(`${periods[period]}${period.substr(0, 1)}`)
    }
  })

  if (textArr.length === 0) {
    return null
  }

  return textArr.join(' ')
}

export const zeroPad = (number: number) => {
  let numberStr = number.toString()

  if (number === 0) {
    numberStr = '00'
  } else if (number < 10) {
    numberStr = `0${number}`
  }

  return numberStr
}

/**
 * @param {Object} periods Return value from getTimePeriods
 * @return {string} '00:00:00'
 */
export const formatTimePeriodCountdown = (periods: ReturnType<typeof getTimePeriods>) => {
  const hours = periods.hours + periods.days * 24;
  return `${zeroPad(hours)}:${zeroPad(periods.minutes)}:${zeroPad(periods.seconds)}`
}

export default formatTimePeriod
