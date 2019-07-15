import $ from 'jquery'
import { extract } from 'css-scaffolder'

$('#button').on('click', function() {
  const css = extract($('#html').val())
  $('#css').val(css)
})
