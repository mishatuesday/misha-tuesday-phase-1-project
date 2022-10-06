# Random Acts of Random

Random Acts of Random is a game which assigns and tracks completion of random activities in the categories of social, relaxation, recreation, education, life-maintenance, charity, D.I.Y. (do-it-yourself), music, and cooking.

## Installation

Clone repo to a local directory and run `json-server --watch db.json`

## Usage

Opening index.html will assign 5 activities, or 'missions.' The default image for each mission is
the icon for the category as enumerated above. Depending on the state of the mission library, there may already be custom images added for some of the missions. You can add or replace image URLs for any assigned mission. You can also mark missions complete (when you have done them--honor system!)

Once three or more missions are complete, you may click the 'Get All New Missions' button, which replaces all assigned missions with five newly selected missions. If you get missions you've done before, any custom images added will be retained.

## Further Background

The mission library was assembled from Bored API (https://www.boredapi.com/activity). This project also includes init.js and init.html, which allow you to pull more missions in batches from the Bored API and add them to the local mission library (db.json)

At this time, there is no way to remove missions from the db.json file other than manually, which is not recommended (particularly because if the id numbers aren't sequential, the app will start behaving strangely)
## Contributing
I doubt this project has contributing appeal, but I guess I'll allow forking if you want to play with it.
## License
(K) All Rites Reversed.