let skfjd=3
const skagjls=7
if (df) {
asdf
} else {
sadf
}

/*
LiveScript code is displayed on the left side,
which is compiled to JavaScript on the right.
To learn LiveScript, see http://livescript.net/

If you would prefer to write in JavaScript,
select JavaScript from the dropdown menu above.
To learn JavaScript, see https://www.javascript.com/try

This sample intervention will display a popup with SweetAlert.
Click the 'Try Now' button to see it run.

To learn how to write HabitLab interventions, see
https://github.com/habitlab/habitlab/wiki/Writing-Interventions-within-HabitLab

require_package: returns an NPM module, and ensures that the CSS it uses is loaded
https://github.com/habitlab/habitlab/wiki/require_package
*/
var swal;
swal = require_package('sweetalert2');
swal({
  title: 'Hello World',
  text: 'This is a sample intervention'
});
