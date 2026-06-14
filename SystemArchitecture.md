# **MoodFLOW Architecture**
Addina Rahaman

## High Level Component Diagram
<img width="542" height="204" alt="Screenshot 2026-04-20 at 2 35 09 PM" src="https://github.com/user-attachments/assets/b4f84339-14e0-48d0-b407-f118db75690e" />
MoodFLOW is set up so that when a web client makes an HTTP Request to the frontend, the frontend interacts with both the backend (to receive mood scores and formatted mood data), as well as Firestore (to save mood data). The backend also interacts with Firebase to fetch the user's mood data in order to aggregate and format it.  

## Entity Diagram
<img width="487" height="269" alt="Screenshot 2026-04-20 at 3 19 31 PM" src="https://github.com/user-attachments/assets/52d9777d-f04a-4bf1-a680-87c142243d43" />
MoodFLOW has a NoSQL database with Firestore, meaning that it is semistructured and that entities are related by either references or subcollections rather than foregin key relationships. In addition, the 'primary key' of a record (or document in this case) is simply regarded as the Document's ID. MoodFLOW has one main collection called **users** which has 8 fields, and and each user doc has a subcollection **moodEntries** which has 4 fields (5 if you include the document's id). This means that users and moodEntries has a one to many relationship, as noted in the diagram. 

## Call Sequence Diagram 
<img width="743" height="465" alt="Screenshot 2026-04-20 at 3 31 55 PM" src="https://github.com/user-attachments/assets/1788f800-d33b-4cba-98cd-e4b17607887f" />
A user would select an emoji and enter a note about how they felt about the day. The emoji is automatically mapped to an `emojiScore` value from 1-5. After clicking 'Save Entry' on the frontend, this would send a POST request to `\analyzeMood` in the backend. This endpoint would call the `getAugmentedMoodScore` method in the `MoodAnalyzer` class which converts `emojiScore` and the raw `text` to a `moodScore`. This `moodScore` is sent back to the frontend if the status is 200 OK. The frontend saves the `emojiScore`, `moodScore`, and `note` (which is the raw text) as a new moodEntry in Firestore under the user. This new moodEntry is displayed on the frontend and success state is displayed. If the success state is displayed, this indicates that the moodEntry has been successfully saved and that the `MoodChart` can update with the new data. The frontend automatically sends a POST request under `/mood-trends` in the backend to fetch the data from Firestore and format it according to the selected `chartRange`. The backend sends the formatted data to the frontend if status code is 200 OK and displays the mood chart for the user. 
