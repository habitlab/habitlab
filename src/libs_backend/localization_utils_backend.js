async function record_unlocalized_string(text) {
  let unlocalized_strings_num_encounters = localStorage.getItem('unlocalized_strings_num_encounters');
  let unlocalized_strings_times_encountered = localStorage.getItem('unlocalized_strings_times_encountered');
  if (unlocalized_strings_num_encounters != null) {
    unlocalized_strings_num_encounters = JSON.parse(unlocalized_strings_num_encounters);
  } else {
    unlocalized_strings_num_encounters = {};
  }
  if (unlocalized_strings_times_encountered != null) {
    unlocalized_strings_times_encountered = JSON.parse(unlocalized_strings_times_encountered);
  } else {
    unlocalized_strings_times_encountered = {};
  }
  unlocalized_strings_times_encountered[text] = Date.now();
  if (unlocalized_strings_num_encounters[text] != null) {
    unlocalized_strings_num_encounters[text] += 1;
  } else {
    unlocalized_strings_num_encounters[text] = 1;
  }
  localStorage.setItem('unlocalized_strings_num_encounters', JSON.stringify(unlocalized_strings_num_encounters));
  localStorage.setItem('unlocalized_strings_times_encountered', JSON.stringify(unlocalized_strings_times_encountered));
  return;
}

async function record_localized_string(text) {
  let localized_strings_num_encounters = localStorage.getItem('localized_strings_num_encounters');
  let localized_strings_times_encountered = localStorage.getItem('localized_strings_times_encountered');
  if (localized_strings_num_encounters != null) {
    localized_strings_num_encounters = JSON.parse(localized_strings_num_encounters);
  } else {
    localized_strings_num_encounters = {};
  }
  if (localized_strings_times_encountered != null) {
    localized_strings_times_encountered = JSON.parse(localized_strings_times_encountered);
  } else {
    localized_strings_times_encountered = {};
  }
  localized_strings_times_encountered[text] = Date.now();
  if (localized_strings_num_encounters[text] != null) {
    localized_strings_num_encounters[text] += 1;
  } else {
    localized_strings_num_encounters[text] = 1;
  }
  localStorage.setItem('localized_strings_num_encounters', JSON.stringify(localized_strings_num_encounters));
  localStorage.setItem('localized_strings_times_encountered', JSON.stringify(localized_strings_times_encountered));
  return;
}

module.exports = {
  record_unlocalized_string,
  record_localized_string
}
