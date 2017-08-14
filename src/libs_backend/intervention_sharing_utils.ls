# author_info.email = the email address
# author_info.id = the author id
export upload_intervention = (intervention_info, author_info) ->>
  # TODO
  return {status: 'success', url: 'https://habitlab.stanford.edu'}

# author_info.email = the email address
# author_info.id = the author id
export list_interventions_for_author = (author_info) ->>
  return []


