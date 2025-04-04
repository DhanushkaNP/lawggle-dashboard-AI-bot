"use client";

import React from "react";
import Chat from "./components/chat";

const Home = () => {
  return (
    <main className="flex h-screen w-screen flex-col">
      <div className="flex-1 w-full h-full">
        <Chat />
      </div>
    </main>
  );
};

export default Home;
