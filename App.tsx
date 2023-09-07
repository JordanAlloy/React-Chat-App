import { useState } from "react";
// Import the functions you need from the firebase SDKs for data base and user authentication
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
// firebase hooks

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useRef } from "react";

// firebase initialize app to identify our project using const auth = firebase.auth() and const firestore = firebase.firestore() sdk as global variables
firebase.initializeApp({
  apiKey: "AIzaSyBEa7pDX48ZggflIHPJQD9d2b7KuZCzw_0",
  authDomain: "chatapp-f4197.firebaseapp.com",
  projectId: "chatapp-f4197",
  storageBucket: "chatapp-f4197.appspot.com",
  messagingSenderId: "149800004343",
  appId: "1:149800004343:web:88407fa738dc465f6281f2",
  measurementId: "G-EDYL70Q71P",
});

const auth = firebase.auth();
const firestore = firebase.firestore();
const [user] = useAuthState(auth);
// Initialize Firebase

function App() {
  <div className="App">
    <header></header>
  </div>;
  return (
    <>
      {/* if user, show chatroom else show signin */}
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </>
  );
}

function SignIn() {
  const SignInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.SignInWithPopup(provider);
  };
  return <button onClick={SignInWithGoogle}> sign in with google</button>;
}

function SignOut() {
  return (
    auth.currentUser && <button onClick={() => auth.SignOut()}>sign out</button>
  );
}

function ChatRoom() {
  const dummy = useRef();
  // reference a firestore collection
  const messageRef = firestore.collection("messages");
  const query = messageRef.orderBy("createAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messageRef.add({
      Text: formValue,
      createAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });
    setFormValue("");

    // allows the app to be smooth on scroll. Srcolls to bottom as page refreshes and messages sent
    dummy.current.ScrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {" "}
      <main>
        {messages && messages.map((msg) => <ChatMessage key={msg.id} />)}

        <div ref={dummy}></div>
      </main>
      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
}
function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
  return (
    <div className={`message ${messageClass}`}>
      {""}
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  );
}

export default App;
