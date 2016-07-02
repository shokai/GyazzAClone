require('insert-css')(require('./index.styl'))

import $ from 'jquery'
import {last} from 'lodash'
import {Keys} from './keys'

window.$ = $

console.log('Gyazz(A)Clone start') // eslint-disable-line

var state = {
  page: Number.parseInt(localStorage.GyazzAClonePage) || 0,
  pages: []
}

convertLinesToSlide()
registerEvents()

function display () {
  if (state.page < 0) state.page = 0
  else if (state.page > state.pages.length - 1) state.page = state.pages.length - 1
  localStorage.GyazzAClonePage = String(state.page)
  for (let i = 0; i < state.pages.length; i++){
    let page = state.pages[i]
    for (let line of page) {
      if (state.page === i) $(line.dom).show()
      else $(line.dom).hide()
    }
  }
}

function registerEvents () {
  window.addEventListener('keydown', (e) => {
    switch (e.keyCode) {
      case Keys.LEFT: {
        if (state.page > 0) state.page -= 1
        display()
        break
      }
      case Keys.RIGHT: {
        if (state.page < state.pages.length - 1) state.page += 1
        display()
        break
      }
    }
  })
}

function convertLinesToSlide () {
  const lines = getLines()
  const blocks = getBlocks(lines)
  decorateBlocks(blocks)
  state.pages = blocks
  display(state.page)
}

function getLines () {
  const lines = $('.lines .line')
  console.log(`${lines.length} liens found`) // eslint-disable-line
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

function isEmptyLine (line) {
  return /^\s*$/.test(line.text) && $(line.dom).find('img').length < 1
}

function getBlocks (lines) {
  const blocks = [ [ lines[0] ] ]
  for (let i = 1; i < lines.length; i++) {
    let line = lines[i]
    if (line.indent === 0 && !isEmptyLine(line) && isEmptyLine(lines[i-1])) {
      blocks.push([])
      $(line.dom).addClass('blockHead')
    }
    last(blocks).push(line)
  }
  return blocks.filter(block => block.length > 0)
}

function decorateBlocks (blocks) {
  for (let block of blocks) {
    $(block[0].dom).addClass('ac-page-title')
  }
  return blocks
}
