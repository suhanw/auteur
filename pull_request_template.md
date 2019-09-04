Reminders before merging with `master`: 
[] Remember to also merge with `ops/prod-gcp`. 
[] Have you checked with QA automation? They may need to push updated preprod tests. 
[] Are all relevant thestral configs turned on? This will enable preprod tests to detect any thestral-related bugs. 

Code review reminders:
[] Are there sufficient `null` checks (especially for Foxtrot modules)?
[] Are you sure this works in IE11?
