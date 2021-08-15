
import logo from './logo.svg';
import './App.css';
// import { useStartDb } from './hooks/store-db.hooks';
import { connection } from './db/connection.db';
import { productTableName } from './db/database/tables/products.table';
var value = {
  itemName: 'Blue Jeans',
  price: 2000,
  quantity: 1000,
  "availability_zones": {
    "eu-west-1": [
      "euw1-az1",
      "euw1-az2",
      "euw1-az3"
    ],
    "us-east-1": [
      "use1-az1",
      "use1-az2",
      "use1-az4",
      "use1-az6"
    ],
    "us-west-2": [
      "usw2-az1",
      "usw2-az2",
      "usw2-az3",
      "usw2-az4"
    ]
  },
}


function App() {
  //  useStartDb("school");


  const upLoadData = async () => {
    var insertCount = await connection.insert({
      into: productTableName,
      values: [value, { ...value }],
      upsert: true,
      skipDataCheck: false,
      return: true
    });

    console.log(`${insertCount} rows inserted`, insertCount);

  }

  const readData = async () => {
    var results = await connection.select({
      from: productTableName,
      where: {
        id: 1
      }
    });

    console.log(results.length + 'record found', results);
  }

  const updateData = async () => {
    var rowsUpdated = await connection.update({
      in: productTableName,
      where: {
        itemName: {
          like: '%blue%'
        }
      },
      set: {
        quantity: 3000
      }
    });

    console.log(rowsUpdated, ' rows updated');

  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        <div className="flex ">
          <button className="px-3 py-2 bg-white text-blue-600 rounded mt-6 mr-6"
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => upLoadData()}>
            Insert Data
          </button>

          <button className="px-3 py-2 bg-white text-green-600 rounded mt-6 mr-5"
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => readData()}>
            Read Data
          </button>

          <button className="px-3 py-2 bg-white text-green-600 rounded mt-6 mr-5"
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => updateData()}>
            Update Data
          </button>

          {/* <button className="px-3 py-2 bg-white text-pink-600 rounded mt-6 "
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => fetchData()}>
            Fetch File Data
          </button> */}
        </div>

      </header>
    </div>
  );
}

export default App;
