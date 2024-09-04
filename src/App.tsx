import ListGroup from "./components/ListGroup";
import Alert from "./components/Alert";
import Button from "./components/Button";
import { useState } from "react";
import GameBoard from "./components/GameBoard";

function App() {
  const tutorial = false;

  if (tutorial) {
    //npm run dev
    let items = [
      "New York",
      "Orlando",
      "okc",
      "your moms house",
      "100 acre woods",
    ];

    const handleSelectItem = (item: string) => {
      console.log(item);
    };

    const [isAlertShowing, setAlertShowing] = useState(false);

    return (
      <div>
        {isAlertShowing && (
          <Alert onDismiss={() => setAlertShowing(false)}>
            Hello this is an alert
          </Alert>
        )}
        <Button color="primary" onClick={() => setAlertShowing(true)}>
          BUTTON!
        </Button>
        {/* <ListGroup
        items={items}
        heading="Cities"
        onSelectItem={handleSelectItem}
      /> */}
      </div>
    );
  } else {
    return <GameBoard></GameBoard>;
  }
}

export default App;
