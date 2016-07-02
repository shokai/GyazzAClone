require('insert-css')(require('./index.styl'))

import $ from 'jquery'
import {last} from 'lodash'
import {Keys} from './keys'

console.log('Gyazz(A)Clone start')

var state = {
  page: 0,
  pages: []
}

convertLinesToSlide()
registerEvents()

function display (pageNumber) {
  for (let i = 0; i < state.pages.length; i++){
    let page = state.pages[i]
    for (let line of page) {
      if (pageNumber === i) $(line.dom).show()
      else $(line.dom).hide()
    }
  }
}

function registerEvents () {
  window.addEventListener('keydown', (e) => {
    switch (e.keyCode) {
      case Keys.LEFT: {
        if (state.page > 0) state.page -= 1
        display(state.page)
        break
      }
      case Keys.RIGHT: {
        if (state.page < state.pages.length - 2) state.page += 1
        display(state.page)
        break
      }
    }
  })
}

function convertLinesToSlide () {
  const lines = getLines()
  const blocks = getBlocks(lines)
  decorateBlocks(blocks)
  console.log(blocks)
  state.pages = blocks
  display(state.page)
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
    if (/^\s*$/.test(line.text)) {
      $(line.dom).hide()
      continue
    }
    last(blocks).push(line)
  }
  return blocks.filter(block => block.length > 0)
}

function decorateBlocks (blocks) {
  for (let block of blocks) {
    $(block[0].dom).css('font-size', '1.3em')
  }
  return blocks
}
