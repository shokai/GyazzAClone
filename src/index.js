const acCss = require('insert-css')(require('./index.styl'))

import $ from 'jquery'
import {last} from 'lodash'
import {Keys} from './keys'

window.$ = $

console.log('Gyazz(A)Clone start') // eslint-disable-line
$('body').addClass('presentation')

var state = {
  page: Number.parseInt(localStorage.GyazzAClonePage) || 0,
  pages: []
}

convertLinesToSlide()
registerEvents()
const convertLinesInterval = setInterval(convertLinesToSlide, 500)

function display () {
  if (state.page < 0) state.page = 0
  else if (state.page > state.pages.length - 1) state.page = state.pages.length - 1
  localStorage.GyazzAClonePage = String(state.page)
  for (let i = 0; i < state.pages.length; i++){
    let page = state.pages[i]
    for (let line of page) {
      if (state.page === i) $(line).show()
      else $(line).hide()
    }
  }
}

function onKeydown (e) {
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
    case Keys.ESC: {
      exitPresentation()
      break
    }
  }
}

function registerEvents () {
  window.addEventListener('keydown', onKeydown, false)
}

function convertLinesToSlide () {
  const lines = getLines()
  const blocks = getBlocks(lines)
  state.pages = blocks
  display(state.page)
}

function getLines () {
  const lines = $('.lines > .line, .table-block')
  console.log(`${lines.length} liens found`) // eslint-disable-line
  const result = []
  for (let i = 0; i < lines.length; i++) {
    result.push(lines[i])
  }
  return result
}

function getBlocks (lines) {
  const blocks = [ [ lines[0] ] ]
  for (let i = 1; i < lines.length; i++) {
    let line = lines[i]
    if (line.attributes.class.value.split(/\s/).includes('section-title')) {
      blocks.push([])
    }
    last(blocks).push(line)
  }
  return blocks.filter(block => block.length > 0)
}

function exitPresentation () {
  console.log('Exit Presentation Mode.')

  // Remove classes, events and intervals
  // ignored: .blockHead, .ac-page-title
  acCss.remove()
  clearInterval(convertLinesInterval)
  window.removeEventListener('keydown', onKeydown, false)
  $('body').removeClass('presentation')

  // display all lines
  for (let i = 0; i < state.pages.length; i++){
    let page = state.pages[i]
    for (let line of page) {
      $(line).show()
    }
  }
}
