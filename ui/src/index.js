import $ from 'jquery'
import { extract } from 'css-scaffolder'

$('#button').on('click', function() {
  const options = { reset: reset }

  options.reset = $('#reset').prop('checked')

  const ignore = $('#ignore').val()
  if (ignore) {
    options.modifierPattern = new RegExp(ignore)
  }

  const css = extract($('#html').val(), options)
  $('#css').val(css)
})
