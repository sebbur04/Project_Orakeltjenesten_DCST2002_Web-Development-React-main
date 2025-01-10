import * as React from "react";
import { createRoot } from "react-dom/client";
import { Component } from "react-simplified";
import { Card, Form, Row, Button, Alert } from "./widgets"; 
import { useState, useEffect } from "react";
import { NavLink, HashRouter, Route, useParams } from "react-router-dom";
import { createHashHistory } from "history"; // Brukes for å lagre darkmode state lokalt, slik at den ikke endres hver gang man går til en ny side, eller
                                             // refresher siden.                         

// Dark Mode Button Component
export default function DarkModeButton() {
  // Lagrer darkMode state i localStorage. URL:https://www.freecodecamp.org/news/how-to-use-localstorage-with-react-hooks-to-set-and-get-items/
  // Bruker localStorage.getItem('darkMode') for å hente darkMode state fra localStorage. Hvis det ikke finnes en state, settes den til false.
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true'; // sjekker om darkMode er lagret fra den forrige sesjonen. Hvis den er det, returneres true, ellers false.
  });

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode); // Oppdaterer darkMode state
    document.body.classList.toggle('dark-mode', newMode); // Bytter mellom dark-mode og light-mode klassen på body
    localStorage.setItem('darkMode', newMode.toString()); // Lagrer darkMode state i localStorage
  };


  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    }
  }, [darkMode]); // Dependency array. Kjører useEffect hver gang darkMode endres. URL: https://react.dev/reference/react/useEffect#specifying-reactive-dependencies

  // Render av dark mode button
  return (
    <button className="dark-mode-button" onClick={toggleDarkMode}>
      <img
        src={darkMode ? '/light-mode-icon.png' : '/dark-mode-icon.png'} // Lightmode icon hvis darkmode er true, og omvendt
        alt={darkMode ? 'Light Mode' : 'Dark Mode'} // Hvis iconet ikke dukker opp, vises teksten "Light Mode" eller "Dark Mode". Ble brukt i starten for å se om iconet ble lastet inn. 
        style={{ width: '30px', height: '30px' }} // Størrelse på ikonet
      />
    </button>
  );
}