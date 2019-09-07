# EasyQueue - SYND iNNOVATE
## Automated Queue Management System for Branch.
I propose EasyQueue - a solution for developing Automated Queue Management System for Walk-In-Customer in the Branch with the help of  QR Codes. It will have following features:
1. The customer should be able to scan QR code to get the ticket, which will guide the customer further by informing the counter number to serve him at the earliest.
2. The system shall automatically re-schedule the counter to maintain FIFO order depending on customer requirements.
3. Centralized monitoring system shall analyze the queue data, suggest the Branch to improve turnaround time and rank the branches accordingly.
4. Gathering feedback regarding Ambience & Cleanliness while waiting in the queue.
5. Ranking the branches according to their feedback also.

## Proposed solution
1. An `EasyQueue` mobile application for both Android and iOS.
2. Server application for individual branches.
3. Centralized system for monitoring and recommendation.

Since the server will be distributed, it will be easy to add another system, and the load will be balanced.

### Mobile Applications
The source code can be found in `EasyQueue-MobileApp\EasyQueue`.

#### Building the app yourself:
1. Building app
```sh
$ git clone https://github.com/dvkcool/Synd-innovate_QueueManagement
$ cd Synd-innovate_QueueManagement/EasyQueue-MobileApp/EasyQueue
$ npm install
$ react-native run-android
```
2. Running local server.
```sh
$ cd Synd-innovate_QueueManagement/server1
$ npm install
$ node server.js
```

#### Screenshots:
1. Welcome Screen:
<img src="https://raw.githubusercontent.com/dvkcool/Synd-innovate_QueueManagement/master/screenshots/Main_page.png" width="300"/>
2. Select a service to register in queue:
<img src="https://raw.githubusercontent.com/dvkcool/Synd-innovate_QueueManagement/master/screenshots/Service_select.png" width="300"/>
3. Scan QR code:
<img src="https://raw.githubusercontent.com/dvkcool/Synd-innovate_QueueManagement/master/screenshots/QR_code_scan.png" width="300"/>
4. If invalid QR code:
<img src="https://raw.githubusercontent.com/dvkcool/Synd-innovate_QueueManagement/master/screenshots/InvalidQR.png" width="300"/>
5. Waiting Screen:
<img src="https://raw.githubusercontent.com/dvkcool/Synd-innovate_QueueManagement/master/screenshots/Waiting_Screen.png" width="300"/>
6. Cancelling Ticket:
<img src="https://raw.githubusercontent.com/dvkcool/Synd-innovate_QueueManagement/master/screenshots/Cancel_Ticket.png" width="300"/>



### Branch Server(s)
The code can be found in `server1`, `server2`: The source code is same just different instances to demonstrate two different branches.


## Found a bug?
This is still a work in progress, please wait to let it complete.
Still you are welcome to open a issue, submit a PR or send me an email at `divyanshukumarg@gmail.com`.
_______________________________
Happy Coding
_______________________________
Divyanshu Kumar
_______________________________
https://dvkcool.github.io
<br>
Team Infinite_Debug
