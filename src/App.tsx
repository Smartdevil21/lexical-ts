import "./App.css";
import Editor from "./components/Editor/Editor";

function App() {
  // const [counter, setCounter] = useState(0);
  // const [isToggled, setIsToggled] = useState(false);

  // const incrementCounter = () => {
  //   setCounter((prev) => prev + 1);
  // };

  // const highComputaionalFunc = (num: number) => {
  //   for (let i = 0; i <= 1000000000; i++) {
  //     //
  //   }
  //   return num;
  // };

  // const highComputedValue = useMemo(() => {
  //   return highComputaionalFunc(counter);
  // }, [counter]);

  // const toggleValue = () => {
  //   setIsToggled((prev) => !prev);
  // };

  return (
    <>
      <div className="app">
        <br />
        <h1>Lexical Code Editor</h1>
        <Editor />
        {/* <Button onClick={incrementCounter}>Increment</Button>
        <p>Counter Value is: {highComputedValue}</p>
        <Button onClick={toggleValue}>
          {isToggled ? "You toggled me." : "Toggle Me"}
        </Button> */}
      </div>
    </>
  );
}

export default App;
