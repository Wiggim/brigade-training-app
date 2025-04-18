'use client';
import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebaseConfig";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";

export default function Firetrain() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) loadHistory();
    });
  }, []);

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setResult("");
  };

  const generate = async () => {
    try {
      const response = await fetch("/api/generate-training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setResult(data.result);

      await addDoc(collection(db, "scenarios"), {
        user: user.email,
        prompt,
        result: data.result,
        createdAt: new Date(),
      });

      loadHistory();
    } catch (err) {
      alert("Error generating training: " + err.message);
    }
  };

  const loadHistory = async () => {
    const q = query(collection(db, "scenarios"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push(doc.data());
    });
    setHistory(items);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      {!user ? (
        <div>
          <h2>Login to FireTrain</h2>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <br />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <br />
          <button onClick={login}>Login</button>
        </div>
      ) : (
        <div>
          <h2>FireTrain.AI</h2>
          <p>Welcome, {user.email} <button onClick={logout}>Logout</button></p>
          <textarea rows="3" cols="60" placeholder="Describe the scenario..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          <br />
          <button onClick={generate}>Generate Scenario</button>
          <pre>{result}</pre>
          <h3>Past Scenarios</h3>
          <ul>
            {history.map((item, index) => (
              <li key={index}><strong>{item.prompt}</strong><p>{item.result}</p></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
