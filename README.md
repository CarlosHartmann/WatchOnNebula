# Watch on Nebula [proof of concept]

This Web Extension for Safari checks if a Youtube creator is also present on Nebula and alert the user with the option to access the same video on Nebula.

So far, the extension compares the Youtube uploader name with a given list of Nebula creators. This list can be updated with a supplied python script, though it is up to the user to implement this for themself.
When a match is detected, a standard Safari notification is triggered that lets the user access the same video on Nebula. The Nebula URL is guessed using some fixed rules, which does not always work due to Nebula's URL system being inconsistent (e.g. Jordan Harrod's videos sometimes contain `jordanharrod` and sometimes `jordan-harrod` as creator identifier.

To do:
* either implement a working check if a creator exists on Nebula via direct request, or implement an updating strategy so that the creator list stays up to date

Current status: This is currently only in private use. Requested support and advice from Nebula as to the logistics of this project. Other developers are welcome to fork and to plug this code into their local Xcode.
