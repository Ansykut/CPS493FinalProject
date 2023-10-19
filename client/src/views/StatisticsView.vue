<template>
    <div class="statistics">
      <h1>Extra Credit</h1>
      <p>You don't need a comprehensive statistics page. The simple statistics on the home page will do</p>
    </div>
  </template>
  
  <style>
  @media (min-width: 1024px) {
    .statistics {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  
    .statistics h1 {
      font-size: 2em;  /* Larger font size for "Extra Credit" */
      font-weight: bold; /* Bold font weight for "Extra Credit" */
      margin-bottom: 1em; /* Space between the title and the paragraph */
    }
  
    .statistics p {
      font-size: 1em;  /* Smaller font size for the text below */
    }
  }
  </style>