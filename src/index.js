import $ from 'jquery'

console.log('Gyazz(A)Clone start')

convertLinesToSlide()

function convertLinesToSlide () {
  const lines = getLines()
  console.log(lines)
}

function getLines () {
  let lines = $('.lines .line')
  console.log(`${lines.length} liens found`)
  const result = []
  for (let index = 0; index < lines.length; index++) {
    let line = lines[index]
    let $_ = $(line)
    let text = $_.text()
    let indent = text.match(/^(\s*)/)[0].length
    result.push({ dom: line, text, indent, index })
  }
  return result
}
