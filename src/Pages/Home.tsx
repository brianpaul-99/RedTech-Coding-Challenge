import React, { useEffect, useState } from "react";
import "./Home.css";
import AddIcon from "../assets/addIcon.svg";
import DeleteIcon from "../assets/deleteIcon.svg";
import ExpandIcon from "../assets/expandIcon.svg";
import SearchIcon from "../assets/searchIcon.svg";
import CheckIcon from "../assets/checkIcon.svg";
import axios from "axios";

var options: string[] = [
  "None",
  "Standard",
  "SaleOrder",
  "PurchaseOrder",
  "TransferOrder",
  "ReturnOrder",
];

interface props {
  setOrders: React.Dispatch<React.SetStateAction<any[]>>;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

function CreateOrder({ setOrders, setShowForm }: props) {
  const [created, setCreated] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [customer, setCustomer] = useState<string>("");

  //add new order to existing set of orders
  function addOrder() {
    if (!created || !type || !customer) {
      alert("All fields must be filled!");
      return;
    }
    const months: string[] = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const days: string[] = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    let date = new Date();

    //compute date string
    let fullDate: string =
      days[date.getDay()] +
      ", " +
      date.getDate() +
      " " +
      months[date.getMonth()] +
      " " +
      date.getFullYear();

    let id = Math.random().toString(36).substring(2);
    let newOrder: object = {
      createdByUserName: created,
      createdDate: fullDate,
      customerName: customer,
      orderId: id,
      orderType: type,
      selected: false,
    };

    setOrders((orders) => [...orders, newOrder]);
    setShowForm(false);
  }
  return (
    <div className="formSection">
      <div className="underlay" onClick={() => setShowForm(false)} />

      <div className="form">
        <h2>Create an Order</h2>
        <div className="inputRow">
          <div>
            <strong>Created By:</strong>
            <input
              value={created}
              onChange={(e) => setCreated(e.target.value.trim())}
            />
          </div>
          <div>
            <strong>Order Type:</strong>
            <input
              value={type}
              onChange={(e) => setType(e.target.value.trim())}
            />
          </div>
          <div>
            <strong>Customer:</strong>
            <input
              value={customer}
              onChange={(e) => setCustomer(e.target.value.trim())}
            />
          </div>
        </div>
        <button type="submit" onClick={addOrder}>
          Submit
        </button>
      </div>
    </div>
  );
}

function Home() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [type, setType] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    //update filtered orders whenever orders changes
    setFilteredOrders(orders);
  }, [orders]);

  useEffect(() => {
    //when the order type filter is changed, refetch orders from  api
    getOrders();
  }, [type]);

  function getOrders() {
    //check if a specific order type has been selected
    let extension = type === "" ? "" : "ByType?orderType=" + type;
    axios
      .get(
        "https://red-candidate-web.azurewebsites.net/api/Orders/" + extension,
        {
          headers: {
            ApiKey: "b7b77702-b4ec-4960-b3f7-7d40e44cf5f4",
          },
        }
      )
      .then((res) =>
        setOrders(res.data.map((d: object) => ({ ...d, selected: false })))
      );
  }

  //update the respoective order's selected boolean if it was clicked
  function updateClickedBox(id: String) {
    setOrders(
      orders.map((order) => {
        if (order.orderId === id) {
          order.selected = !order.selected;
        }
        return order;
      })
    );
  }
  //filter order based on search value
  function searchOrders() {
    if (searchValue === "") setFilteredOrders(orders);
    else
      setFilteredOrders(orders.filter((o) => o.orderId.includes(searchValue)));
  }

  //delete selected orders
  function deleteOrders() {
    setOrders(orders.filter((o) => !o.selected));
  }

  //Change the current type for the dropdown menu filter
  function changeType(option: string) {
    setShowOptions(false);
    if (option === "None") setType("");
    else setType(option);
  }

  return (
    <div className="home">
      {/*renders the create order form if user is interacting with the interface */}
      {showForm ? (
        <CreateOrder setOrders={setOrders} setShowForm={setShowForm} />
      ) : (
        <></>
      )}
      {/*toolbar for home page */}
      <div className="optionsBar">
        <div className="searchBar">
          <input
            placeholder="Customer Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value.trim())}
          ></input>
          <button onClick={searchOrders}>
            <img src={SearchIcon} />
          </button>
        </div>
        <button onClick={() => setShowForm(true)}>
          <img src={AddIcon}></img>
          <h4>CREATE ORDER</h4>
        </button>
        <button onClick={deleteOrders}>
          <img src={DeleteIcon}></img>
          <h4>DELETE SELECTED</h4>
        </button>
        <div className="filterSection">
          <div
            onClick={() => setShowOptions(!showOptions)}
            className="orderFilter"
          >
            <input
              placeholder="Order Type"
              type="text"
              readOnly
              value={type}
            ></input>
            <img src={ExpandIcon}></img>
          </div>
          {showOptions ? (
            <div className="filterOptions">
              {options.map((op) => (
                <div onClick={() => changeType(op)}>{op}</div>
              ))}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      {/*list of orders that users can see */}
      <div className="orderList">
        <div>
          <div className="checkBox"></div>
          <h5 className="column1">OrderID</h5>
          <h5 className="column1">Custom Date</h5>
          <h5 className="column2">Created By</h5>
          <h5 className="column1">Order Type</h5>
          <h5 className="column1">Customer</h5>
        </div>
        {filteredOrders.map((order) => (
          <div>
            <div
              onClick={() => updateClickedBox(order.orderId)}
              className="checkBox"
            >
              {order.selected ? (
                <img id="checked" src={CheckIcon} />
              ) : (
                <div id="unchecked" />
              )}
            </div>
            <h5 className="column1">{order.orderId}</h5>
            <h5 className="column1">{order.createdDate}</h5>
            <h5 className="column2">{order.createdByUserName}</h5>
            <h5 className="column1">{order.orderType}</h5>
            <h5 className="column1">{order.customerName}</h5>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
