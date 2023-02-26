export function useHashtagBuilder(text) {
    let splitSpace = text.split(' ')
    let newText = ''
    for (let i = 0; i < splitSpace.length; i++) {
        let word = splitSpace[i]
        if (word.charAt(0).toString() !== '#') {
            newText += `#${word}`
        } else {
            newText += word
        }
        if (i < (splitSpace.length - 1)) {
            newText += ' '
        }
    }
    return newText
}