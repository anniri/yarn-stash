# yarn-stash

App concept developed with React Native Expo with React Native Paper as a component library. App's idea is to keep track of crafter's owned yarns and projects that are on their to-do list. 

Crafter can add details of yarn/pattern and see a listing of added items.

When crafter views single yarn/pattern, the app also notifies if there are matching patterns or yarns. The most important info is yarn weight which is used to determine, whether a yarn/pattern matches a pattern/yarn.

App was developed as a college course's practice work and is in a concept stage. Current features include:
- Adding a yarn/pattern. Information is stored in app's SQLite database (created with Expo's SQLite library).
- When adding a new yarn/pattern, user can attach a picture of it. Picture can be added with phone's camera (Expo Camera component) or downloaded from a web url. Pictures are saved in app's local storage.
- User can see a listing of patterns and yarns that are added to the database.
- When a yarn or a pattern is clicked, user can see its details.
- Yarn's detailed info ends with patterns matching that yarn. When yarn is opened, patterns' database table is queried for patterns which recommended yarn weight matches yarn's weight. Same is done vice versa when viewing details of a single pattern.
