import { useEffect, useState } from "react";

import "./App.css";

function App() {
  const [data, setData] = useState("");

  useEffect(() => {
    (async function () {
      const { text } = await (await fetch(`/data-api/rest/Driver`)).json();
      setData(text);
    })();
  });

  return (
    <>
      Here we go
      <div>{data}</div>
    </>
  );
}

export default App;
