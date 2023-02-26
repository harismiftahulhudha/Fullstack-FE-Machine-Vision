export function useTrimText(text, max) {
    if (text.length <= max) {
        return text
    } else {
        return `${text.substring(0, max)}...`
    }
}