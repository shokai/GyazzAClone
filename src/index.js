import $ from 'jquery'
import {last} from 'lodash'

console.log('Gyazz(A)Clone start')

convertLinesToSlide()

function convertLinesToSlide () {
  const lines = getLines()
  const blocks = getBlocks(lines)
  console.log(blocks)
}

function getLines () {
  const lines = $('.lines .line')
  console.log(`${lines.length} liens found`)
  const result = []
  for (let index = 0; index < lines.length; index++) {
    let line = lines[index]
    let $_ = $(line)
    let text = $_.text()
    let indent = text.match(/^(\\t)*/)[0].length/2
    result.push({ dom: line, text, indent, index })
  }
  return result
}

function getBlocks (lines) {
  const blocks = [ [] ]
  for (let line of lines) {
    if (line.indent < 1 && line.text.length > 0 && last(blocks).length > 0){
      blocks.push([])
      line.blockHead = true
    }
    if (line.text.length < 1) continue
    last(blocks).push(line)
  }
  return blocks
}
