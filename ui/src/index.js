import $ from 'jquery'
import { extract } from 'css-scaffolder'

$('#button').on('click', function() {
  const options = { reset: reset }

  options.reset = $('#reset').prop('checked')

  const ignore = $('#ignore').val()
  if (ignore) {
    options.ignorePatternForSingleClass = new RegExp(ignore)
    console.log(options.ignorePatternForSingleClass)
  }

  const css = extract($('#html').val(), options)
  $('#css').val(css)
})
